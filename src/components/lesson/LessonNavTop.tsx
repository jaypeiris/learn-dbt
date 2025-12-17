import { useEffect, useMemo, useState } from 'react'
import type { LessonIndexEntry } from '../../../types/lesson'
import './LessonNavTop.css'

type LessonNavTopProps = {
  lessons: LessonIndexEntry[]
  currentLessonId: string
  completedLessons: Set<string>
  onSelect: (id: string) => void
}

type LessonModule = {
  id: string
  title: string
  lessons: LessonIndexEntry[]
}

export default function LessonNavTop({ lessons, currentLessonId, completedLessons, onSelect }: LessonNavTopProps) {
  const modules = useMemo(() => buildModules(lessons), [lessons])
  const [openModules, setOpenModules] = useState<Set<string>>(new Set())

  // Find which module contains the current lesson
  const currentModuleId = useMemo(() => findModuleId(modules, currentLessonId), [modules, currentLessonId])

  // Auto-open the current module and keep it open
  useEffect(() => {
    if (currentModuleId) {
      setOpenModules((prev) => new Set([...prev, currentModuleId]))
    }
  }, [currentModuleId])

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  return (
    <nav className="lesson-nav-sidebar" aria-label="Course navigation">
      <div className="lesson-nav-sidebar__header">
        <h2 className="lesson-nav-sidebar__title">Course Content</h2>
      </div>
      <div className="lesson-nav-sidebar__content">
        {modules.map((module) => {
          const isOpen = openModules.has(module.id)
          const hasCurrentLesson = module.lessons.some((lesson) => lesson.id === currentLessonId)
          const completedCount = module.lessons.filter((lesson) => completedLessons.has(lesson.id)).length
          const totalLessons = module.lessons.length
          const progressPercent = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

          return (
            <div key={module.id} className={`lesson-nav-sidebar__module${hasCurrentLesson ? ' has-active' : ''}`}>
              <button
                type="button"
                className="lesson-nav-sidebar__module-header"
                onClick={() => toggleModule(module.id)}
                aria-expanded={isOpen}
                aria-controls={`${module.id}-lessons`}
              >
                <div className="lesson-nav-sidebar__module-info">
                  <ChevronIcon open={isOpen} />
                  <span className="lesson-nav-sidebar__module-title">{module.title}</span>
                </div>
                <div className="lesson-nav-sidebar__module-meta">
                  <span className="lesson-nav-sidebar__module-progress">
                    {completedCount}/{totalLessons}
                  </span>
                </div>
              </button>
              {totalLessons > 0 && (
                <div className="lesson-nav-sidebar__progress-bar" aria-hidden="true">
                  <div className="lesson-nav-sidebar__progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
              )}
              {isOpen && (
                <ul className="lesson-nav-sidebar__lesson-list" id={`${module.id}-lessons`}>
                  {module.lessons.map((lesson, index) => {
                    const isCompleted = completedLessons.has(lesson.id)
                    const isActive = lesson.id === currentLessonId
                    return (
                      <li key={lesson.id} className="lesson-nav-sidebar__lesson-item">
                        <button
                          type="button"
                          className={`lesson-nav-sidebar__lesson-link${isActive ? ' active' : ''}${
                            isCompleted ? ' completed' : ''
                          }`}
                          onClick={() => onSelect(lesson.id)}
                        >
                          <span className="lesson-nav-sidebar__lesson-number">{index + 1}</span>
                          <span className="lesson-nav-sidebar__lesson-content">
                            <span className="lesson-nav-sidebar__lesson-title">{lesson.title}</span>
                            {lesson.summary && (
                              <span className="lesson-nav-sidebar__lesson-summary">{lesson.summary}</span>
                            )}
                          </span>
                          {isCompleted && <CheckIcon />}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}

function buildModules(lessons: LessonIndexEntry[]): LessonModule[] {
  const moduleMap = new Map<string, LessonModule>()
  lessons.forEach((lesson) => {
    const moduleId = extractModuleId(lesson.id)
    if (!moduleMap.has(moduleId)) {
      moduleMap.set(moduleId, { id: moduleId, title: formatModuleTitle(moduleId, lesson.title), lessons: [] })
    }
    moduleMap.get(moduleId)!.lessons.push(lesson)
  })
  return Array.from(moduleMap.values())
}

function extractModuleId(lessonId: string): string {
  const match = lessonId.match(/^(module-\d{2})/)
  if (match) return match[1]
  return 'module-extra'
}

function formatModuleTitle(moduleId: string, _lessonTitle: string): string {
  if (moduleId === 'module-extra') {
    return 'Additional lessons'
  }
  const numberMatch = moduleId.match(/module-(\d{2})/)
  const number = numberMatch ? Number(numberMatch[1]) : ''

  // Module name mapping
  const moduleNames: Record<number, string> = {
    1: 'Models & refs',
    2: 'Layering',
    3: 'Materializations',
    4: 'Tests & Docs',
    5: 'Snapshots',
    6: 'Manifest',
    7: 'Jinja & Macros'
  }

  const moduleName = moduleNames[number as number]
  return moduleName ? `Module ${number}: ${moduleName}` : `Module ${number}`
}

function findModuleId(modules: LessonModule[], lessonId: string): string | null {
  for (const module of modules) {
    if (module.lessons.some((lesson) => lesson.id === lessonId)) {
      return module.id
    }
  }
  return null
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="lesson-nav-sidebar__chevron"
      viewBox="0 0 16 16"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={open ? 'M4 6.5 8 10.5 12 6.5' : 'M6.5 4 10.5 8 6.5 12'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <span className="lesson-nav-sidebar__lesson-check" aria-label="Completed" role="img">
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M4 8.5 7 11.5 12.5 5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
