export type ManifestMetadata = {
  projectName: string
  generatedAt: string
  adapterType: string
}

export type ManifestNode = {
  uniqueId: string
  name: string
  resourceType: 'model' | 'source' | 'snapshot' | 'test' | 'exposure'
  description: string
  dependsOn: string[]
  tags: string[]
  materialization?: 'view' | 'table' | 'incremental' | 'ephemeral'
}

export type ManifestDocument = {
  metadata: ManifestMetadata
  nodes: ManifestNode[]
}
