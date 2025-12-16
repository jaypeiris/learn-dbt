import { useState } from 'react'
import { getMistakeCollections } from '../lib/mistakeEngine'
import type { Mistake } from '../../types/mistake'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import './MistakeMuseumPage.css'

export default function MistakeMuseumPage() {
  const collections = getMistakeCollections()
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(
    collections[0]?.mistakes[0] || null
  )
  const [showFix, setShowFix] = useState(false)

  if (!selectedMistake) {
    return (
      <div className="mistake-museum">
        <div className="empty-state">
          <p>No mistakes available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mistake-museum">
      <aside className="mistake-sidebar">
        <div className="mistake-sidebar__header">
          <h2>Mistake Museum</h2>
          <p className="mistake-sidebar__subtitle">
            Learn from common dbt failures. Each mistake is from real projects.
          </p>
        </div>

        <div className="mistake-collections">
          {collections.map((collection) => (
            <div key={collection.id} className="mistake-collection">
              <h3 className="mistake-collection__title">{collection.title}</h3>
              <p className="mistake-collection__description">{collection.description}</p>
              <ul className="mistake-list">
                {collection.mistakes.map((mistake) => (
                  <li key={mistake.id}>
                    <button
                      type="button"
                      className={`mistake-button ${selectedMistake.id === mistake.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedMistake(mistake)
                        setShowFix(false)
                      }}
                    >
                      <div className="mistake-button__header">
                        <span className="mistake-button__title">{mistake.title}</span>
                        <span className={`mistake-severity mistake-severity--${mistake.severity}`}>
                          {mistake.severity}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <main className="mistake-main">
        <header className="mistake-header">
          <div className="mistake-header__tags">
            <span className={`mistake-severity mistake-severity--${selectedMistake.severity}`}>
              {selectedMistake.severity}
            </span>
            <span className={`mistake-category mistake-category--${selectedMistake.category}`}>
              {selectedMistake.category}
            </span>
            {selectedMistake.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="mistake-tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mistake-title">{selectedMistake.title}</h1>
          <p className="mistake-description">{selectedMistake.description}</p>
        </header>

        <div className="mistake-content">
          <section className="mistake-section">
            <h2 className="section-title">Symptoms</h2>
            <p className="section-subtitle">How you know this is happening in your project:</p>
            <ul className="mistake-symptoms">
              {selectedMistake.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </section>

          <section className="mistake-section">
            <h2 className="section-title">The Broken Code</h2>
            <div className="mistake-code-block">
              <CodeMirror
                value={selectedMistake.brokenCode}
                extensions={[sql()]}
                editable={false}
                basicSetup={{
                  lineNumbers: true,
                  foldGutter: false,
                  highlightActiveLineGutter: false,
                  highlightActiveLine: false,
                }}
                className="mistake-codemirror mistake-codemirror--broken"
              />
            </div>
          </section>

          <section className="mistake-section">
            <h2 className="section-title">Why This Is Bad</h2>
            <p className="mistake-explanation">{selectedMistake.whyBad}</p>
          </section>

          <section className="mistake-section">
            <div className="mistake-reveal-controls">
              <h2 className="section-title">The Fix</h2>
              <button
                type="button"
                className="mistake-reveal-button"
                onClick={() => setShowFix(!showFix)}
              >
                {showFix ? 'Hide the fix' : 'Show me the fix'}
              </button>
            </div>

            {showFix && (
              <div className="mistake-fix-content">
                <div className="mistake-code-block">
                  <CodeMirror
                    value={selectedMistake.fixedCode}
                    extensions={[sql()]}
                    editable={false}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: false,
                      highlightActiveLineGutter: false,
                      highlightActiveLine: false,
                    }}
                    className="mistake-codemirror mistake-codemirror--fixed"
                  />
                </div>

                <div className="mistake-explanation-box">
                  <h3>Why this works</h3>
                  <p>{selectedMistake.explanation}</p>
                </div>

                <div className="mistake-prevention-box">
                  <h3>How to prevent this</h3>
                  <p>{selectedMistake.prevention}</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
