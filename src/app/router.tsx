import { useEffect, useState, type JSX } from 'react'
import LearnPage from '../pages/LearnPage'
import SkillPathsPage from '../pages/SkillPathsPage'
import PracticePage from '../pages/PracticePage'
import MistakeMuseumPage from '../pages/MistakeMuseumPage'
import ExplainPage from '../pages/ExplainPage'
import CheatSheetsPage from '../pages/CheatSheetsPage'
import ProjectExplorerPage from '../pages/ProjectExplorerPage'
import ManifestExplainerPage from '../pages/ManifestExplainerPage'
import FoundationsPage from '../pages/FoundationsPage'
import NextStepsPage from '../pages/NextStepsPage'

export type RouteId = 'learn' | 'paths' | 'practice' | 'mistakes' | 'explain' | 'cheatsheets' | 'projects' | 'manifest' | 'foundations' | 'next'

export type RouteConfig = {
  id: RouteId
  title: string
  blurb: string
  element: JSX.Element
}

export const routes: RouteConfig[] = [
  {
    id: 'paths',
    title: 'Paths',
    blurb: 'Guided learning tracks for your role.',
    element: <SkillPathsPage />,
  },
  {
    id: 'learn',
    title: 'Lessons',
    blurb: 'Guided walkthroughs of dbt concepts.',
    element: <LearnPage />,
  },
  {
    id: 'practice',
    title: 'Practice',
    blurb: 'Short challenges to reinforce concepts.',
    element: <PracticePage />,
  },
  {
    id: 'mistakes',
    title: 'Mistakes',
    blurb: 'Learn from common dbt failures.',
    element: <MistakeMuseumPage />,
  },
  {
    id: 'explain',
    title: 'Explain',
    blurb: 'Analyze any dbt model SQL.',
    element: <ExplainPage />,
  },
  {
    id: 'cheatsheets',
    title: 'Cheat Sheets',
    blurb: 'Printable reference guides.',
    element: <CheatSheetsPage />,
  },
  {
    id: 'projects',
    title: 'Projects',
    blurb: 'Tour the built-in demo projects.',
    element: <ProjectExplorerPage />,
  },
  {
    id: 'manifest',
    title: 'Manifest',
    blurb: 'See how dbt stores lineage internally.',
    element: <ManifestExplainerPage />,
  },
  {
    id: 'foundations',
    title: 'Foundations',
    blurb: 'What dbt assumes you already know.',
    element: <FoundationsPage />,
  },
  {
    id: 'next',
    title: 'Next Steps',
    blurb: 'Level up beyond the fundamentals.',
    element: <NextStepsPage />,
  },
]

const DEFAULT_ROUTE: RouteId = 'learn'

function parseHash(): RouteId {
  const hashValue = window.location.hash.replace('#', '').replace('/', '')
  if (hashValue === 'paths') return 'paths'
  if (hashValue === 'practice') return 'practice'
  if (hashValue === 'mistakes') return 'mistakes'
  if (hashValue === 'explain') return 'explain'
  if (hashValue === 'cheatsheets') return 'cheatsheets'
  if (hashValue === 'projects') return 'projects'
  if (hashValue === 'manifest') return 'manifest'
  if (hashValue === 'foundations') return 'foundations'
  if (hashValue === 'next') return 'next'
  return DEFAULT_ROUTE
}

export function useSimpleRouter() {
  const [currentRoute, setCurrentRoute] = useState<RouteId>(() => parseHash())

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (route: RouteId) => {
    if (route === currentRoute) return
    window.location.hash = `/${route}`
    setCurrentRoute(route)
  }

  return { currentRoute, navigate }
}

type RouterViewProps = {
  currentRoute: RouteId
}

export function RouterView({ currentRoute }: RouterViewProps) {
  const route = routes.find((entry) => entry.id === currentRoute) ?? routes[0]
  return route.element
}
