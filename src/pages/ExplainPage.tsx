import { useMemo, useState } from 'react'
import SqlEditor from '../components/editor/SqlEditor'
import LineageGraph from '../components/lineage/LineageGraph'
import { parseSqlModel } from '../lib/sqlParser'
import { buildLineageGraph } from '../lib/lineageBuilder'
import './ExplainPage.css'

const EXAMPLE_SQL = `{{ config(materialized='table') }}

-- Example: Customer order summary
select
  c.customer_id,
  c.customer_name,
  count(o.order_id) as order_count,
  sum(o.order_total) as lifetime_value
from {{ ref('stg_customers') }} as c
left join {{ ref('stg_orders') }} as o
  on c.customer_id = o.customer_id
where c.status = 'active'
group by 1, 2`

export default function ExplainPage() {
  const [sql, setSql] = useState(EXAMPLE_SQL)
  const parsed = useMemo(() => parseSqlModel(sql), [sql])
  const graph = useMemo(
    () =>
      buildLineageGraph('this_model', parsed.refs, {
        currentMaterialization: parsed.materialization,
      }),
    [parsed.refs, parsed.materialization],
  )

  const suggestedLayer = useMemo(() => {
    const lowerSql = sql.toLowerCase()
    const refCount = parsed.refs.length
    const hasSource = lowerSql.includes('source(') || lowerSql.includes('from raw')
    const hasGroupBy = lowerSql.includes('group by')
    const hasAggFn = /count\(|sum\(|avg\(|min\(|max\(/i.test(sql)
    const hasCase = lowerSql.includes('case')
    const hasJoins = lowerSql.includes(' join ')
    const selectStar = /select\s+\*\s+from/i.test(lowerSql)
    const hasMartRefNames = parsed.refs.some((ref) => ref.startsWith('fct_') || ref.startsWith('dim_') || ref.startsWith('mart_'))
    const hasStagingRefs = parsed.refs.some((ref) => ref.startsWith('stg_'))
    const hasMultipleRefs = refCount >= 2

    // Mart indicators (prioritise aggregations and multi-ref joins)
    if ((hasGroupBy || hasAggFn) && (hasMultipleRefs || hasMartRefNames)) {
      return {
        layer: 'mart',
        confidence: 'high',
        reason: 'Joins multiple models and aggregates data—classic mart pattern.',
      }
    }

    if ((hasMartRefNames || (hasMultipleRefs && hasJoins && (hasAggFn || hasGroupBy))) && !hasSource) {
      return {
        layer: 'mart',
        confidence: 'medium',
        reason: 'Combines several models with joins; likely a business-facing table.',
      }
    }

    // Intermediate indicators
    if (hasStagingRefs && (hasCase || hasJoins)) {
      return {
        layer: 'intermediate',
        confidence: 'medium',
        reason: 'Contains business logic (CASE statements) operating on staging models',
      }
    }

    // Joins between sources/refs without agg look like intermediate assembly
    if (hasSource && hasJoins) {
      return {
        layer: 'intermediate',
        confidence: 'medium',
        reason: 'Joins multiple sources; not just a pass-through staging model.',
      }
    }

    // Staging indicators (only when light transforms and not multi-ref)
    if (hasSource && !hasGroupBy && !hasAggFn && refCount <= 1) {
      return {
        layer: 'staging',
        confidence: 'medium',
        reason: 'Selects from source/RAW with light transformations.',
      }
    }

    if (selectStar && hasSource) {
      return {
        layer: 'staging',
        confidence: 'medium',
        reason: 'Uses source() with a pass-through select * pattern.',
      }
    }

    // Default
    return {
      layer: 'intermediate',
      confidence: 'low',
      reason: 'Not enough context to determine layer confidently',
    }
  }, [sql, parsed.refs])

  const explanation = useMemo(() => {
    if (parsed.refs.length === 0 && !sql.includes('source(')) {
      return 'This appears to be querying raw tables directly (no ref() or source()). Consider using ref() to create dependencies.'
    }

    if (parsed.refs.length === 1 && !sql.includes('join')) {
      return 'This model depends on a single upstream model without joins. It might be applying transformations or filtering.'
    }

    if (parsed.refs.length >= 2) {
      return `This model joins ${parsed.refs.length} upstream models (${parsed.refs.join(', ')}). It's likely combining data from multiple sources.`
    }

    return 'Paste your dbt model SQL above to get analysis.'
  }, [parsed.refs, sql])

  const detectedPatterns = useMemo(() => {
    const patterns: Array<{ type: string; description: string; severity: 'info' | 'warning' | 'good' }> = []

    // Check for refs
    if (parsed.refs.length > 0) {
      patterns.push({
        type: 'Dependencies',
        description: `Found ${parsed.refs.length} ref() call(s): ${parsed.refs.join(', ')}`,
        severity: 'good',
      })
    }

    // Check for materialization
    if (parsed.materialization && parsed.materialization !== 'view') {
      patterns.push({
        type: 'Materialization',
        description: `Configured as '${parsed.materialization}'`,
        severity: 'info',
      })
    }

    // Check for aggregations
    if (sql.toLowerCase().includes('group by')) {
      patterns.push({
        type: 'Aggregation',
        description: 'Contains GROUP BY - aggregating data to a coarser grain',
        severity: 'info',
      })
    }

    // Check for CTEs
    const cteMatches = sql.match(/with\s+\w+\s+as\s*\(/gi)
    if (cteMatches && cteMatches.length > 0) {
      patterns.push({
        type: 'CTEs',
        description: `Found ${cteMatches.length} CTE(s) - intermediate calculations`,
        severity: 'info',
      })
    }

    // Check for hardcoded tables (warning)
    const hardcodedMatch = sql.match(/from\s+[\w_]+\.[\w_]+(?!\()/gi)
    if (hardcodedMatch && !sql.includes('ref(') && !sql.includes('source(')) {
      patterns.push({
        type: 'Hardcoded Tables',
        description: 'Found direct table references - consider using ref() or source()',
        severity: 'warning',
      })
    }

    // Check for business logic
    if (sql.toLowerCase().includes('case when')) {
      patterns.push({
        type: 'Business Logic',
        description: 'Contains CASE statements - applying business rules',
        severity: 'info',
      })
    }

    return patterns
  }, [sql, parsed])

  return (
    <div className="explain-page">
      <header className="explain-header">
        <h1>Explain This Model</h1>
        <p className="explain-subtitle">
          Paste any dbt model SQL to analyze its dependencies, structure, and suggested layer placement.
        </p>
      </header>

      <div className="explain-layout">
        <div className="explain-input">
          <SqlEditor
            label="Paste your dbt model SQL"
            value={sql}
            onChange={setSql}
            helperText="Include {{ config(...) }}, {{ ref(...) }}, and {{ source(...) }} calls for best analysis"
          />
        </div>

      <div className="explain-analysis">
        <section className="analysis-section">
          <h2>Quick Summary</h2>
          <p className="analysis-warning">This explanation is conceptual, not authoritative.</p>
          <p className="analysis-summary">{explanation}</p>
        </section>

          {detectedPatterns.length > 0 && (
            <section className="analysis-section">
              <h2>Detected Patterns</h2>
              <ul className="pattern-list">
                {detectedPatterns.map((pattern, index) => (
                  <li key={index} className={`pattern-item pattern-item--${pattern.severity}`}>
                    <span className="pattern-type">{pattern.type}</span>
                    <span className="pattern-description">{pattern.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="analysis-section">
            <h2>Suggested Layer</h2>
            <div className={`layer-suggestion layer-suggestion--${suggestedLayer.confidence}`}>
              <div className="layer-suggestion__header">
                <span className="layer-badge">{suggestedLayer.layer}</span>
                <span className="confidence-badge">
                  {suggestedLayer.confidence} confidence
                </span>
              </div>
              <p className="layer-suggestion__reason">{suggestedLayer.reason}</p>
            </div>
          </section>

          {parsed.refs.length > 0 && (
            <section className="analysis-section">
              <h2>Dependency Graph</h2>
              <p className="analysis-hint">Conceptual visualization of this model's dependencies</p>
              <div className="explain-graph">
                <LineageGraph graph={graph} />
              </div>
            </section>
          )}

          <section className="analysis-section">
            <h2>Next Steps</h2>
            <ul className="next-steps">
              <li>
                <strong>Check the grain:</strong> What does one row represent? Add a comment declaring it.
              </li>
              <li>
                <strong>Verify layer:</strong> Does the suggested layer match your intent?
              </li>
              <li>
                <strong>Add tests:</strong> Based on the grain, what should be unique/not null?
              </li>
              {parsed.refs.length === 0 && (
                <li>
                  <strong>Add ref() calls:</strong> Replace direct table references with ref() or source()
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
