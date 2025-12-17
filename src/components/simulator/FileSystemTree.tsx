import { useEffect, useMemo, useState } from 'react'
import './FileSystemTree.css'

export type FileNode = {
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  children?: FileNode[]
}

type FileSystemTreeProps = {
  files: FileNode
  onFileSelect: (path: string) => void
  selectedPath?: string
  filter?: string
}

function sortChildren(children: FileNode[]) {
  return [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export default function FileSystemTree({ files, onFileSelect, selectedPath, filter }: FileSystemTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([files.path, '/models', '/models/staging', '/models/marts', '/macros', '/target']),
  )

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const isExpanded = (path: string) => expanded.has(path)

  const root = useMemo(() => ({ ...files, children: sortChildren(files.children ?? []) }), [files])

  const filterText = filter?.trim().toLowerCase() ?? ''

  const filteredRoot = useMemo(() => {
    if (!filterText) return root

    const prune = (node: FileNode): FileNode | null => {
      const nameMatches = node.name.toLowerCase().includes(filterText)
      if (node.type === 'file') {
        return nameMatches ? node : null
      }

      const children = node.children ?? []
      const prunedChildren = nameMatches ? children : children.map(prune).filter((c): c is FileNode => c !== null)
      if (nameMatches || prunedChildren.length > 0) {
        return { ...node, children: prunedChildren }
      }
      return null
    }

    return prune(root) ?? { ...root, children: [] }
  }, [filterText, root])

  useEffect(() => {
    if (!filterText) {
      setExpanded(new Set([files.path, '/models', '/models/staging', '/models/marts', '/macros', '/target']))
      return
    }
    const paths = new Set<string>()
    const walk = (node: FileNode) => {
      if (node.type === 'directory') {
        paths.add(node.path)
        for (const child of node.children ?? []) walk(child)
      }
    }
    walk(filteredRoot)
    setExpanded(paths)
  }, [filterText, filteredRoot, files.path])

  const renderNode = (node: FileNode, depth: number) => {
    const paddingLeft = 10 + depth * 14

    if (node.type === 'directory') {
      const open = isExpanded(node.path)
      const children = sortChildren(node.children ?? [])

      return (
        <div key={node.path}>
          <button
            type="button"
            className="fs-node fs-node--dir"
            style={{ paddingLeft }}
            onClick={() => toggle(node.path)}
            aria-expanded={open}
          >
            <span className={open ? 'fs-caret open' : 'fs-caret'} aria-hidden>
              ▸
            </span>
            <span className="fs-name">{node.name}</span>
          </button>
          {open && (
            <div>
              {children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    const active = selectedPath === node.path
    const extension = node.name.includes('.') ? node.name.split('.').pop()?.toLowerCase() : undefined
    const icon =
      extension === 'sql' ? 'SQL' : extension === 'yml' || extension === 'yaml' ? 'YML' : extension === 'json' ? 'JSON' : 'TXT'
    return (
      <button
        key={node.path}
        type="button"
        className={active ? 'fs-node fs-node--file active' : 'fs-node fs-node--file'}
        style={{ paddingLeft }}
        onClick={() => onFileSelect(node.path)}
      >
        <span className="fs-caret placeholder" aria-hidden>
          ▸
        </span>
        <span className={`fs-filetype fs-filetype--${extension ?? 'txt'}`} aria-hidden>
          {icon}
        </span>
        <span className="fs-name">{node.name}</span>
      </button>
    )
  }

  return <div className="fs-tree">{renderNode(filteredRoot, 0)}</div>
}
