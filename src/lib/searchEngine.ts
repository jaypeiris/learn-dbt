/**
 * Search Engine - Global search across lessons, projects, and concepts
 */

import { getLessonIndex } from './lessonEngine'
import type { LessonIndexEntry } from '../../types/lesson'

export interface SearchResult {
  id: string
  type: 'lesson' | 'project' | 'concept'
  title: string
  description: string
  matchedText?: string
  score: number
  route: string // Navigation route
}

/**
 * Search across all content
 */
export function search(query: string, limit = 10): SearchResult[] {
  if (!query || query.trim().length < 2) {
    return []
  }

  const normalizedQuery = query.toLowerCase().trim()
  const results: SearchResult[] = []

  // Search lessons
  const lessons = getLessonIndex()
  for (const lesson of lessons) {
    const score = scoreLessonMatch(lesson, normalizedQuery)
    if (score > 0) {
      results.push({
        id: lesson.id,
        type: 'lesson',
        title: lesson.title,
        description: lesson.summary,
        matchedText: extractMatchedText(lesson, normalizedQuery),
        score,
        route: `#/learn?lesson=${lesson.id}`,
      })
    }
  }

  // Search dbt concepts (common terms)
  const concepts = searchConcepts(normalizedQuery)
  results.push(...concepts)

  // Sort by score (descending) and limit
  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}

/**
 * Score how well a lesson matches the query
 */
function scoreLessonMatch(lesson: LessonIndexEntry, query: string): number {
  let score = 0

  const title = lesson.title.toLowerCase()
  const summary = lesson.summary.toLowerCase()
  const id = lesson.id.toLowerCase()

  // Exact title match (highest score)
  if (title === query) {
    score += 100
  }

  // Title starts with query
  if (title.startsWith(query)) {
    score += 50
  }

  // Title contains query
  if (title.includes(query)) {
    score += 30
  }

  // Summary contains query
  if (summary.includes(query)) {
    score += 20
  }

  // ID contains query (e.g., "module-01")
  if (id.includes(query)) {
    score += 10
  }

  // Boost for exact word matches
  const titleWords = title.split(/\s+/)
  const summaryWords = summary.split(/\s+/)
  const queryWords = query.split(/\s+/)

  for (const queryWord of queryWords) {
    if (titleWords.includes(queryWord)) {
      score += 15
    }
    if (summaryWords.includes(queryWord)) {
      score += 5
    }
  }

  return score
}

/**
 * Extract relevant text snippet showing the match
 */
function extractMatchedText(lesson: LessonIndexEntry, query: string): string {
  const summary = lesson.summary
  const lowerSummary = summary.toLowerCase()
  const index = lowerSummary.indexOf(query)

  if (index === -1) {
    return summary.slice(0, 100)
  }

  // Extract ~100 chars around the match
  const start = Math.max(0, index - 30)
  const end = Math.min(summary.length, index + query.length + 70)

  let snippet = summary.slice(start, end)
  if (start > 0) snippet = '...' + snippet
  if (end < summary.length) snippet = snippet + '...'

  return snippet
}

/**
 * Search common dbt concepts
 */
function searchConcepts(query: string): SearchResult[] {
  const concepts = [
    {
      id: 'ref',
      title: 'ref()',
      description: 'References another model and creates a dependency',
      keywords: ['ref', 'reference', 'dependency', 'function'],
      route: '#/learn?lesson=module-01-ref-basics',
    },
    {
      id: 'materialization',
      title: 'Materializations',
      description: 'How dbt persists models (view, table, incremental, ephemeral)',
      keywords: ['materialization', 'view', 'table', 'incremental', 'ephemeral', 'config'],
      route: '#/learn?lesson=module-03-materializations',
    },
    {
      id: 'staging',
      title: 'Staging Layer',
      description: 'First transformation layer that cleans and renames raw data',
      keywords: ['staging', 'stg', 'layer', 'structure', 'raw'],
      route: '#/learn?lesson=module-02-staging-layer',
    },
    {
      id: 'intermediate',
      title: 'Intermediate Layer',
      description: 'Business logic layer between staging and marts',
      keywords: ['intermediate', 'int', 'layer', 'business logic'],
      route: '#/learn?lesson=module-02-intermediate-models',
    },
    {
      id: 'mart',
      title: 'Marts',
      description: 'Final business-facing models',
      keywords: ['mart', 'marts', 'final', 'business', 'layer'],
      route: '#/learn?lesson=module-02-marts',
    },
    {
      id: 'test',
      title: 'Tests',
      description: 'Data quality checks and assertions',
      keywords: ['test', 'tests', 'testing', 'quality', 'assertion', 'generic', 'singular'],
      route: '#/learn?lesson=module-04-tests-intro',
    },
    {
      id: 'snapshot',
      title: 'Snapshots',
      description: 'Track how data changes over time',
      keywords: ['snapshot', 'snapshots', 'history', 'time', 'scd', 'slowly changing'],
      route: '#/learn?lesson=module-05-snapshots',
    },
    {
      id: 'manifest',
      title: 'Manifest',
      description: "dbt's internal representation of your project as a graph",
      keywords: ['manifest', 'graph', 'dag', 'metadata', 'nodes', 'internal'],
      route: '#/learn?lesson=module-06-manifest',
    },
    {
      id: 'source',
      title: 'source()',
      description: 'Reference raw tables from your warehouse',
      keywords: ['source', 'sources', 'raw', 'warehouse', 'table'],
      route: '#/learn?lesson=module-01-ref-vs-source',
    },
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Document models and columns',
      keywords: ['docs', 'documentation', 'description', 'schema.yml'],
      route: '#/learn?lesson=module-04-documentation',
    },
  ]

  const results: SearchResult[] = []

  for (const concept of concepts) {
    let score = 0

    // Check title
    if (concept.title.toLowerCase().includes(query)) {
      score += 60
    }

    // Check description
    if (concept.description.toLowerCase().includes(query)) {
      score += 30
    }

    // Check keywords
    for (const keyword of concept.keywords) {
      if (keyword.includes(query)) {
        score += 20
      }
      if (keyword === query) {
        score += 40
      }
    }

    if (score > 0) {
      results.push({
        id: concept.id,
        type: 'concept',
        title: concept.title,
        description: concept.description,
        score,
        route: concept.route,
      })
    }
  }

  return results
}

/**
 * Get popular/suggested searches
 */
export function getSuggestedSearches(): string[] {
  return [
    'ref',
    'materialization',
    'staging',
    'tests',
    'snapshots',
    'incremental',
    'manifest',
    'layers',
  ]
}
