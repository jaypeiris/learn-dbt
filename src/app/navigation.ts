import type { RouteId } from './router'

export type SectionId = 'learn' | 'practice' | 'reference' | 'guide'

export interface SubRoute {
  id: RouteId
  label: string
  description: string
}

export interface NavSection {
  id: SectionId
  label: string
  defaultRoute: RouteId
  routes: SubRoute[]
}

export const navSections: NavSection[] = [
  {
    id: 'learn',
    label: 'Learn',
    defaultRoute: 'learn',
    routes: [
      { id: 'learn', label: 'Lessons', description: 'Guided walkthroughs of dbt concepts' },
      { id: 'paths', label: 'Skill Paths', description: 'Guided learning tracks for your role' },
    ],
  },
  {
    id: 'practice',
    label: 'Practice',
    defaultRoute: 'practice',
    routes: [
      { id: 'practice', label: 'Challenges', description: 'Short challenges to reinforce concepts' },
      { id: 'mistakes', label: 'Mistakes', description: 'Learn from common dbt failures' },
      { id: 'explain', label: 'Explain', description: 'Analyze any dbt model SQL' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    defaultRoute: 'cheatsheets',
    routes: [
      { id: 'cheatsheets', label: 'Cheat Sheets', description: 'Printable reference guides' },
      { id: 'projects', label: 'Projects', description: 'Tour the built-in demo projects' },
      { id: 'manifest', label: 'Manifest', description: 'See how dbt stores lineage internally' },
    ],
  },
  {
    id: 'guide',
    label: 'Guide',
    defaultRoute: 'foundations',
    routes: [
      { id: 'foundations', label: 'Foundations', description: 'What dbt assumes you already know' },
      { id: 'next', label: 'Next Steps', description: 'Level up beyond the fundamentals' },
    ],
  },
]

export function getSectionForRoute(routeId: RouteId): SectionId {
  if (routeId === 'landing') {
    return 'learn'
  }
  for (const section of navSections) {
    if (section.routes.some((r) => r.id === routeId)) {
      return section.id
    }
  }
  return 'learn'
}

export function getRoutesForSection(sectionId: SectionId): SubRoute[] {
  return navSections.find((s) => s.id === sectionId)?.routes ?? []
}
