import './App.css'
import { RouterView, useSimpleRouter, type RouteId } from './router'
import SearchBar from '../components/search/SearchBar'
import { navSections, getSectionForRoute, getRoutesForSection, type SectionId } from './navigation'

function App() {
  const { currentRoute, navigate } = useSimpleRouter()
  const currentSection = getSectionForRoute(currentRoute)
  const subRoutes = getRoutesForSection(currentSection)

  const handleSearchNavigation = (route: string) => {
    // Parse hash route and navigate
    const hash = route.replace('#/', '')
    const [routeId, queryString] = hash.split('?')

    if (queryString) {
      // Extract lesson parameter if present
      const params = new URLSearchParams(queryString)
      const lessonId = params.get('lesson')
      if (lessonId) {
        window.location.hash = `/${routeId}?lesson=${lessonId}`
      }
    } else if (routeId === 'learn' || routeId === 'paths' || routeId === 'practice' || routeId === 'mistakes' || routeId === 'explain' || routeId === 'cheatsheets' || routeId === 'projects' || routeId === 'manifest' || routeId === 'foundations' || routeId === 'next') {
      navigate(routeId as RouteId)
    }
  }

  const handleSectionClick = (sectionId: SectionId) => {
    const section = navSections.find((s) => s.id === sectionId)
    if (section) {
      navigate(section.defaultRoute)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <p className="brand-title">dbt learning studio</p>
          <p className="brand-subtitle">Concept-first practice space</p>
        </div>
        <div className="header-actions">
          <SearchBar onNavigate={handleSearchNavigation} />
          <nav className="primary-nav" aria-label="Primary">
            {navSections.map((section) => (
              <button
                type="button"
                key={section.id}
                className={section.id === currentSection ? 'nav-section active' : 'nav-section'}
                onClick={() => handleSectionClick(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {subRoutes.length > 1 && (
        <nav className="sub-nav" aria-label="Secondary">
          <div className="sub-nav-container">
            {subRoutes.map((route) => (
              <button
                type="button"
                key={route.id}
                className={route.id === currentRoute ? 'sub-nav-link active' : 'sub-nav-link'}
                onClick={() => navigate(route.id)}
              >
                <span className="sub-nav-label">{route.label}</span>
                <span className="sub-nav-description">{route.description}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="app-main">
        <RouterView currentRoute={currentRoute} />
      </main>
    </div>
  )
}

export default App
