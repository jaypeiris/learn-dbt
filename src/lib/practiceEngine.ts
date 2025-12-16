/**
 * Practice Engine - Loads and manages practice challenges
 */

import type { Challenge, ChallengeCategory } from '../../types/practice'
import refChallenges from '../data/challenges/ref-challenges.json'
import materializationChallenges from '../data/challenges/materialization-challenges.json'
import layerChallenges from '../data/challenges/layer-challenges.json'
import grainChallenges from '../data/challenges/grain-challenges.json'
import testingChallenges from '../data/challenges/testing-challenges.json'
import refactoringChallenges from '../data/challenges/refactoring-challenges.json'

const challengeCategories: ChallengeCategory[] = [
  refChallenges as ChallengeCategory,
  layerChallenges as ChallengeCategory,
  materializationChallenges as ChallengeCategory,
  grainChallenges as ChallengeCategory,
  testingChallenges as ChallengeCategory,
  refactoringChallenges as ChallengeCategory,
]

/**
 * Get all challenge categories
 */
export function getChallengeCategories(): ChallengeCategory[] {
  return challengeCategories
}

/**
 * Get all challenges flattened
 */
export function getAllChallenges(): Challenge[] {
  return challengeCategories.flatMap((category) => category.challenges)
}

/**
 * Get a specific challenge by ID
 */
export function getChallengeById(id: string): Challenge | undefined {
  return getAllChallenges().find((challenge) => challenge.id === id)
}

/**
 * Get challenges by difficulty
 */
export function getChallengesByDifficulty(difficulty: Challenge['difficulty']): Challenge[] {
  return getAllChallenges().filter((challenge) => challenge.difficulty === difficulty)
}

/**
 * Get challenges by type
 */
export function getChallengesByType(type: Challenge['type']): Challenge[] {
  return getAllChallenges().filter((challenge) => challenge.type === type)
}

/**
 * Get challenges by tag
 */
export function getChallengesByTag(tag: string): Challenge[] {
  return getAllChallenges().filter((challenge) => challenge.tags.includes(tag))
}
