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
        <p className="eyebrow">Reference Guide</p>
        <h2>Understanding the dbt Manifest</h2>
        <p>
          The <code>manifest.json</code> file is dbt's compiled representation of your entire project. Generated during{' '}
          <code>dbt compile</code> or <code>dbt run</code>, it maps every model, test, source, and their dependencies into
          a directed acyclic graph (DAG). This page uses a sample manifest to demonstrate how dbt tracks lineage and
          build order.
        </p>
        <div className="manifest-info-grid">
          <div className="info-card">
            <h3>Where to find it</h3>
            <p><code>target/manifest.json</code> in your dbt project</p>
          </div>
          <div className="info-card">
            <h3>When it's created</h3>
            <p>Every <code>dbt compile</code>, <code>dbt run</code>, or <code>dbt build</code></p>
          </div>
          <div className="info-card">
            <h3>What it contains</h3>
            <p>All nodes (models, tests, sources), their SQL, configs, and dependencies</p>
          </div>
          <div className="info-card">
            <h3>Why it matters</h3>
            <p>Powers dbt docs, state-based selection, and build orchestration</p>
          </div>
        </div>
        <dl>
          <div>
            <dt>Sample project</dt>
            <dd>{manifest.metadata.projectName}</dd>
          </div>
          <div>
            <dt>Generated</dt>
            <dd>{manifest.metadata.generatedAt}</dd>
          </div>
          <div>
            <dt>Database adapter</dt>
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
              <h4>How dependencies are tracked</h4>
              <p>
                Every <code>ref('model_name')</code> in your SQL creates an entry in the <code>dependsOn</code> array. dbt uses this to
                determine build order. Models with no dependencies run first; downstream models wait for their upstream refs to complete.
              </p>
            </div>
            <div>
              <h4>State-based selection</h4>
              <p>
                Commands like <code>dbt run --select state:modified+</code> compare the current manifest to a previous one
                (from prod) to detect changes. Only modified models and their downstream dependencies get rebuilt—saving time in CI/CD.
              </p>
            </div>
            <div>
              <h4>Powers dbt docs</h4>
              <p>
                <code>dbt docs generate</code> reads the manifest to create the documentation site. The interactive lineage graph,
                model descriptions, and column-level metadata all come from manifest.json. Run <code>dbt docs serve</code> to explore it locally.
              </p>
            </div>
            <div>
              <h4>What's in each node</h4>
              <p>
                Every node contains: <code>uniqueId</code> (identifier), <code>name</code>, <code>compiled_sql</code> (after Jinja rendering),{' '}
                <code>dependsOn</code> (refs), <code>config</code> (materialization, tags), and <code>columns</code> (schema). This makes the
                manifest a complete snapshot of your project at compile time.
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
