import { useMemo, useState } from 'react'
import type { ManifestDocument, ManifestNode } from '../../../types/manifest'
import manifestData from '../../data/manifests/ecommerce.manifest.json'
import { buildLineageGraph } from '../../lib/lineageBuilder'
import LineageGraph from '../lineage/LineageGraph'
import './ManifestExplorer.css'

const manifest = manifestData as ManifestDocument

export default function ManifestExplorer() {
  const [selectedNodeId, setSelectedNodeId] = useState(manifest.nodes[0]?.uniqueId ?? '')
  const selectedNode = manifest.nodes.find((node) => node.uniqueId === selectedNodeId) ?? manifest.nodes[0]

  const upstreamNames = selectedNode?.dependsOn.map((dependency) => findNodeName(dependency, manifest.nodes)).filter(Boolean) as string[]

  const graph = useMemo(
    () =>
      buildLineageGraph(selectedNode?.name ?? 'node', upstreamNames, {
        currentMaterialization: selectedNode?.materialization,
        currentVariant: selectedNode?.resourceType === 'snapshot' ? 'snapshot' : 'model',
      }),
    [selectedNode?.name, selectedNode?.materialization, upstreamNames, selectedNode?.resourceType],
  )

  if (!selectedNode) {
    return (
      <div className="manifest-explorer">
        <p>This example manifest is temporarily unavailable.</p>
      </div>
    )
  }

  const nodeTypeDescription = describeNodeType(selectedNode)

  return (
    <section className="manifest-explorer">
      <header>
        <p className="eyebrow">Example manifest</p>
        <h3>How dbt represents this project internally</h3>
        <p>This read-only view uses the bundled manifest to show nodes, dependencies, and metadata.</p>
      </header>
      <div className="manifest-explorer__layout">
        {/* Future enhancement: Add filtering by resource type (model, snapshot, test, exposure)
            to help learners focus on specific node types in advanced modules. */}
        <aside>
          <h4>Nodes</h4>
          <ul>
            {manifest.nodes.map((node) => (
              <li key={node.uniqueId}>
                <button
                  type="button"
                  className={node.uniqueId === selectedNodeId ? 'manifest-node active' : 'manifest-node'}
                  onClick={() => setSelectedNodeId(node.uniqueId)}
                >
                  <strong>{node.name}</strong>
                  <span>{node.resourceType}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="manifest-explorer__details">
          <div className="manifest-meta-card">
            <div>
              <span className="manifest-meta-card__badge">{selectedNode.resourceType}</span>
              <h4>{selectedNode.name}</h4>
              <p>{selectedNode.description || nodeTypeDescription}</p>
            </div>
            <dl>
              <div>
                <dt>Materialization</dt>
                <dd>{selectedNode.materialization ?? 'n/a'}</dd>
              </div>
              <div>
                <dt>Depends on</dt>
                <dd>{selectedNode.dependsOn.length ? upstreamNames.join(', ') : 'none'}</dd>
              </div>
              <div>
                <dt>Tags</dt>
                <dd>{selectedNode.tags.length ? selectedNode.tags.join(', ') : 'none'}</dd>
              </div>
            </dl>
          </div>
          <LineageGraph graph={graph} />
        </div>
      </div>
    </section>
  )
}

function findNodeName(uniqueId: string, nodes: ManifestNode[]): string | undefined {
  const match = nodes.find((node) => node.uniqueId === uniqueId)
  if (match) return match.name
  const segments = uniqueId.split('.')
  return segments[segments.length - 1]
}

function describeNodeType(node: ManifestNode): string {
  switch (node.resourceType) {
    case 'model':
      return 'Defines data for downstream use.'
    case 'snapshot':
      return 'Records how a record changed over time.'
    case 'test':
      return 'Asserts expectations about data.'
    case 'exposure':
      return 'Connects models to downstream usage.'
    default:
      return 'Part of the internal project graph.'
  }
}
