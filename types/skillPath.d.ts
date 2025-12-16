/**
 * Skill Paths - Guided learning tracks for different roles
 */

export type SkillPathId = 'analyst' | 'engineer' | 'reader'

export interface SkillPathStep {
  type: 'lesson' | 'practice' | 'mistake' | 'action'
  id: string
  title: string
  description: string
  estimated_time: string
  optional?: boolean
}

export interface SkillPath {
  id: SkillPathId
  title: string
  subtitle: string
  description: string
  ideal_for: string[]
  learning_outcomes: string[]
  total_time: string
  steps: SkillPathStep[]
  completion_badge: string
}
