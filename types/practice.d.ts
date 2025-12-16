/**
 * Practice Mode Types
 * Short, focused challenges that reinforce dbt Core concepts
 */

export type ChallengeType =
  | 'fix_ref' // Replace hardcoded tables with ref()
  | 'fix_layer' // Move logic to correct layer
  | 'fix_grain' // Identify and fix grain issues
  | 'choose_materialization' // Select appropriate materialization
  | 'attach_tests' // Add appropriate tests
  | 'split_model' // Break up a god model
  | 'fix_dependency' // Fix circular or missing dependencies

export type ChallengeCheck = {
  type: 'includes_ref' | 'materialization' | 'mentions_column' | 'contains_text' | 'layer_structure' | 'test_count'
  value: string | number
  hint: string
}

export interface Challenge {
  id: string
  type: ChallengeType
  title: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeEstimate: string
  description: string
  scenario: string
  starterSql: string
  checks: ChallengeCheck[]
  explanation: string
  hint?: string
  tags: string[]
}

export interface ChallengeCategory {
  id: string
  title: string
  description: string
  challenges: Challenge[]
}
