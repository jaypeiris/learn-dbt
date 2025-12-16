export type ProjectModel = {
  name: string
  layer: 'staging' | 'intermediate' | 'mart'
  description: string
  sql: string
  dependsOn: string[]
}

export type ProjectDefinition = {
  id: string
  title: string
  summary: string
  focus: string
  layers: string[]
  models: ProjectModel[]
}
