import { useEffect, useState } from 'react'
import type { BuildPhase } from '../../lib/lineageBuilder'
import './BuildOrderAnimator.css'

type BuildOrderAnimatorProps = {
  phases: BuildPhase[]
}

export default function BuildOrderAnimator({ phases }: BuildOrderAnimatorProps) {
  const [activePhase, setActivePhase] = useState(phases[0]?.id)

  useEffect(() => {
    setActivePhase(phases[0]?.id)
  }, [phases])

  useEffect(() => {
    if (!phases.length) return
    const interval = window.setInterval(() => {
      setActivePhase((current) => {
        const index = phases.findIndex((phase) => phase.id === current)
        const next = phases[(index + 1) % phases.length]
        return next.id
      })
    }, 2000)
    return () => window.clearInterval(interval)
  }, [phases])

  return (
    <div className="build-order">
      {phases.map((phase) => (
        <div key={phase.id} className={phase.id === activePhase ? 'build-order__step active' : 'build-order__step'}>
          <span className={`status ${phase.role}`}>{phase.role}</span>
          <p>{phase.label}</p>
        </div>
      ))}
    </div>
  )
}
