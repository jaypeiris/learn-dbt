import './SqlEditor.css'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { EditorView } from '@codemirror/view'

type SqlEditorProps = {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  helperText?: string
}

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
          EditorView.lineWrapping
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
