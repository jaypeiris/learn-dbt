import { useMemo, useState } from 'react'
import SqlEditor from '../components/editor/SqlEditor'
import { parseSqlModel } from '../lib/sqlParser'
import { getChallengeCategories } from '../lib/practiceEngine'
import type { Challenge, ChallengeCheck } from '../../types/practice'
import './PracticePage.css'

export default function PracticePage() {
  const categories = getChallengeCategories()
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    categories[0]?.challenges[0] || null
  )
  const [sql, setSql] = useState(selectedChallenge?.starterSql || '')
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const parsed = useMemo(() => parseSqlModel(sql), [sql])

  const checkResults = useMemo(() => {
    if (!selectedChallenge) return []
    return selectedChallenge.checks.map((check) => ({
      check,
      passed: evaluateCheck(check, parsed, sql),
    }))
  }, [selectedChallenge, parsed, sql])

  const allPassed = checkResults.every((result) => result.passed)

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setSql(challenge.starterSql)
    setShowHint(false)
    setShowExplanation(false)
  }

  const handleReset = () => {
    if (selectedChallenge) {
      setSql(selectedChallenge.starterSql)
      setShowHint(false)
      setShowExplanation(false)
    }
  }

  if (!selectedChallenge) {
    return (
      <div className="practice-page">
        <div className="empty-state">
          <p>No challenges available yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="practice-page">
      <aside className="practice-sidebar">
        <div className="practice-sidebar__header">
          <h2>Practice Challenges</h2>
          <p className="practice-sidebar__subtitle">
            Short, focused exercises to reinforce dbt concepts
          </p>
        </div>

        <div className="practice-categories">
          {categories.map((category) => (
            <div key={category.id} className="practice-category">
              <h3 className="practice-category__title">{category.title}</h3>
              <p className="practice-category__description">{category.description}</p>
              <ul className="practice-challenge-list">
                {category.challenges.map((challenge) => (
                  <li key={challenge.id}>
                    <button
                      type="button"
                      className={`practice-challenge-button ${selectedChallenge.id === challenge.id ? 'active' : ''}`}
                      onClick={() => handleSelectChallenge(challenge)}
                    >
                      <div className="practice-challenge-button__header">
                        <span className="practice-challenge-button__title">{challenge.title}</span>
                        <span className={`practice-difficulty practice-difficulty--${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <span className="practice-challenge-button__time">{challenge.timeEstimate}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <main className="practice-main">
        <header className="practice-header">
          <div className="practice-header__tags">
            <span className={`practice-difficulty practice-difficulty--${selectedChallenge.difficulty}`}>
              {selectedChallenge.difficulty}
            </span>
            <span className="practice-time">{selectedChallenge.timeEstimate}</span>
            {selectedChallenge.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="practice-tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="practice-title">{selectedChallenge.title}</h1>
          <p className="practice-description">{selectedChallenge.description}</p>
          <div className="practice-scenario">
            <p className="section-label">Scenario</p>
            <p>{selectedChallenge.scenario}</p>
          </div>
        </header>

        <div className="practice-content">
          <div className="practice-checks">
            <p className="section-label">Requirements</p>
            <ul className="practice-checks-list">
              {checkResults.map((result, index) => (
                <li key={index} className={`practice-check ${result.passed ? 'passed' : 'pending'}`}>
                  <span className="practice-check__status">{result.passed ? '✓' : '○'}</span>
                  <span className="practice-check__hint">{result.check.hint}</span>
                </li>
              ))}
            </ul>

            {allPassed ? (
              <div className="practice-success">
                <p className="practice-success__message">Challenge complete!</p>
                <button
                  type="button"
                  className="practice-button practice-button--secondary"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? 'Hide explanation' : 'Show explanation'}
                </button>
                {showExplanation && (
                  <div className="practice-explanation">
                    <p className="section-label">Why this works</p>
                    <p>{selectedChallenge.explanation}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="practice-actions">
                {selectedChallenge.hint && (
                  <button
                    type="button"
                    className="practice-button practice-button--secondary"
                    onClick={() => setShowHint(!showHint)}
                  >
                    {showHint ? 'Hide hint' : 'Need a hint?'}
                  </button>
                )}
                <button
                  type="button"
                  className="practice-button practice-button--secondary"
                  onClick={handleReset}
                >
                  Reset code
                </button>
              </div>
            )}

            {showHint && selectedChallenge.hint && (
              <div className="practice-hint">
                <p className="section-label">Hint</p>
                <p>{selectedChallenge.hint}</p>
              </div>
            )}
          </div>

          <div className="practice-editor">
            <SqlEditor
              label="Your solution"
              value={sql}
              onChange={setSql}
              helperText="Modify the SQL to meet the requirements. No execution—just string validation."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * Evaluate a single check against the parsed SQL
 */
function evaluateCheck(check: ChallengeCheck, parsed: ReturnType<typeof parseSqlModel>, sql: string): boolean {
  const value = check.value

  switch (check.type) {
    case 'includes_ref':
      if (typeof value !== 'string') return false
      return parsed.refs.includes(value)
    case 'materialization':
      if (typeof value !== 'string') return false
      return parsed.materialization === value
    case 'mentions_column':
      if (typeof value !== 'string') return false
      return parsed.columns.some((col) => col.includes(value))
    case 'contains_text':
      if (typeof value !== 'string') return false
      return sql.toLowerCase().includes(value.toLowerCase())
    default:
      return false
  }
}
