export interface ProjectModel {
  name: string
  layer: string
  description: string
  sql: string
  dependsOn: string[]
}

export interface ProjectDefinition {
  id: string
  title: string
  summary: string
  focus: string
  layers: string[]
  models: ProjectModel[]
}
