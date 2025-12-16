/**
 * Progress Store - Manages user learning progress using localStorage
 *
 * Tracks:
 * - Completed lessons
 * - Current lesson ID
 * - In-progress SQL edits per lesson
 */

const STORAGE_KEY_PREFIX = 'learn_dbt_'
const COMPLETED_LESSONS_KEY = `${STORAGE_KEY_PREFIX}completed`
const CURRENT_LESSON_KEY = `${STORAGE_KEY_PREFIX}current_lesson`
const SQL_EDITS_KEY = `${STORAGE_KEY_PREFIX}sql_edits`

export interface ProgressData {
  completedLessons: Set<string>
  currentLessonId: string | null
  sqlEdits: Map<string, string>
}

/**
 * Load all progress from localStorage
 */
export function loadProgress(): ProgressData {
  try {
    const completedRaw = localStorage.getItem(COMPLETED_LESSONS_KEY)
    const completedLessons = completedRaw ? new Set<string>(JSON.parse(completedRaw)) : new Set<string>()

    const currentLessonId = localStorage.getItem(CURRENT_LESSON_KEY)

    const sqlEditsRaw = localStorage.getItem(SQL_EDITS_KEY)
    const sqlEdits = sqlEditsRaw ? new Map<string, string>(JSON.parse(sqlEditsRaw)) : new Map<string, string>()

    return {
      completedLessons,
      currentLessonId,
      sqlEdits,
    }
  } catch (error) {
    console.warn('Failed to load progress from localStorage:', error)
    return {
      completedLessons: new Set(),
      currentLessonId: null,
      sqlEdits: new Map(),
    }
  }
}

/**
 * Mark a lesson as completed
 */
export function markLessonComplete(lessonId: string): void {
  try {
    const progress = loadProgress()
    progress.completedLessons.add(lessonId)
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify([...progress.completedLessons]))
  } catch (error) {
    console.warn('Failed to save lesson completion:', error)
  }
}

/**
 * Check if a lesson is completed
 */
export function isLessonComplete(lessonId: string): boolean {
  const progress = loadProgress()
  return progress.completedLessons.has(lessonId)
}

/**
 * Get all completed lesson IDs
 */
export function getCompletedLessons(): Set<string> {
  return loadProgress().completedLessons
}

/**
 * Save the current lesson ID
 */
export function saveCurrentLesson(lessonId: string): void {
  try {
    localStorage.setItem(CURRENT_LESSON_KEY, lessonId)
  } catch (error) {
    console.warn('Failed to save current lesson:', error)
  }
}

/**
 * Get the last visited lesson ID
 */
export function getCurrentLesson(): string | null {
  return loadProgress().currentLessonId
}

/**
 * Save in-progress SQL edit for a lesson
 */
export function saveSqlEdit(lessonId: string, sql: string): void {
  try {
    const progress = loadProgress()
    progress.sqlEdits.set(lessonId, sql)
    localStorage.setItem(SQL_EDITS_KEY, JSON.stringify([...progress.sqlEdits]))
  } catch (error) {
    console.warn('Failed to save SQL edit:', error)
  }
}

/**
 * Get saved SQL edit for a lesson (returns null if none saved)
 */
export function getSqlEdit(lessonId: string): string | null {
  const progress = loadProgress()
  return progress.sqlEdits.get(lessonId) ?? null
}

/**
 * Clear SQL edit for a lesson (when user resets)
 */
export function clearSqlEdit(lessonId: string): void {
  try {
    const progress = loadProgress()
    progress.sqlEdits.delete(lessonId)
    localStorage.setItem(SQL_EDITS_KEY, JSON.stringify([...progress.sqlEdits]))
  } catch (error) {
    console.warn('Failed to clear SQL edit:', error)
  }
}

/**
 * Reset all progress (for testing or user-initiated reset)
 */
export function resetAllProgress(): void {
  try {
    localStorage.removeItem(COMPLETED_LESSONS_KEY)
    localStorage.removeItem(CURRENT_LESSON_KEY)
    localStorage.removeItem(SQL_EDITS_KEY)
  } catch (error) {
    console.warn('Failed to reset progress:', error)
  }
}

/**
 * Get progress statistics
 */
export function getProgressStats(): {
  completedCount: number
  totalEdits: number
} {
  const progress = loadProgress()
  return {
    completedCount: progress.completedLessons.size,
    totalEdits: progress.sqlEdits.size,
  }
}
