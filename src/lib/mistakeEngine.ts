/**
 * Mistake Museum Engine - Loads common dbt mistakes
 */

import type { Mistake, MistakeCollection } from '../../types/mistake'
import architectureMistakes from '../data/mistakes/architecture-mistakes.json'
import dependencyMistakes from '../data/mistakes/dependency-mistakes.json'
import grainMistakes from '../data/mistakes/grain-mistakes.json'

const mistakeCollections: MistakeCollection[] = [
  architectureMistakes as MistakeCollection,
  dependencyMistakes as MistakeCollection,
  grainMistakes as MistakeCollection,
]

/**
 * Get all mistake collections
 */
export function getMistakeCollections(): MistakeCollection[] {
  return mistakeCollections
}

/**
 * Get all mistakes flattened
 */
export function getAllMistakes(): Mistake[] {
  return mistakeCollections.flatMap((collection) => collection.mistakes)
}

/**
 * Get a specific mistake by ID
 */
export function getMistakeById(id: string): Mistake | undefined {
  return getAllMistakes().find((mistake) => mistake.id === id)
}

/**
 * Get mistakes by severity
 */
export function getMistakesBySeverity(severity: Mistake['severity']): Mistake[] {
  return getAllMistakes().filter((mistake) => mistake.severity === severity)
}

/**
 * Get mistakes by category
 */
export function getMistakesByCategory(category: Mistake['category']): Mistake[] {
  return getAllMistakes().filter((mistake) => mistake.category === category)
}
