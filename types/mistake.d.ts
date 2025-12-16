/**
 * Mistake Museum Types
 * Real-world failure patterns in dbt projects
 */

export type MistakeCategory =
  | 'architecture' // Layer violations, god models
  | 'dependencies' // Circular refs, hardcoded names
  | 'grain' // Wrong-grain joins, fanout
  | 'testing' // Wrong tests, missing tests
  | 'performance' // Inefficient patterns

export interface Mistake {
  id: string
  title: string
  category: MistakeCategory
  severity: 'critical' | 'major' | 'minor'
  description: string
  symptoms: string[]
  brokenCode: string
  whyBad: string
  fixedCode: string
  explanation: string
  prevention: string
  tags: string[]
}

export interface MistakeCollection {
  id: string
  title: string
  description: string
  mistakes: Mistake[]
}
