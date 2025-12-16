import { useState } from 'react'
import type { SkillPath, SkillPathStep } from '../../types/skillPath'
import skillPathsData from '../data/skillPaths.json'
import './SkillPathsPage.css'

const skillPaths = skillPathsData.paths as SkillPath[]

export default function SkillPathsPage() {
  const [selectedPath, setSelectedPath] = useState<SkillPath | null>(null)

  if (selectedPath) {
    return <PathDetail path={selectedPath} onBack={() => setSelectedPath(null)} />
  }

  return (
    <div className="skill-paths-page">
      <header className="skill-paths-header">
        <h1>Choose Your Learning Path</h1>
        <p className="skill-paths-subtitle">
          Personalized tracks based on your role and goals. Each path guides you through curated lessons,
          practice challenges, and real-world mistakes.
        </p>
      </header>

      <div className="skill-paths-grid">
        {skillPaths.map((path) => (
          <article key={path.id} className="skill-path-card">
            <div className="skill-path-card__header">
              <span className={`skill-path-icon skill-path-icon--${path.id}`}>
                {getPathIcon(path.id)}
              </span>
              <div>
                <h2 className="skill-path-card__title">{path.title}</h2>
                <p className="skill-path-card__subtitle">{path.subtitle}</p>
              </div>
            </div>

            <p className="skill-path-card__description">{path.description}</p>

            <div className="skill-path-card__meta">
              <div className="meta-item">
                <span className="meta-label">Time</span>
                <span className="meta-value">{path.total_time}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Steps</span>
                <span className="meta-value">{path.steps.length}</span>
              </div>
            </div>

            <div className="skill-path-card__ideal">
              <p className="section-label">Ideal for:</p>
              <ul>
                {path.ideal_for.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="skill-path-card__button"
              onClick={() => setSelectedPath(path)}
            >
              View {path.title}
            </button>
          </article>
        ))}
      </div>

      <section className="skill-paths-help">
        <h2>Not sure which path to choose?</h2>
        <div className="help-grid">
          <div className="help-card">
            <h3>👩‍💼 Choose Analyst if...</h3>
            <ul>
              <li>You write SQL for reports and dashboards</li>
              <li>You need to understand existing dbt projects</li>
              <li>You're focused on business metrics and marts</li>
            </ul>
          </div>
          <div className="help-card">
            <h3>👨‍💻 Choose Engineer if...</h3>
            <ul>
              <li>You build and maintain data pipelines</li>
              <li>You care about performance and testing</li>
              <li>You architect dbt project structure</li>
            </ul>
          </div>
          <div className="help-card">
            <h3>👀 Choose Reader if...</h3>
            <ul>
              <li>You're joining an existing dbt project</li>
              <li>You need to understand code quickly</li>
              <li>You want to recognize patterns fast</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function PathDetail({ path, onBack }: { path: SkillPath; onBack: () => void }) {
  return (
    <div className="path-detail">
      <button type="button" className="path-detail__back" onClick={onBack}>
        ← All Paths
      </button>

      <header className="path-detail__header">
        <span className={`skill-path-icon skill-path-icon--${path.id} skill-path-icon--large`}>
          {getPathIcon(path.id)}
        </span>
        <div>
          <h1>{path.title}</h1>
          <p className="path-detail__subtitle">{path.subtitle}</p>
        </div>
      </header>

      <div className="path-detail__grid">
        <div className="path-detail__main">
          <section className="path-section">
            <h2>About This Path</h2>
            <p>{path.description}</p>
          </section>

          <section className="path-section">
            <h2>What You'll Learn</h2>
            <ul className="learning-outcomes">
              {path.learning_outcomes.map((outcome, index) => (
                <li key={index}>
                  <span className="outcome-check">✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          <section className="path-section">
            <h2>Your Learning Journey</h2>
            <p className="section-hint">
              Follow these steps in order for the best learning experience. Each step builds on the previous
              ones.
            </p>
            <div className="path-steps">
              {path.steps.map((step, index) => (
                <StepCard key={index} step={step} number={index + 1} />
              ))}
            </div>
          </section>
        </div>

        <aside className="path-detail__sidebar">
          <div className="path-stat-card">
            <h3>Path Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Time</span>
              <span className="stat-value">{path.total_time}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Steps</span>
              <span className="stat-value">{path.steps.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion Badge</span>
              <span className="stat-badge">{path.completion_badge}</span>
            </div>
          </div>

          <div className="path-ideal-card">
            <h3>Ideal For</h3>
            <ul>
              {path.ideal_for.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function StepCard({ step, number }: { step: SkillPathStep; number: number }) {
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚'
      case 'practice':
        return '🏋️'
      case 'mistake':
        return '⚠️'
      case 'action':
        return '🎯'
      default:
        return '📝'
    }
  }

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'Lesson'
      case 'practice':
        return 'Practice'
      case 'mistake':
        return 'Mistake'
      case 'action':
        return 'Action'
      default:
        return 'Step'
    }
  }

  return (
    <div className={`step-card ${step.optional ? 'step-card--optional' : ''}`}>
      <div className="step-card__number">{number}</div>
      <div className="step-card__content">
        <div className="step-card__header">
          <span className={`step-type step-type--${step.type}`}>
            {getStepIcon(step.type)} {getStepTypeLabel(step.type)}
          </span>
          {step.optional && <span className="step-optional">Optional</span>}
          <span className="step-time">{step.estimated_time}</span>
        </div>
        <h4 className="step-card__title">{step.title}</h4>
        <p className="step-card__description">{step.description}</p>
      </div>
    </div>
  )
}

function getPathIcon(pathId: string): string {
  switch (pathId) {
    case 'analyst':
      return '👩‍💼'
    case 'engineer':
      return '👨‍💻'
    case 'reader':
      return '👀'
    default:
      return '🎯'
  }
}
