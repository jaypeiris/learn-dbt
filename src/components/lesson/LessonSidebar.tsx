import { useEffect, useMemo, useState } from 'react'
import type { LessonIndexEntry } from '../../../types/lesson'
import './LessonSidebar.css'

type LessonSidebarProps = {
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

export default function LessonSidebar({ lessons, currentLessonId, completedLessons, onSelect }: LessonSidebarProps) {
  const modules = useMemo(() => buildModules(lessons), [lessons])
  const [openModule, setOpenModule] = useState<string>(() => findModuleId(modules, currentLessonId))

  useEffect(() => {
    setOpenModule(findModuleId(modules, currentLessonId))
  }, [currentLessonId, modules])

  const hintLabel = useMemo(() => {
    const primaryModules = modules.filter((module) => module.id.startsWith('module-'))
    const activeModule = primaryModules.findIndex((module) => module.lessons.some((lesson) => lesson.id === currentLessonId))
    if (activeModule === -1 || primaryModules.length === 0) {
      return undefined
    }
    return `Module ${activeModule + 1} of ${primaryModules.length}`
  }, [modules, currentLessonId])

  return (
    <aside className="lesson-sidebar" aria-label="Lesson outline">
      <p className="lesson-sidebar__title">Course outline</p>
      {hintLabel && <p className="lesson-sidebar__hint">{hintLabel}</p>}
      <div className="lesson-sidebar__modules">
        {modules.map((module) => {
          const isOpen = module.id === openModule
          return (
            <section key={module.id} className="lesson-module">
              <button
                type="button"
                className={isOpen ? 'lesson-module__label active' : 'lesson-module__label'}
                onClick={() => setOpenModule(module.id)}
              >
                {module.title}
              </button>
              <ul className={isOpen ? 'lesson-module__list expanded' : 'lesson-module__list'}>
                {module.lessons.map((lesson) => {
                  const isCompleted = completedLessons.has(lesson.id)
                  const isActive = lesson.id === currentLessonId
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={`lesson-link${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}
                        onClick={() => onSelect(lesson.id)}
                      >
                        {isCompleted && <span className="lesson-link__check" aria-hidden="true">✓</span>}
                        <span className="lesson-link__title">{lesson.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </aside>
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
    4: 'Tests & docs',
    5: 'Snapshots',
    6: 'Manifest'
  }

  const moduleName = moduleNames[number as number]
  return moduleName ? `Module ${number}: ${moduleName}` : `Module ${number}`
}

function findModuleId(modules: LessonModule[], lessonId: string): string {
  for (const module of modules) {
    if (module.lessons.some((lesson) => lesson.id === lessonId)) {
      return module.id
    }
  }
  return modules[0]?.id ?? 'module-extra'
}
