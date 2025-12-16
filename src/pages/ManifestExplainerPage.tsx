import { useMemo, useState } from 'react'
import type { ManifestDocument, ManifestNode } from '../../types/manifest'
import manifestData from '../data/manifests/ecommerce.manifest.json'
import LineageGraph from '../components/lineage/LineageGraph'
import { buildLineageGraph } from '../lib/lineageBuilder'
import './ManifestExplainerPage.css'

const manifest = manifestData as ManifestDocument

export default function ManifestExplainerPage() {
  const [nodeId, setNodeId] = useState(manifest.nodes[0]?.uniqueId ?? '')
  const node = manifest.nodes.find((entry) => entry.uniqueId === nodeId) ?? manifest.nodes[0]

  const upstreamNames = node?.dependsOn
    .map((dependency) => findNodeName(dependency, manifest.nodes))
    .filter(Boolean) as string[]

  const graph = useMemo(
    () => buildLineageGraph(node?.name ?? 'model', upstreamNames, { currentMaterialization: node?.materialization }),
    [node?.name, upstreamNames, node?.materialization],
  )

  if (!node) {
    return <p>Example manifest missing.</p>
  }

  return (
    <div className="manifest-page">
      <section className="manifest-hero">
        <p className="eyebrow">Manifest explainer</p>
        <h2>What is the manifest.json file?</h2>
        <p>
          dbt writes a manifest after compiling SQL. It lists every model, its resources, and dependency graph. This page
          uses a fictional manifest to show how dbt understands lineage internally. It never introspects your real
          project.
        </p>
        <dl>
          <div>
            <dt>Project name</dt>
            <dd>{manifest.metadata.projectName}</dd>
          </div>
          <div>
            <dt>Generated at</dt>
            <dd>{manifest.metadata.generatedAt}</dd>
          </div>
          <div>
            <dt>Adapter</dt>
            <dd>{manifest.metadata.adapterType}</dd>
          </div>
        </dl>
      </section>

      <div className="manifest-grid">
        <aside>
          <h3>Nodes in this manifest</h3>
          <ul>
            {manifest.nodes.map((entry) => (
              <li key={entry.uniqueId}>
                <button
                  type="button"
                  className={entry.uniqueId === node.uniqueId ? 'manifest-node active' : 'manifest-node'}
                  onClick={() => setNodeId(entry.uniqueId)}
                >
                  <strong>{entry.name}</strong>
                  <span>{entry.description}</span>
                  <span className="tag">{entry.materialization}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="manifest-graph">
          <h3>How dbt sees {node.name}</h3>
          <p>dbt would build this model after the dependencies below are ready.</p>
          <LineageGraph graph={graph} />
          <div className="manifest-notes">
            <div>
              <h4>Why stored in manifest?</h4>
              <p>
                dbt Cloud and the CLI both compile SQL. The manifest records the compiled graph so future commands can
                reuse it without parsing raw SQL every time.
              </p>
            </div>
            <div>
              <h4>How it links back</h4>
              <p>
                Each dependency shown here originated from a ref() call. You can see the same relationships visualised in
                the Lessons tab.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function findNodeName(uniqueId: string, nodes: ManifestNode[]): string | undefined {
  const match = nodes.find((node) => node.uniqueId === uniqueId)
  if (match) return match.name
  const segments = uniqueId.split('.')
  return segments[segments.length - 1]
}
