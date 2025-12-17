import { parseSqlModel } from './sqlParser'
import { JinjaRenderer, type DbtTarget, type RunQueryResult } from './jinjaRenderer'

export type VirtualFileSystem = Record<string, string>

export type CommandResult = {
  output: string
  exitCode: number
  workingDirectory?: string
  updatedFileSystem?: VirtualFileSystem
}

type ModelInfo = {
  name: string
  path: string
  rawSql: string
  refs: string[]
}

type TestInfo = {
  modelName: string
  columnName: string
  testName: string
}

const SIMULATOR_ROOT = '/dbt-project'
const DBT_VERSION = '1.8.0'
const PROJECT_NAME = 'my_dbt_project'

type SelectorConfig = {
  select: string[]
}

function normalizePosixPath(path: string) {
  const parts: string[] = []
  for (const part of path.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') {
      parts.pop()
      continue
    }
    parts.push(part)
  }
  return `/${parts.join('/')}`
}

function stripSimulatorRoot(absolutePath: string) {
  if (absolutePath === SIMULATOR_ROOT) return ''
  const prefix = `${SIMULATOR_ROOT}/`
  if (!absolutePath.startsWith(prefix)) return null
  return absolutePath.slice(prefix.length)
}

function joinPaths(base: string, next: string) {
  if (next.startsWith('/')) return normalizePosixPath(next)
  return normalizePosixPath(`${base}/${next}`)
}

function splitArgs(input: string) {
  const args: string[] = []
  let current = ''
  let inQuote: '"' | "'" | null = null

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]
    if ((ch === '"' || ch === "'") && (inQuote === null || inQuote === ch)) {
      inQuote = inQuote === null ? (ch as '"' | "'") : null
      continue
    }
    if (ch === ' ' && inQuote === null) {
      if (current) args.push(current)
      current = ''
      continue
    }
    current += ch
  }

  if (current) args.push(current)
  return args
}

function parseDbtArgs(args: string[]): SelectorConfig {
  const select: string[] = []

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i]
    if (token === '--select' || token === '-s') {
      const next = args[i + 1]
      if (next) {
        select.push(...next.split(',').map((s) => s.trim()).filter(Boolean))
        i += 1
      }
    }
  }

  return { select }
}

function matchesSelector(model: ModelInfo, selector: string) {
  const sel = selector.trim()
  if (!sel) return false

  if (sel.startsWith('path:')) {
    const wanted = sel.slice('path:'.length)
    return model.path.includes(wanted)
  }

  if (sel.endsWith('.*')) {
    const prefix = sel.slice(0, -2)
    return model.path.includes(`/${prefix}/`)
  }

  // Extremely small subset: "marts.fct_orders" / "staging.stg_orders"
  if (sel.includes('.')) {
    const parts = sel.split('.').filter(Boolean)
    const name = parts.at(-1) ?? ''
    const folders = parts.slice(0, -1)
    const folderMatch = folders.length === 0 || folders.every((f) => model.path.includes(`/${f}/`))
    const nameMatch = !name || model.name === name || model.name.includes(name)
    return folderMatch && nameMatch
  }

  // Plain model name or folder hint
  if (model.name === sel || model.name.includes(sel)) return true
  if (model.path.includes(`/${sel}/`)) return true
  if (model.path.includes(sel)) return true
  return false
}

function filterModels(models: ModelInfo[], selectorConfig: SelectorConfig) {
  if (!selectorConfig.select.length) return models
  return models.filter((m) => selectorConfig.select.some((sel) => matchesSelector(m, sel)))
}

function listDirectory(vfs: VirtualFileSystem, dirKey: string) {
  const prefix = dirKey ? `${dirKey}/` : ''
  const entries = new Map<string, 'file' | 'directory'>()

  for (const key of Object.keys(vfs)) {
    if (!key.startsWith(prefix)) continue
    const remainder = key.slice(prefix.length)
    const [first, ...rest] = remainder.split('/')
    if (!first) continue
    entries.set(first, rest.length > 0 ? 'directory' : 'file')
  }

  return Array.from(entries.entries())
    .map(([name, type]) => ({ name, type }))
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
}

function findDirectoryExists(vfs: VirtualFileSystem, dirKey: string) {
  if (!dirKey) return true
  const prefix = `${dirKey}/`
  return Object.keys(vfs).some((key) => key.startsWith(prefix))
}

function getMacroBundle(vfs: VirtualFileSystem) {
  const macroFiles = Object.entries(vfs)
    .filter(([path]) => path.startsWith('macros/') && path.endsWith('.sql'))
    .sort(([a], [b]) => a.localeCompare(b))

  return macroFiles.map(([, content]) => content).join('\n')
}

function topologicalSort(models: ModelInfo[]) {
  const byName = new Map(models.map((m) => [m.name, m]))
  const inDegree = new Map<string, number>()
  const edges = new Map<string, Set<string>>()

  for (const model of models) {
    inDegree.set(model.name, 0)
    edges.set(model.name, new Set())
  }

  for (const model of models) {
    for (const ref of model.refs) {
      if (!byName.has(ref)) continue
      edges.get(ref)?.add(model.name)
      inDegree.set(model.name, (inDegree.get(model.name) ?? 0) + 1)
    }
  }

  const queue: string[] = []
  for (const [name, degree] of inDegree.entries()) {
    if (degree === 0) queue.push(name)
  }
  queue.sort()

  const order: ModelInfo[] = []
  while (queue.length > 0) {
    const name = queue.shift()
    if (!name) break
    const model = byName.get(name)
    if (model) order.push(model)
    for (const downstream of edges.get(name) ?? []) {
      const nextDegree = (inDegree.get(downstream) ?? 0) - 1
      inDegree.set(downstream, nextDegree)
      if (nextDegree === 0) {
        queue.push(downstream)
        queue.sort()
      }
    }
  }

  // Cycles (or missing nodes) fall back to file order
  if (order.length !== models.length) {
    return [...models].sort((a, b) => a.path.localeCompare(b.path))
  }

  return order
}

function parseSchemaTests(vfs: VirtualFileSystem): TestInfo[] {
  const tests: TestInfo[] = []
  const yamlFiles = Object.entries(vfs).filter(([path]) => path.endsWith('.yml') || path.endsWith('.yaml'))

  for (const [, raw] of yamlFiles) {
    const lines = raw.split(/\r?\n/)
    let currentModel: string | null = null
    let currentColumn: string | null = null

    for (const line of lines) {
      const indent = line.match(/^\s*/)?.[0].length ?? 0

      const nameMatch = line.match(/^\s*-\s*name:\s*([\w_]+)/)
      if (nameMatch) {
        const name = nameMatch[1]
        // - name: <model> under models: list (commonly indented 2)
        if (indent <= 4) {
          currentModel = name
          currentColumn = null
          continue
        }
        // - name: <column> under columns: list (commonly indented 6+)
        if (indent >= 6 && currentModel) {
          currentColumn = name
          continue
        }
      }

      const testMatch = line.match(/^\s*-\s*(unique|not_null|relationships|accepted_values)\b/)
      if (testMatch && currentModel && currentColumn) {
        tests.push({ modelName: currentModel, columnName: currentColumn, testName: testMatch[1] })
      }
    }
  }

  return tests
}

function buildManifest(models: ModelInfo[]) {
  const nodes: Record<string, unknown> = {}

  for (const model of models) {
    const nodeId = `model.${PROJECT_NAME}.${model.name}`
    nodes[nodeId] = {
      resource_type: 'model',
      name: model.name,
      package_name: PROJECT_NAME,
      original_file_path: model.path,
      depends_on: {
        nodes: model.refs.map((ref) => `model.${PROJECT_NAME}.${ref}`),
      },
    }
  }

  return {
    metadata: {
      dbt_version: DBT_VERSION,
      generated_at: new Date().toISOString(),
      project_name: PROJECT_NAME,
    },
    nodes,
  }
}

export class DbtSimulator {
  private target: DbtTarget = {
    name: 'dev',
    schema: 'analytics',
    database: 'warehouse',
    type: 'simulator',
  }

  private fs: VirtualFileSystem

  constructor(fs: VirtualFileSystem) {
    this.fs = fs
  }

  async executeCommand(command: string, workingDirectory: string): Promise<CommandResult> {
    const trimmed = command.trim()
    if (!trimmed) return { output: '', exitCode: 0, workingDirectory }

    const [bin, ...args] = splitArgs(trimmed)

    switch (bin) {
      case 'help':
        return { output: this.helpText(), exitCode: 0, workingDirectory }
      case 'pwd':
        return { output: `${workingDirectory}\n`, exitCode: 0, workingDirectory }
      case 'ls':
        return this.handleLs(args, workingDirectory)
      case 'cd':
        return this.handleCd(args, workingDirectory)
      case 'cat':
        return this.handleCat(args, workingDirectory)
      case 'dbt':
        return this.handleDbt(args, workingDirectory)
      default:
        return { output: `Command not found: ${bin}\n`, exitCode: 127, workingDirectory }
    }
  }

  private helpText() {
    return [
      'Commands:',
      '  ls [path]                 List files',
      '  cd <path>                 Change directory',
      '  cat <file>                Print file contents',
      '  pwd                       Print working directory',
      '  dbt ls                    List models',
      '  dbt compile               Compile models (renders Jinja)',
      '  dbt run                   Simulate model build order',
      '  dbt test                  Simulate schema tests',
      '  dbt docs generate         Simulate docs generation',
      '',
    ].join('\n')
  }

  private handleLs(args: string[], workingDirectory: string): CommandResult {
    const target = args[0] ?? '.'
    const abs = target.startsWith('/')
      ? normalizePosixPath(target.startsWith(SIMULATOR_ROOT) ? target : `${SIMULATOR_ROOT}${target}`)
      : joinPaths(workingDirectory, target)
    const key = stripSimulatorRoot(abs)
    if (key === null) return { output: `ls: cannot access '${target}': No such file or directory\n`, exitCode: 2, workingDirectory }

    const entries = listDirectory(this.fs, key)
    if (entries.length === 0 && key && !findDirectoryExists(this.fs, key)) {
      return { output: `ls: cannot access '${target}': No such file or directory\n`, exitCode: 2, workingDirectory }
    }

    const output = entries.map((e) => (e.type === 'directory' ? `${e.name}/` : e.name)).join('\n')
    return { output: output ? `${output}\n` : '\n', exitCode: 0, workingDirectory }
  }

  private handleCd(args: string[], workingDirectory: string): CommandResult {
    const target = args[0] ?? SIMULATOR_ROOT
    const abs = target.startsWith('/')
      ? normalizePosixPath(target.startsWith(SIMULATOR_ROOT) ? target : `${SIMULATOR_ROOT}${target}`)
      : joinPaths(workingDirectory, target)

    if (!abs.startsWith(SIMULATOR_ROOT)) {
      return { output: `cd: ${target}: Permission denied\n`, exitCode: 1, workingDirectory }
    }

    const key = stripSimulatorRoot(abs)
    if (key === null) return { output: `cd: ${target}: No such file or directory\n`, exitCode: 1, workingDirectory }
    if (key && !findDirectoryExists(this.fs, key)) {
      return { output: `cd: ${target}: No such file or directory\n`, exitCode: 1, workingDirectory }
    }

    return { output: '', exitCode: 0, workingDirectory: abs }
  }

  private handleCat(args: string[], workingDirectory: string): CommandResult {
    const target = args[0]
    if (!target) return { output: 'cat: missing file operand\n', exitCode: 2, workingDirectory }

    const abs = target.startsWith('/')
      ? normalizePosixPath(target.startsWith(SIMULATOR_ROOT) ? target : `${SIMULATOR_ROOT}${target}`)
      : joinPaths(workingDirectory, target)

    const key = stripSimulatorRoot(abs)
    if (key === null) return { output: `cat: ${target}: No such file or directory\n`, exitCode: 1, workingDirectory }
    const contents = this.fs[key]
    if (typeof contents !== 'string') return { output: `cat: ${target}: No such file\n`, exitCode: 1, workingDirectory }

    return { output: `${contents.trimEnd()}\n`, exitCode: 0, workingDirectory }
  }

  private handleDbt(args: string[], workingDirectory: string): CommandResult {
    const sub = args[0]
    if (!sub) return { output: this.dbtHelp(), exitCode: 0, workingDirectory }

    const selectorConfig = parseDbtArgs(args.slice(1))

    switch (sub) {
      case 'ls':
        return this.dbtLs(workingDirectory, selectorConfig)
      case 'compile':
        return this.dbtCompile(workingDirectory, selectorConfig)
      case 'run':
        return this.dbtRun(workingDirectory, selectorConfig)
      case 'test':
        return this.dbtTest(workingDirectory, selectorConfig)
      case 'docs': {
        const next = args[1]
        if (next === 'generate' || !next) return this.dbtDocs(workingDirectory, selectorConfig)
        return { output: `Unknown dbt docs command: ${next}\n`, exitCode: 2, workingDirectory }
      }
      default:
        return { output: `Unknown dbt command: ${sub}\n\n${this.dbtHelp()}`, exitCode: 2, workingDirectory }
    }
  }

  private dbtHelp() {
    return [
      `dbt simulator (dbt=${DBT_VERSION})`,
      'Supported subcommands: ls, compile, run, test, docs generate',
      '',
    ].join('\n')
  }

  private getModels(): ModelInfo[] {
    return Object.entries(this.fs)
      .filter(([path]) => path.startsWith('models/') && path.endsWith('.sql'))
      .map(([path, rawSql]) => {
        const name = path.split('/').pop()?.replace(/\.sql$/, '') ?? path
        const parsed = parseSqlModel(rawSql)
        return { name, path, rawSql, refs: parsed.refs }
      })
      .sort((a, b) => a.path.localeCompare(b.path))
  }

  private renderModel(rawSql: string) {
    const macroBundle = getMacroBundle(this.fs)
    const renderer = new JinjaRenderer({
      target: this.target,
      execute: true,
      runQuery: (sql) => this.runQuery(sql),
    })

    const template = `${macroBundle}\n${rawSql}`
    const rendered = renderer.render(template, {})
    return rendered
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .join('\n')
      .trim()
  }

  private runQuery(sql: string): RunQueryResult {
    const normalized = sql.toLowerCase()

    if (normalized.includes('select') && normalized.includes('status')) {
      const values = ['completed', 'refunded', 'canceled']
      return {
        columns: [{ name: 'status', values: () => values }],
        rows: values.map((v) => [v]),
      }
    }

    return {
      columns: [{ name: 'result', values: () => [] }],
      rows: [],
    }
  }

  private dbtLs(workingDirectory: string, selectorConfig: SelectorConfig): CommandResult {
    const models = filterModels(this.getModels(), selectorConfig)
    const output = [
      `Running with dbt=${DBT_VERSION}`,
      `Found ${models.length} models`,
      '',
      ...models.map((m) => `model.${PROJECT_NAME}.${m.name}`),
      '',
    ].join('\n')
    return { output, exitCode: 0, workingDirectory }
  }

  private dbtCompile(workingDirectory: string, selectorConfig: SelectorConfig): CommandResult {
    const selected = filterModels(this.getModels(), selectorConfig)
    const models = topologicalSort(selected)
    const header = [
      `Running with dbt=${DBT_VERSION}`,
      `Found ${models.length} models`,
      '',
    ].join('\n')

    const updatedFileSystem: VirtualFileSystem = { ...this.fs }

    const compiledBlocks = models.map((model, idx) => {
      let compiled: string
      try {
        compiled = this.renderModel(model.rawSql)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        compiled = `-- Compilation error: ${message}`
      }

      const compiledPath = `target/compiled/${model.name}.sql`
      updatedFileSystem[compiledPath] = `${compiled}\n`

      return [
        `${idx + 1} of ${models.length} compiled model ${PROJECT_NAME}.${model.name}`,
        '--- RAW (TEMPLATE) ---',
        model.rawSql.trim(),
        '',
        '--- COMPILED SQL ---',
        compiled,
        '',
        `Wrote: ${compiledPath}`,
        '',
      ].join('\n')
    })

    updatedFileSystem['target/manifest.json'] = `${JSON.stringify(buildManifest(models), null, 2)}\n`

    const footer = [
      '',
      `Wrote: target/manifest.json`,
      '',
    ].join('\n')

    return {
      output: header + compiledBlocks.join('\n') + footer,
      exitCode: 0,
      workingDirectory,
      updatedFileSystem,
    }
  }

  private dbtRun(workingDirectory: string, selectorConfig: SelectorConfig): CommandResult {
    const selected = filterModels(this.getModels(), selectorConfig)
    const models = topologicalSort(selected)
    const header = [
      `Running with dbt=${DBT_VERSION}`,
      `Found ${models.length} models`,
      '',
    ].join('\n')

    const lines: string[] = []
    for (let i = 0; i < models.length; i += 1) {
      const model = models[i]
      lines.push(`${i + 1} of ${models.length} START model ${PROJECT_NAME}.${model.name}`)
      lines.push(`${i + 1} of ${models.length} OK model ${PROJECT_NAME}.${model.name}`)
      lines.push('')
    }

    lines.push(`Completed successfully in 0.00s`)
    lines.push('')

    return { output: header + lines.join('\n'), exitCode: 0, workingDirectory }
  }

  private dbtTest(workingDirectory: string, selectorConfig: SelectorConfig): CommandResult {
    const models = filterModels(this.getModels(), selectorConfig)
    const selectedModelNames = new Set(models.map((m) => m.name))
    const tests = parseSchemaTests(this.fs).filter((test) => selectedModelNames.has(test.modelName))
    const header = [
      `Running with dbt=${DBT_VERSION}`,
      `Found ${models.length} models, ${tests.length} tests`,
      '',
    ].join('\n')

    if (tests.length === 0) {
      return { output: header + 'No schema tests found.\n', exitCode: 0, workingDirectory }
    }

    const lines: string[] = []
    for (let i = 0; i < tests.length; i += 1) {
      const test = tests[i]
      const testId = `${test.testName}_${test.modelName}_${test.columnName}`
      lines.push(`${i + 1} of ${tests.length} START test ${testId}`)
      lines.push(`${i + 1} of ${tests.length} PASS test ${testId}`)
      lines.push('')
    }
    lines.push('All tests passed!')
    lines.push('')

    return { output: header + lines.join('\n'), exitCode: 0, workingDirectory }
  }

  private dbtDocs(workingDirectory: string, selectorConfig: SelectorConfig): CommandResult {
    const models = filterModels(this.getModels(), selectorConfig)
    const updatedFileSystem: VirtualFileSystem = { ...this.fs }
    updatedFileSystem['target/manifest.json'] = `${JSON.stringify(buildManifest(models), null, 2)}\n`
    updatedFileSystem['target/catalog.json'] = `${JSON.stringify(
      {
        metadata: {
          dbt_version: DBT_VERSION,
          generated_at: new Date().toISOString(),
          project_name: PROJECT_NAME,
        },
        nodes: models.map((m) => ({
          unique_id: `model.${PROJECT_NAME}.${m.name}`,
          name: m.name,
          original_file_path: m.path,
        })),
      },
      null,
      2,
    )}\n`

    const output = [
      `Running with dbt=${DBT_VERSION}`,
      `Found ${models.length} models`,
      '',
      'Catalog generated (simulated).',
      'Docs would be available at target/catalog.json and target/index.html in a real project.',
      '',
      'Wrote: target/manifest.json',
      'Wrote: target/catalog.json',
      '',
    ].join('\n')

    return { output, exitCode: 0, workingDirectory, updatedFileSystem }
  }
}
