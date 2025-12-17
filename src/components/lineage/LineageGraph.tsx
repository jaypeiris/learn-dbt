import type { LineageGraph as LineageGraphData, LineageNode } from '../../lib/lineageBuilder'
import './LineageGraph.css'

type LineageGraphProps = {
  graph: LineageGraphData
}

type PositionedNode = LineageNode & { x: number; y: number }

const SVG_WIDTH = 900
const ROW_SPACING = 180
const TOP_PADDING = 60

export default function LineageGraph({ graph }: LineageGraphProps) {
  const positioned = positionNodes(graph.nodes)
  const rowsUsed = Math.max(...positioned.map((node) => node.y / ROW_SPACING))
  const height = ROW_SPACING * (rowsUsed + 1) + TOP_PADDING

  return (
    <div className="lineage-graph">
      <svg viewBox={`0 0 ${SVG_WIDTH} ${height}`} width="100%" height={height} role="img" className="lineage-graph__svg">
        <defs>
          <marker
            id="arrow-head"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,10 L10,5 z" fill="#9aa7b6" />
          </marker>
        </defs>
        {graph.edges.map((edge) => {
          const from = positioned.find((node) => node.id === edge.from)
          const to = positioned.find((node) => node.id === edge.to)
          if (!from || !to) return null
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="lineage-graph__edge"
              markerEnd="url(#arrow-head)"
            />
          )
        })}
        {positioned.map((node) => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              className={`lineage-graph__node ${node.role}${node.variant ? ` ${node.variant}` : ''}`}
              rx="12"
              ry="12"
              width="220"
              height="90"
              x="-110"
              y="-45"
            />
            <text className="lineage-graph__label" textAnchor="middle" dominantBaseline="middle" y={node.materialization ? -6 : 0}>
              {node.label}
            </text>
            {node.materialization && (
              <text className="lineage-graph__sublabel" textAnchor="middle" dominantBaseline="middle" y={14}>
                {node.materialization}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="lineage-graph__legend">
        <span className="legend-item">
          <span className="dot upstream" />
          <span>Upstream refs</span>
        </span>
        <span className="legend-item">
          <span className="dot current" />
          <span>Current model</span>
        </span>
        <span className="legend-item">
          <span className="dot downstream" />
          <span>Downstream consumers</span>
        </span>
      </div>
    </div>
  )
}

function positionNodes(nodes: LineageNode[]): PositionedNode[] {
  const upstream = nodes.filter((node) => node.role === 'upstream')
  const current = nodes.filter((node) => node.role === 'current')
  const downstream = nodes.filter((node) => node.role === 'downstream')

  const placeGroup = (group: LineageNode[], rowIndex: number): PositionedNode[] => {
    const count = Math.max(group.length, 1)
    const gap = SVG_WIDTH / (count + 1)
    return group.map((node, index) => ({
      ...node,
      x: gap * (index + 1),
      y: ROW_SPACING * rowIndex + TOP_PADDING,
    }))
  }

  // Separate rows to avoid overlap: upstream on row 0, current on row 1, downstream on row 2
  return [...placeGroup(upstream, 0), ...placeGroup(current, 1), ...placeGroup(downstream, 2)]
}
