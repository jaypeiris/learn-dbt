import './SqlEditor.css'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { EditorView, Decoration, ViewPlugin, type ViewUpdate } from '@codemirror/view'
import { RangeSetBuilder } from '@codemirror/state'

type SqlEditorProps = {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  helperText?: string
}

function buildJinjaDecorations(view: EditorView) {
  const builder = new RangeSetBuilder<Decoration>()

  for (const { from, to } of view.visibleRanges) {
    const text = view.state.doc.sliceString(from, to)
    const regex = /\{\{[\s\S]*?\}\}|\{%\s*[\s\S]*?\s*%\}|\{#[\s\S]*?#\}/g
    for (const match of text.matchAll(regex)) {
      if (typeof match.index !== 'number') continue
      const start = from + match.index
      const end = start + match[0].length
      builder.add(start, end, Decoration.mark({ class: 'cm-jinja' }))
    }
  }

  return builder.finish()
}

const jinjaHighlight = ViewPlugin.fromClass(
  class {
    decorations = Decoration.none

    constructor(view: EditorView) {
      this.decorations = buildJinjaDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildJinjaDecorations(update.view)
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  },
)

export default function SqlEditor({ label, value, onChange, readOnly = false, helperText }: SqlEditorProps) {
  return (
    <div className="sql-editor">
      <div className="sql-editor__label">
        <span>{label}</span>
        {readOnly && <span className="sql-editor__tag">Read only</span>}
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={[
          sql(),
          EditorView.lineWrapping,
          jinjaHighlight,
        ]}
        editable={!readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          highlightSelectionMatches: true,
          searchKeymap: true,
          tabSize: 2
        }}
        className="sql-editor__codemirror"
        aria-label={label}
      />
      {helperText && <p className="sql-editor__hint">{helperText}</p>}
    </div>
  )
}
