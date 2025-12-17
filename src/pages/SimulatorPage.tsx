import { useMemo, useRef, useState } from 'react'
import SqlEditor from '../components/editor/SqlEditor'
import Terminal, { type TerminalCommandResult, type TerminalHandle } from '../components/terminal/Terminal'
import FileSystemTree, { type FileNode } from '../components/simulator/FileSystemTree'
import { defaultProject } from '../data/simulator/default-project'
import { DbtSimulator } from '../lib/simulatorEngine'
import './SimulatorPage.css'

function buildTree(files: Record<string, string>): FileNode {
  const root: FileNode = { name: 'dbt-project', type: 'directory', path: '/', children: [] }

  for (const [path, content] of Object.entries(files)) {
    const parts = path.split('/').filter(Boolean)
    let current = root

    for (let i = 0; i < parts.length; i += 1) {
      const isLeaf = i === parts.length - 1
      const segment = parts[i]
      const nextPath = i === 0 ? `/${segment}` : `${current.path}/${segment}`.replace(/\/+/g, '/')

      if (!current.children) current.children = []
      let existing = current.children.find((child) => child.name === segment)
      if (!existing) {
        existing = isLeaf
          ? { name: segment, type: 'file', path: path, content }
          : { name: segment, type: 'directory', path: nextPath, children: [] }
        current.children.push(existing)
      }

      if (!isLeaf && existing.type === 'directory') {
        current = existing
      }
    }
  }

  return root
}

export default function SimulatorPage() {
  const [fileSystem, setFileSystem] = useState<Record<string, string>>(defaultProject)
  const [selectedFile, setSelectedFile] = useState<string>(() => Object.keys(defaultProject).find((p) => p.endsWith('.sql')) ?? 'dbt_project.yml')
  const [workingDir, setWorkingDir] = useState<string>('/dbt-project')
  const [fileFilter, setFileFilter] = useState<string>('')
  const [projectEditable, setProjectEditable] = useState<boolean>(true)

  const simulator = useMemo(() => new DbtSimulator(fileSystem), [fileSystem])
  const tree = useMemo(() => buildTree(fileSystem), [fileSystem])
  const terminalRef = useRef<TerminalHandle | null>(null)

  const completions = useMemo(() => {
    const paths = new Set<string>()
    const addParents = (path: string) => {
      const parts = path.split('/').filter(Boolean)
      for (let i = 1; i < parts.length; i += 1) {
        paths.add(parts.slice(0, i).join('/'))
      }
    }

    for (const key of Object.keys(fileSystem)) {
      paths.add(key)
      addParents(key)
    }

    // Common convenience entries
    paths.add('.')
    paths.add('..')

    return {
      commands: ['help', 'ls', 'cd', 'cat', 'pwd', 'clear', 'dbt'],
      dbtSubcommands: ['ls', 'compile', 'run', 'test', 'docs'],
      dbtDocsSubcommands: ['generate'],
      flags: ['-s', '--select'],
      paths: Array.from(paths).sort(),
    }
  }, [fileSystem])

  const selectedContent = fileSystem[selectedFile] ?? ''
  const isGeneratedFile = selectedFile.startsWith('target/')
  const isEditable = projectEditable && !isGeneratedFile

  const handleCommand = async (cmd: string): Promise<TerminalCommandResult> => {
    const result = await simulator.executeCommand(cmd, workingDir)
    if (result.workingDirectory && result.workingDirectory !== workingDir) {
      setWorkingDir(result.workingDirectory)
    }
    if (result.updatedFileSystem) {
      setFileSystem(result.updatedFileSystem)
    }
    return { output: result.output, workingDirectory: result.workingDirectory }
  }

  const handleResetProject = () => {
    setFileSystem(defaultProject)
    setSelectedFile(Object.keys(defaultProject).find((p) => p.endsWith('.sql')) ?? 'dbt_project.yml')
    setWorkingDir('/dbt-project')
    terminalRef.current?.clear()
  }

  return (
    <div className="simulator-page">
      <header className="simulator-header">
        <div className="simulator-header__row">
          <div>
            <h1>dbt Core Simulator</h1>
            <p className="simulator-subtitle">
              Explore a sample dbt project, edit files, and run simulated dbt commands (no warehouse required).
            </p>
          </div>
          <div className="simulator-header__actions">
            <button type="button" className="ghost-button" onClick={handleResetProject}>
              Reset project
            </button>
          </div>
        </div>
        <p className="simulator-subtitle">
          Tip: run `dbt compile` then open `target/manifest.json` or `target/compiled/*.sql` in the file tree.
        </p>
      </header>

      <div className="simulator-grid">
        <aside className="simulator-sidebar">
          <div className="simulator-panel">
            <p className="section-label">Project files</p>
            <div className="simulator-file-filter">
              <input
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
                placeholder="Filter files…"
                aria-label="Filter files"
              />
            </div>
            <FileSystemTree files={tree} selectedPath={selectedFile} onFileSelect={setSelectedFile} />
          </div>
        </aside>

        <section className="simulator-editor">
          <div className="simulator-panel">
            <div className="simulator-editor__header">
              <p className="section-label">File {isEditable ? 'editor' : 'viewer'}</p>
              <label className="simulator-toggle">
                <input
                  type="checkbox"
                  checked={projectEditable}
                  onChange={(e) => setProjectEditable(e.target.checked)}
                />
                Editable project
              </label>
            </div>
            <SqlEditor
              label={selectedFile}
              value={selectedContent}
              readOnly={!isEditable}
              onChange={
                isEditable
                  ? (next) => {
                      setFileSystem((prev) => ({ ...prev, [selectedFile]: next }))
                    }
                  : undefined
              }
              helperText={
                isGeneratedFile
                  ? 'Generated artifacts (target/) are read-only.'
                  : isEditable
                    ? 'Edits are in-memory only (session resets on refresh).'
                    : 'Toggle “Editable project” to modify files.'
              }
            />
          </div>
        </section>

        <section className="simulator-terminal">
          <div className="simulator-panel simulator-panel--terminal">
            <div className="simulator-terminal__header">
              <p className="section-label">Terminal</p>
              <div className="simulator-terminal__buttons">
                <button type="button" className="chip-button" onClick={() => terminalRef.current?.runCommand('dbt ls')}>
                  dbt ls
                </button>
                <button type="button" className="chip-button" onClick={() => terminalRef.current?.runCommand('dbt compile')}>
                  dbt compile
                </button>
                <button type="button" className="chip-button" onClick={() => terminalRef.current?.runCommand('dbt run')}>
                  dbt run
                </button>
                <button type="button" className="chip-button" onClick={() => terminalRef.current?.runCommand('dbt test')}>
                  dbt test
                </button>
                <button type="button" className="chip-button" onClick={() => terminalRef.current?.runCommand('dbt docs generate')}>
                  docs
                </button>
                <button type="button" className="chip-button chip-button--secondary" onClick={() => terminalRef.current?.runCommand('clear')}>
                  clear
                </button>
              </div>
            </div>
            <div className="simulator-terminal__shell">
              <Terminal ref={terminalRef} onCommand={handleCommand} workingDirectory={workingDir} completions={completions} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
