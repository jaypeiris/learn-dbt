import { useEffect, useMemo, useState } from 'react'
import type { ProjectDefinition, ProjectModel } from '../../types/project'
import SqlEditor from '../components/editor/SqlEditor'
import ecommerceProject from '../data/projects/ecommerce.project.json'
import saasProject from '../data/projects/saas.project.json'
import supportProject from '../data/projects/support.project.json'
import './ProjectExplorerPage.css'

const projects = [ecommerceProject, saasProject, supportProject] as ProjectDefinition[]

export default function ProjectExplorerPage() {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const project = projects.find((entry) => entry.id === projectId) ?? projects[0]

  const [modelName, setModelName] = useState(project?.models[0]?.name ?? '')

  useEffect(() => {
    const nextProject = projects.find((entry) => entry.id === projectId)
    setModelName(nextProject?.models[0]?.name ?? '')
  }, [projectId])

  const activeModel = project?.models.find((model) => model.name === modelName)

  const groupedModels = useMemo(() => groupModelsByLayer(project), [project])

  if (!project) {
    return <p>Project definitions are missing. Check src/data/projects.</p>
  }

  return (
    <div className="project-layout">
      <aside className="project-picker">
        <p className="eyebrow">Learning projects</p>
        {projects.map((entry) => (
          <button
            type="button"
            key={entry.id}
            onClick={() => setProjectId(entry.id)}
            className={entry.id === projectId ? 'project-picker__btn active' : 'project-picker__btn'}
          >
            <strong>{entry.title}</strong>
            <span>{entry.summary}</span>
          </button>
        ))}
      </aside>

      <section className="project-details">
        <header>
          <p className="eyebrow">{project.focus}</p>
          <h2>{project.title}</h2>
          <p className="project-summary">
            This is a fictional, frozen project. Nothing here runs dbt—it simply explains how layers relate.
          </p>
        </header>

        <div className="project-layers">
          {groupedModels.map((group) => (
            <div key={group.layer} className="project-layer">
              <h3>{group.layer}</h3>
              <ul>
                {group.models.map((model) => (
                  <li key={model.name}>
                    <button
                      type="button"
                      className={model.name === modelName ? 'model-chip active' : 'model-chip'}
                      onClick={() => setModelName(model.name)}
                    >
                      <strong>{model.name}</strong>
                      <span>{model.description}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {activeModel && (
          <SqlEditor
            label={`${activeModel.name} SQL`}
            value={activeModel.sql}
            readOnly
            helperText="Read-only context pulled from static JSON. This never introspects a real project."
          />
        )}
      </section>
    </div>
  )
}

function groupModelsByLayer(project: ProjectDefinition): { layer: string; models: ProjectModel[] }[] {
  return project.layers.map((layer) => ({
    layer,
    models: project.models.filter((model) => model.layer === layer),
  }))
}
