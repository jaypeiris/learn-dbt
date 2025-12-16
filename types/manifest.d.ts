export interface ManifestNode {
  uniqueId: string
  name: string
  resourceType: string
  description: string
  dependsOn: string[]
  tags: string[]
  materialization: string
}

export interface ManifestMetadata {
  projectName: string
  generatedAt: string
  adapterType: string
}

export interface ManifestDocument {
  metadata: ManifestMetadata
  nodes: ManifestNode[]
}
