export type LineageNodeRole = 'upstream' | 'current' | 'downstream'

export type LineageNode = {
  id: string
  label: string
  role: LineageNodeRole
  materialization?: string
  variant?: 'model' | 'snapshot'
}

export type LineageEdge = {
  from: string
  to: string
}

export type LineageGraph = {
  nodes: LineageNode[]
  edges: LineageEdge[]
}

export type BuildPhase = {
  id: string
  label: string
  role: LineageNodeRole
}

const downstreamPlaceholders = ['Analytics notebooks', 'Self-serve dashboards']

export function buildLineageGraph(
  currentModel: string,
  upstreamRefs: string[],
  options?: { currentMaterialization?: string; currentVariant?: 'model' | 'snapshot' },
): LineageGraph {
  const uniqueRefs = Array.from(new Set(upstreamRefs))
  const upstreamNodes: LineageNode[] = uniqueRefs.length
    ? uniqueRefs.map((ref) => ({ id: `upstream-${ref}`, label: ref, role: 'upstream' }))
    : [{ id: 'upstream-source', label: 'Source data', role: 'upstream' }]

  const currentNode: LineageNode = {
    id: `current-${currentModel}`,
    label: currentModel,
    role: 'current',
    materialization: options?.currentMaterialization,
    variant: options?.currentVariant ?? 'model',
  }
  const downstreamNodes: LineageNode[] = downstreamPlaceholders.map((label, index) => ({
    id: `downstream-${index}`,
    label,
    role: 'downstream',
  }))

  const edges: LineageEdge[] = [
    ...upstreamNodes.map((node) => ({ from: node.id, to: currentNode.id })),
    ...downstreamNodes.map((node) => ({ from: currentNode.id, to: node.id })),
  ]

  return { nodes: [...upstreamNodes, currentNode, ...downstreamNodes], edges }
}

export function buildConceptualPhases(
  currentModel: string,
  upstreamRefs: string[],
  options?: { currentMaterialization?: string },
): BuildPhase[] {
  const upstreamPhases = (upstreamRefs.length ? upstreamRefs : ['Source data']).map((ref) => ({
    id: `phase-upstream-${ref}`,
    label: `Prepare ${ref}`,
    role: 'upstream' as const,
  }))

  const currentPhase: BuildPhase = {
    id: `phase-current-${currentModel}`,
    label: options?.currentMaterialization
      ? `Build ${currentModel} as a ${options.currentMaterialization}`
      : `Compile and build ${currentModel}`,
    role: 'current',
  }

  const downstreamPhases: BuildPhase[] = downstreamPlaceholders.map((name, index) => ({
    id: `phase-downstream-${index}`,
    label: `Share with ${name.toLowerCase()}`,
    role: 'downstream',
  }))

  return [...upstreamPhases, currentPhase, ...downstreamPhases]
}
