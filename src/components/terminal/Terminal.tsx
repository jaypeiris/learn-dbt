import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import './Terminal.css'

export type TerminalCommandResult = {
  output: string
  workingDirectory?: string
}

export type TerminalHandle = {
  runCommand: (cmd: string) => void
  clear: () => void
}

export type TerminalCompletions = {
  commands: string[]
  dbtSubcommands: string[]
  dbtDocsSubcommands: string[]
  flags: string[]
  paths: string[]
}

type TerminalProps = {
  onCommand: (cmd: string) => Promise<TerminalCommandResult>
  workingDirectory: string
  completions?: TerminalCompletions
}

function normalizeOutput(output: string) {
  if (!output) return ''
  const normalized = output.replace(/\r?\n/g, '\r\n')
  return normalized.endsWith('\r\n') ? normalized : `${normalized}\r\n`
}

const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function tokenize(input: string) {
  const tokens: string[] = []
  let current = ''
  let inQuote: '"' | "'" | null = null

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]
    if ((ch === '"' || ch === "'") && (inQuote === null || inQuote === ch)) {
      inQuote = inQuote === null ? (ch as '"' | "'") : null
      current += ch
      continue
    }
    if (ch === ' ' && inQuote === null) {
      if (current) tokens.push(current)
      current = ''
      continue
    }
    current += ch
  }

  if (current) tokens.push(current)
  return tokens
}

function highlightInput(input: string) {
  const tokens = tokenize(input)
  if (tokens.length === 0) return ''

  const cmd = tokens[0] ?? ''
  const rest = tokens.slice(1)

  const highlightToken = (token: string) => {
    if (token.startsWith('--') || token.startsWith('-')) return `${ANSI.dim}${token}${ANSI.reset}`
    if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
      return `${ANSI.yellow}${token}${ANSI.reset}`
    }
    if (token.includes('/') || token.includes('.') || token.startsWith('path:')) return `${ANSI.cyan}${token}${ANSI.reset}`
    return token
  }

  if (cmd === 'dbt') {
    const sub = rest[0]
    const remaining = rest.slice(1)
    const subStyled = sub ? `${ANSI.green}${sub}${ANSI.reset}` : ''
    const tail = remaining.map(highlightToken).join(' ')
    return [ `${ANSI.blue}${cmd}${ANSI.reset}`, subStyled, tail ].filter(Boolean).join(' ')
  }

  return [`${ANSI.magenta}${cmd}${ANSI.reset}`, ...rest.map(highlightToken)].join(' ')
}

function getLastTokenInfo(input: string) {
  const endsWithSpace = input.endsWith(' ')
  const tokens = tokenize(input)
  if (tokens.length === 0) {
    return { tokens: [], last: '', endsWithSpace }
  }
  const last = endsWithSpace ? '' : tokens[tokens.length - 1] ?? ''
  return { tokens, last, endsWithSpace }
}

const Terminal = forwardRef<TerminalHandle, TerminalProps>(function Terminal(
  { onCommand, workingDirectory, completions }: TerminalProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const xtermRef = useRef<XTerm | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  const onCommandRef = useRef(onCommand)
  onCommandRef.current = onCommand
  const completionsRef = useRef<TerminalCompletions | undefined>(completions)
  completionsRef.current = completions

  const workingDirectoryRef = useRef(workingDirectory)
  workingDirectoryRef.current = workingDirectory

  const inputRef = useRef('')
  const cursorRef = useRef(0)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef<number | null>(null)
  const busyRef = useRef(false)
  const runCommandRef = useRef<(cmd: string) => void>(() => {})

  useEffect(() => {
    if (!containerRef.current) return
    if (xtermRef.current) return

    const fitAddon = new FitAddon()
    const terminal = new XTerm({
      cursorBlink: true,
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      theme: {
        background: '#0b1b2e',
        foreground: '#e9eff7',
        cursor: '#d6b26e',
        selectionBackground: 'rgba(214, 178, 110, 0.28)',
      },
      scrollback: 2000,
    })

    terminal.loadAddon(fitAddon)
    terminal.open(containerRef.current)
    fitAddon.fit()

    xtermRef.current = terminal
    fitAddonRef.current = fitAddon

    const promptText = () => {
      const dir = workingDirectoryRef.current || '/dbt-project'
      return `${ANSI.dim}${dir}${ANSI.reset} ${ANSI.yellow}$${ANSI.reset} `
    }

    const writePrompt = () => {
      terminal.write(promptText())
    }

    terminal.writeln('dbt Core Simulator')
    terminal.writeln('Try: ls, cat dbt_project.yml, dbt ls, dbt compile, dbt test, dbt docs generate')
    terminal.write('\r\n')
    writePrompt()

    const redrawInputLine = () => {
      terminal.write('\r\x1b[2K')
      terminal.write(`${promptText()}${highlightInput(inputRef.current)}`)
      // We only support cursor-at-end editing (no left/right). Keep index in sync.
      cursorRef.current = inputRef.current.length
    }

    const setHistory = (direction: 'up' | 'down') => {
      const history = historyRef.current
      if (history.length === 0) return

      const currentIndex = historyIndexRef.current
      let nextIndex: number | null = currentIndex

      if (direction === 'up') {
        if (currentIndex === null) nextIndex = history.length - 1
        else nextIndex = Math.max(0, currentIndex - 1)
      } else {
        if (currentIndex === null) return
        const candidate = currentIndex + 1
        nextIndex = candidate >= history.length ? null : candidate
      }

      historyIndexRef.current = nextIndex
      inputRef.current = nextIndex === null ? '' : history[nextIndex] ?? ''
      cursorRef.current = inputRef.current.length
      redrawInputLine()
    }

    const runCommandInternal = async (cmd: string) => {
      const trimmed = cmd.trim()
      if (!trimmed) {
        writePrompt()
        return
      }

      if (trimmed === 'clear') {
        terminal.clear()
        writePrompt()
        return
      }

      busyRef.current = true
      historyIndexRef.current = null
      historyRef.current = [...historyRef.current.filter((h) => h !== trimmed), trimmed].slice(-100)

      try {
        const result = await onCommandRef.current(trimmed)
        if (result.workingDirectory) {
          workingDirectoryRef.current = result.workingDirectory
        }
        terminal.write(normalizeOutput(result.output))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        terminal.write(normalizeOutput(`Error: ${message}`))
      } finally {
        busyRef.current = false
        writePrompt()
      }
    }

    runCommandRef.current = (cmd: string) => {
      if (busyRef.current) return
      // Replace any current input, echo command, then execute.
      inputRef.current = ''
      cursorRef.current = 0
      historyIndexRef.current = null
      terminal.write('\r\x1b[2K')
      terminal.write(`${promptText()}${highlightInput(cmd)}\r\n`)
      void runCommandInternal(cmd)
    }

    const disposable = terminal.onData(async (data) => {
      if (busyRef.current) return

      // Arrow Up / Down
      if (data === '\u001b[A') {
        setHistory('up')
        return
      }
      if (data === '\u001b[B') {
        setHistory('down')
        return
      }

      // Enter
      if (data === '\r') {
        const cmd = inputRef.current
        inputRef.current = ''
        cursorRef.current = 0
        terminal.write('\r\n')
        await runCommandInternal(cmd)
        return
      }

      // Tab (basic completion)
      if (data === '\t') {
        const completionConfig = completionsRef.current
        if (!completionConfig) return

        const info = getLastTokenInfo(inputRef.current)
        const { tokens, last, endsWithSpace } = info
        const baseTokens = endsWithSpace ? tokens : tokens.slice(0, -1)
        const cmd = tokens[0] ?? ''
        const sub = tokens[1] ?? ''

        let candidates: string[] = []
        if (tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)) {
          candidates = completionConfig.commands
        } else if (cmd === 'dbt' && (tokens.length === 1 || (tokens.length === 2 && !endsWithSpace))) {
          candidates = completionConfig.dbtSubcommands
        } else if (cmd === 'dbt' && sub === 'docs' && (tokens.length <= 2 || (tokens.length === 3 && !endsWithSpace))) {
          candidates = completionConfig.dbtDocsSubcommands
        } else if (cmd === 'cat' || cmd === 'ls' || cmd === 'cd') {
          candidates = completionConfig.paths
        } else {
          candidates = [...completionConfig.flags, ...completionConfig.paths]
        }

        const prefix = last
        const matches = candidates.filter((c) => c.toLowerCase().startsWith(prefix.toLowerCase()))
        const unique = Array.from(new Set(matches)).sort()
        if (unique.length === 0) return

        if (unique.length === 1) {
          const completed = unique[0]
          inputRef.current = [...baseTokens, completed].join(' ') + ' '
          redrawInputLine()
          return
        }

        terminal.write('\r\n')
        terminal.write(normalizeOutput(unique.join('  ')))
        redrawInputLine()
        return
      }

      // Backspace (DEL)
      if (data === '\u007F') {
        if (inputRef.current.length === 0) return
        inputRef.current = inputRef.current.slice(0, -1)
        cursorRef.current = inputRef.current.length
        redrawInputLine()
        return
      }

      // Ctrl+C
      if (data === '\u0003') {
        inputRef.current = ''
        cursorRef.current = 0
        historyIndexRef.current = null
        terminal.write('^C')
        terminal.write('\r\n')
        writePrompt()
        return
      }

      // Ctrl+L (clear)
      if (data === '\u000c') {
        terminal.clear()
        writePrompt()
        return
      }

      // Printable characters only
      if (data >= ' ') {
        inputRef.current += data
        cursorRef.current = inputRef.current.length
        redrawInputLine()
      }
    })

    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      disposable.dispose()
      terminal.dispose()
      xtermRef.current = null
      fitAddonRef.current = null
      runCommandRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    fitAddonRef.current?.fit()
  }, [workingDirectory])

  useImperativeHandle(
    ref,
    () => ({
      runCommand: (cmd: string) => {
        runCommandRef.current(cmd)
      },
      clear: () => {
        xtermRef.current?.clear()
      },
    }),
    [],
  )

  return <div className="terminal-container" ref={containerRef} />
})

export default Terminal
