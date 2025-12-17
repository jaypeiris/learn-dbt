import nunjucks from 'nunjucks'

export type DbtTarget = {
  name: string
  schema: string
  database: string
  type: string
}

export type RunQueryColumn = {
  name: string
  values: () => unknown[]
}

export type RunQueryResult = {
  columns: RunQueryColumn[]
  rows: unknown[][]
}

export type RunQueryFn = (sql: string) => RunQueryResult

export class JinjaRenderer {
  private env: nunjucks.Environment

  constructor({
    target,
    execute,
    runQuery,
  }: {
    target: DbtTarget
    execute: boolean
    runQuery: RunQueryFn
  }) {
    this.env = new nunjucks.Environment(undefined, { autoescape: false, trimBlocks: true, lstripBlocks: true })
    this.registerFilters()
    this.registerGlobals({ target, execute, runQuery })
  }

  private registerGlobals({ target, execute, runQuery }: { target: DbtTarget; execute: boolean; runQuery: RunQueryFn }) {
    this.env.addGlobal('target', target)
    this.env.addGlobal('execute', execute)

    this.env.addGlobal('ref', (model: string) => `${target.schema}.${model}`)
    this.env.addGlobal('source', (sourceName: string, tableName: string) => `${sourceName}.${tableName}`)

    this.env.addGlobal('config', () => '')
    this.env.addGlobal('var', (_name: string, defaultValue: unknown = null) => defaultValue)
    this.env.addGlobal('env_var', (_name: string, defaultValue: unknown = null) => defaultValue)

    this.env.addGlobal('run_query', (sql: string) => runQuery(sql))

    this.env.addGlobal('dbt_utils', {
      surrogate_key: (columns: unknown) => {
        const cols = Array.isArray(columns) ? columns : []
        const expressions = cols
          .map((col) => String(col))
          .filter(Boolean)
          .map((col) => `coalesce(cast(${col} as string), '')`)

        if (expressions.length === 0) {
          return "md5('')"
        }

        return `md5(${expressions.join(" || '|' || ")})`
      },
      star: (...args: unknown[]) => {
        const maybeKwargs = (args.at(-1) ?? args[0]) as unknown
        if (typeof maybeKwargs === 'object' && maybeKwargs !== null) {
          const except = (maybeKwargs as Record<string, unknown>).except ?? (maybeKwargs as Record<string, unknown>).exclude
          if (Array.isArray(except) && except.length > 0) {
            return `* /* except: ${except.map(String).join(', ')} */`
          }
        }
        return '*'
      },
      get_column_values: (...args: unknown[]) => {
        const maybeKwargs = (args.at(-1) ?? args[0]) as unknown
        if (typeof maybeKwargs !== 'object' || maybeKwargs === null) return []

        const table = String((maybeKwargs as Record<string, unknown>).table ?? '')
        const column = String((maybeKwargs as Record<string, unknown>).column ?? '')
        if (!table || !column) return []

        const result = runQuery(`select distinct ${column} as ${column} from ${table}`)
        const values = result.columns[0]?.values()
        return Array.isArray(values) ? values : []
      },
    })
  }

  private registerFilters() {
    this.env.addFilter('as_bool', (value: unknown) => Boolean(value))
    this.env.addFilter('as_number', (value: unknown) => Number(value))
  }

  render(template: string, context: Record<string, unknown> = {}) {
    return this.env.renderString(template, context)
  }
}
