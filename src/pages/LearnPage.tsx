import { useEffect, useMemo, useState } from 'react'
import SqlEditor from '../components/editor/SqlEditor'
import LessonRenderer from '../components/lesson/LessonRenderer'
import LessonNavTop from '../components/lesson/LessonNavTop'
import LineageGraph from '../components/lineage/LineageGraph'
import ManifestExplorer from '../components/manifest/ManifestExplorer'
import { parseSqlModel } from '../lib/sqlParser'
import { buildLineageGraph } from '../lib/lineageBuilder'
import { getDefaultLessonId, getLessonById, getLessonIndex } from '../lib/lessonEngine'
import { getCurrentLesson, getSqlEdit, saveCurrentLesson, saveSqlEdit, getCompletedLessons, markLessonComplete } from '../lib/progressStore'
import type { LessonDefinition } from '../../types/lesson'
import './LearnPage.css'

const lessonIndex = getLessonIndex()
const moduleOrder = Array.from(
  new Map(
    lessonIndex
      .map((lesson) => extractModuleCode(lesson.id))
      .filter((code): code is string => Boolean(code))
      .map((code) => [code, true]),
  ).keys(),
)

function selectActiveModel(lesson: LessonDefinition | undefined) {
  if (!lesson) return undefined
  return lesson.models.find((model) => model.editable) ?? lesson.models[0]
}

export default function LearnPage() {
  // Load saved progress or default lesson
  const savedLessonId = getCurrentLesson()
  const [selectedLessonId, setSelectedLessonId] = useState(savedLessonId || getDefaultLessonId())
  const [lesson, setLesson] = useState<LessonDefinition | undefined>(() => getLessonById(selectedLessonId))
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(getCompletedLessons())

  const totalLessons = lessonIndex.length
  const currentLessonIndex = lessonIndex.findIndex((entry) => entry.id === selectedLessonId)
  const currentLessonNumber = currentLessonIndex >= 0 ? currentLessonIndex + 1 : 1
  const nextLessonId =
    currentLessonIndex >= 0 && currentLessonIndex < lessonIndex.length - 1 ? lessonIndex[currentLessonIndex + 1].id : null
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0
  const isCurrentLessonComplete = completedLessons.has(selectedLessonId)

  const initialModel = selectActiveModel(lesson)
  // Try to load saved SQL edit, fallback to default
  const savedSql = getSqlEdit(selectedLessonId)
  const [sql, setSql] = useState(savedSql ?? initialModel?.sql ?? '')
  const [modelName, setModelName] = useState(initialModel?.title ?? 'model')
  const [isEditable, setIsEditable] = useState(initialModel?.editable ?? false)
  const [modelVariant, setModelVariant] = useState<'model' | 'snapshot'>(initialModel?.variant ?? 'model')

  useEffect(() => {
    const nextLesson = getLessonById(selectedLessonId)
    setLesson(nextLesson)
    const nextModel = selectActiveModel(nextLesson)

    // Save current lesson to localStorage
    saveCurrentLesson(selectedLessonId)

    if (nextModel) {
      // Try to load saved SQL, fallback to default
      const savedSql = getSqlEdit(selectedLessonId)
      setSql(savedSql ?? nextModel.sql)
      setModelName(nextModel.title)
      setIsEditable(nextModel.editable)
      setModelVariant(nextModel.variant ?? 'model')
    } else {
      setSql('')
      setModelName(nextLesson?.title ?? 'lesson')
      setIsEditable(false)
      setModelVariant('model')
    }
  }, [selectedLessonId])

  // Auto-save SQL edits as user types (with debounce in real impl, but simple for now)
  useEffect(() => {
    if (isEditable && sql) {
      saveSqlEdit(selectedLessonId, sql)
    }
  }, [sql, selectedLessonId, isEditable])

  // Callback to mark lesson complete
  const handleLessonComplete = () => {
    setCompletedLessons(getCompletedLessons())
  }

  const handleMarkComplete = () => {
    if (!isCurrentLessonComplete) {
      markLessonComplete(selectedLessonId)
      setCompletedLessons(getCompletedLessons())
    }
  }

  const handleNextLesson = () => {
    if (!isCurrentLessonComplete) {
      handleMarkComplete()
    }
    if (nextLessonId) {
      setSelectedLessonId(nextLessonId)
    }
  }

  const parsed = useMemo(() => parseSqlModel(sql), [sql])
  const graph = useMemo(
    () =>
      buildLineageGraph(modelName, parsed.refs, {
        currentMaterialization: parsed.materialization,
        currentVariant: modelVariant,
      }),
    [modelName, parsed.refs, parsed.materialization, modelVariant],
  )

  const hideLineageUntilRef =
    selectedLessonId === 'module-01-capstone-make-dbt-see-model' && parsed.refs.length === 0

  if (!lesson) {
    return (
      <div className="fallback-card">
        <p>No lesson data found. Check the JSON files under src/data/lessons.</p>
      </div>
    )
  }

  return (
    <div className="learn-layout">
      <aside className="learn-sidebar">
        <LessonNavTop
          lessons={lessonIndex}
          currentLessonId={selectedLessonId}
          completedLessons={completedLessons}
          onSelect={setSelectedLessonId}
        />
      </aside>
      <section className="learn-main">
        <div className="lesson-primary">
          <div className="lesson-progress-banner">
            <div className="lesson-progress-banner__meta">
              <p className="section-label">Progress</p>
              <div className="lesson-progress-banner__headline">
                <strong>
                  {completedLessons.size} of {totalLessons} lessons
                </strong>
                <span>Currently on lesson {currentLessonNumber} of {totalLessons}</span>
              </div>
              <div
                className="lesson-progress-banner__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div className="lesson-progress-banner__actions">
              {!isCurrentLessonComplete && (
                <button type="button" className="ghost-button" onClick={handleMarkComplete}>
                  Mark complete
                </button>
              )}
              <button type="button" className="primary-button" onClick={handleNextLesson} disabled={!nextLessonId}>
                {nextLessonId ? 'Next lesson' : 'All lessons done'}
              </button>
            </div>
          </div>
          <LessonRenderer
            lesson={lesson}
            parsed={parsed}
            sql={sql}
            moduleLabel={getModuleLabel(selectedLessonId)}
            onLessonComplete={handleLessonComplete}
            lessonId={selectedLessonId}
          />
          <div className="lesson-lineage">
            <p className="lineage-label">Lineage reference</p>
            {hideLineageUntilRef ? (
              <div className="placeholder-card">
                Add <code>{'{{ ref(...) }}'}</code> calls to reveal lineage. Until dbt can see dependencies, the graph stays empty.
              </div>
            ) : (
              <LineageGraph graph={graph} />
            )}
          </div>
          <div className="lesson-editor">
            {lesson.models.length > 0 ? (
              <SqlEditor
                label={`Model: ${modelName}`}
                value={sql}
                onChange={isEditable ? setSql : undefined}
                readOnly={!isEditable}
                helperText={
                  isEditable
                    ? 'String checks only. This never runs dbt or queries a warehouse.'
                    : 'Read-only example SQL for this lesson.'
                }
              />
            ) : (
              <div className="placeholder-card">
                This lesson focuses on conceptual glue, so no editable SQL is shown yet.
              </div>
            )}
          </div>
        </div>
        <aside className="lesson-secondary">
          {lesson.features?.showManifestExplorer && <ManifestExplorer />}
        </aside>
      </section>
    </div>
  )
}

function extractModuleCode(lessonId: string): string | null {
  const match = lessonId.match(/^(module-\d{2})/)
  return match ? match[1] : null
}

function getModuleLabel(lessonId: string): string | undefined {
  const moduleCode = extractModuleCode(lessonId)
  if (!moduleCode) {
    return undefined
  }
  const moduleIndex = moduleOrder.indexOf(moduleCode)
  if (moduleIndex === -1) {
    return undefined
  }
  return `Module ${moduleIndex + 1} of ${moduleOrder.length}`
}
