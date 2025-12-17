import { useSimpleRouter } from '../app/router'
import { routes } from '../app/router'
import './LandingPage.css'

export default function LandingPage() {
  const { navigate } = useSimpleRouter()

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <h1 className="landing-title">dbt learning studio</h1>
        <p className="landing-subtitle">Concept-first practice space</p>
        <p className="landing-description">
          Learn dbt through hands-on lessons, guided practice, and real-world examples.
          Master the fundamentals and build your data transformation skills.
        </p>
      </div>

      <div className="landing-features">
        <h2 className="landing-section-title">Get Started</h2>
        <div className="landing-cards">
          {routes.slice(0, 6).map((route) => (
            <button
              key={route.id}
              className="landing-card"
              onClick={() => navigate(route.id)}
            >
              <h3 className="landing-card-title">{route.title}</h3>
              <p className="landing-card-blurb">{route.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="landing-cta">
        <button
          className="landing-cta-button"
          onClick={() => navigate('learn')}
        >
          Start Learning →
        </button>
      </div>
    </div>
  )
}

