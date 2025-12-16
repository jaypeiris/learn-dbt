import { useEffect, useMemo, useState } from 'react'
import type {
  LessonAnnotationItem,
  LessonAnnotations,
  LessonComparison,
  LessonDefinition,
  LessonTask,
} from '../../../types/lesson'
import type { ParsedSql } from '../../lib/sqlParser'
import { markLessonComplete } from '../../lib/progressStore'
import './LessonRenderer.css'

type LessonRendererProps = {
  lesson: LessonDefinition
  parsed: ParsedSql
  sql: string
  moduleLabel?: string
  lessonId: string
  onLessonComplete: () => void
}

export default function LessonRenderer({ lesson, parsed, sql, moduleLabel, lessonId, onLessonComplete }: LessonRendererProps) {
  const contextualModels = lesson.models.filter((model) => !model.editable)
  const taskEvaluations = useMemo(
    () => lesson.tasks.map((task) => ({ task, status: evaluateTask(task, parsed, sql) })),
    [lesson.tasks, parsed, sql],
  )
  const allTasksComplete = lesson.tasks.length === 0 || taskEvaluations.every((entry) => entry.status === 'complete')
  const [hintOpen, setHintOpen] = useState(false)
  const isCapstone = lesson.starterState ? lesson.starterState.toLowerCase().includes('capstone') : false
  const starterLabel = isCapstone ? 'Module Capstone' : lesson.starterState

  useEffect(() => {
    setHintOpen(false)
  }, [lesson.id])

  // Mark lesson complete when all tasks are done
  useEffect(() => {
    if (allTasksComplete && lesson.tasks.length > 0) {
      markLessonComplete(lessonId)
      onLessonComplete()
    }
  }, [allTasksComplete, lessonId, onLessonComplete, lesson.tasks.length])

  return (
    <section className="lesson-renderer">
      <header>
        <div className="lesson-meta-row">
          {moduleLabel && (
            <>
              <p className="lesson-meta">{moduleLabel}</p>
            </>
          )}
          {starterLabel && (
            <span
              className={isCapstone ? 'starter-state capstone' : 'starter-state'}
            >
              {starterLabel}
            </span>
          )}
        </div>
        <h1 className="lesson-title">{lesson.title}</h1>
        <p className="lesson-renderer__summary">{lesson.description}</p>
        <p className="lesson-renderer__concept">{lesson.concept}</p>
      </header>

      {lesson.annotations && <AnnotationPanel annotations={lesson.annotations} />}

      {lesson.comparisons && lesson.comparisons.length > 0 && (
        <ComparisonPanel comparisons={lesson.comparisons} />
      )}

      <div className="lesson-renderer__grid">
        <div className="lesson-objectives">
          <p className="section-label">Learning tasks</p>
          <h3>Focus for this lesson</h3>
          {lesson.tasks.length > 0 ? (
            <>
              <ul className="lesson-renderer__tasks">
                {taskEvaluations.map(({ task, status }) => (
                  <li key={task.id} className={status === 'complete' ? 'complete' : undefined}>
                    <span className="status-dot" />
                    <div>
                      <p>{task.prompt}</p>
                      {status === 'pending' && <small>{task.check.hint}</small>}
                    </div>
                  </li>
                ))}
              </ul>
              {lesson.hint && (
                <div className="lesson-hint">
                  <button type="button" onClick={() => setHintOpen((open) => !open)}>
                    {hintOpen ? 'Hide hint' : 'Need a hint?'}
                  </button>
                  {hintOpen && <p>{lesson.hint}</p>}
                </div>
              )}
              {allTasksComplete && (
                <div className="success-note">
                  {lesson.successMessage ?? 'Looks good - dbt can now reason about this change.'}
                </div>
              )}
            </>
          ) : (
            <p className="lesson-renderer__placeholder">
              This lesson focuses on concepts, so there are no interactive checks.
            </p>
          )}

          {lesson.revealSections && lesson.revealSections.length > 0 && (
            <div className="lesson-reveal">
              {allTasksComplete ? (
                lesson.revealSections.map((section) => (
                  <article key={section.title}>
                    <p className="section-label">{section.title}</p>
                    <p>{section.body}</p>
                  </article>
                ))
              ) : (
                <p className="secondary-note">Complete the task to see what dbt learns.</p>
              )}
            </div>
          )}
        </div>
        <div>
          <p className="section-label">Contextual models</p>
          <div className="contextual-models">
            {contextualModels.map((model) => (
              <details key={model.id} open>
                <summary>
                  <strong>{model.title}</strong>
                  <span>{model.description}</span>
                </summary>
                <pre>{model.sql}</pre>
              </details>
            ))}
            {!contextualModels.length && <p className="secondary-note">No additional models in this lesson.</p>}
          </div>
        </div>
      </div>

      {lesson.takeaway && (
        <div className="lesson-takeaway">
          <p className="section-label">Takeaway</p>
          <p>{lesson.takeaway}</p>
        </div>
      )}
    </section>
  )
}

type AnnotationPanelProps = {
  annotations: LessonAnnotations
}

function AnnotationPanel({ annotations }: AnnotationPanelProps) {
  const meta: Array<{ key: keyof LessonAnnotations; title: string; helper: string; badge: string }> = [
    { key: 'tests', title: 'Assumptions', helper: 'Tests make expectations visible.', badge: 'TEST' },
    { key: 'docs', title: 'Documentation', helper: 'Docs explain what the model represents.', badge: 'DOC' },
    { key: 'exposures', title: 'Exposures', helper: 'Shows who uses this model.', badge: 'USES' },
    { key: 'snapshots', title: 'Snapshots', helper: 'Records how values change over time.', badge: 'TIME' },
  ]

  const sections = meta
    .map((section) => {
      const items = annotations[section.key]
      if (!items || !items.length) return null
      return { ...section, items }
    })
    .filter((section): section is { key: keyof LessonAnnotations; title: string; helper: string; badge: string; items: LessonAnnotationItem[] } => section !== null)

  if (!sections.length) return null

  return (
    <div className="lesson-annotations">
      {sections.map((section) => (
        <div key={section.key} className="lesson-annotation-card">
          <div className="lesson-annotation-card__header">
            <span className="lesson-annotation-card__badge">{section.badge}</span>
            <div>
              <p className="annotation-title">{section.title}</p>
              <p className="annotation-helper">{section.helper}</p>
            </div>
          </div>
          <ul>
            {section.items.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

type ComparisonPanelProps = {
  comparisons: LessonComparison[]
}

function ComparisonPanel({ comparisons }: ComparisonPanelProps) {
  return (
    <div className="lesson-comparisons">
      <p className="section-label">Config comparison</p>
      <div className="lesson-comparisons__grid">
        {comparisons.map((comparison) => (
          <article key={comparison.title} className="lesson-comparison">
            <header className="lesson-comparison__header">
              <h3>{comparison.title}</h3>
              {comparison.note && <p className="lesson-comparison__note">{comparison.note}</p>}
            </header>
            <div className="lesson-comparison__columns">
              <div>
                <p className="lesson-comparison__label">{comparison.left.label}</p>
                <pre>{comparison.left.code}</pre>
              </div>
              <div>
                <p className="lesson-comparison__label alt">{comparison.right.label}</p>
                <pre>{comparison.right.code}</pre>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function evaluateTask(task: LessonTask, parsed: ParsedSql, sql: string): 'pending' | 'complete' {
  switch (task.check.type) {
    case 'includes_ref': {
      const check = task.check
      return parsed.refs.includes(check.value) ? 'complete' : 'pending'
    }
    case 'materialization': {
      const check = task.check
      return parsed.materialization === check.value ? 'complete' : 'pending'
    }
    case 'mentions_column': {
      const check = task.check
      return parsed.columns.some((column) => column.includes(check.value)) ? 'complete' : 'pending'
    }
    case 'contains_text': {
      const check = task.check
      return sql.toLowerCase().includes(check.value.toLowerCase()) ? 'complete' : 'pending'
    }
    case 'min_unique_refs': {
      const check = task.check
      const uniqueRefs = new Set(parsed.refs)
      return uniqueRefs.size >= check.value ? 'complete' : 'pending'
    }
    default:
      return 'pending'
  }
}
