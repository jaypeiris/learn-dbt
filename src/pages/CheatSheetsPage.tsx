import { useState } from 'react'
import './CheatSheetsPage.css'

type CheatSheetId = 'layers' | 'grain' | 'materialization' | 'testing' | 'jinja' | 'commands' | 'naming' | 'incremental'

const CHEAT_SHEETS = [
  {
    id: 'layers' as CheatSheetId,
    title: 'Layering Cheat Sheet',
    subtitle: 'Staging → Intermediate → Marts',
    description: 'Quick reference for organizing models into the right layers',
    icon: '📚',
  },
  {
    id: 'grain' as CheatSheetId,
    title: 'Grain Checklist',
    subtitle: 'One row per ___?',
    description: 'How to declare, verify, and maintain model grain',
    icon: '🔍',
  },
  {
    id: 'materialization' as CheatSheetId,
    title: 'Materialization Decision Guide',
    subtitle: 'View, Table, or Incremental?',
    description: 'Choose the right materialization based on usage and size',
    icon: '⚙️',
  },
  {
    id: 'testing' as CheatSheetId,
    title: 'Testing Mental Models',
    subtitle: 'What to test and why',
    description: 'Testing strategies for data quality',
    icon: '✓',
  },
  {
    id: 'jinja' as CheatSheetId,
    title: 'Jinja & Macros',
    subtitle: 'Template your SQL with code',
    description: 'Common Jinja patterns and when to write macros',
    icon: '🔧',
  },
  {
    id: 'commands' as CheatSheetId,
    title: 'dbt Commands Reference',
    subtitle: 'CLI quick reference',
    description: 'Essential commands and flags for daily workflows',
    icon: '⌨️',
  },
  {
    id: 'naming' as CheatSheetId,
    title: 'Naming Conventions',
    subtitle: 'Consistency = clarity',
    description: 'Best practices for naming models, folders, and columns',
    icon: '📝',
  },
  {
    id: 'incremental' as CheatSheetId,
    title: 'Incremental Strategies',
    subtitle: 'Append, Merge, or Delete+Insert?',
    description: 'When and how to use incremental models',
    icon: '⚡',
  },
]

export default function CheatSheetsPage() {
  const [selectedSheet, setSelectedSheet] = useState<CheatSheetId | null>(null)

  if (selectedSheet) {
    return <CheatSheetDetail id={selectedSheet} onBack={() => setSelectedSheet(null)} />
  }

  return (
    <div className="cheat-sheets-page">
      <header className="cheat-sheets-header">
        <h1>dbt Core Cheat Sheets</h1>
        <p className="cheat-sheets-subtitle">
          Print-friendly reference guides. Click any guide to view, then use your browser's print function (⌘P
          / Ctrl+P) to save as PDF.
        </p>
      </header>

      <div className="cheat-sheets-grid">
        {CHEAT_SHEETS.map((sheet) => (
          <article key={sheet.id} className="cheat-sheet-card" onClick={() => setSelectedSheet(sheet.id)}>
            <span className="cheat-sheet-icon">{sheet.icon}</span>
            <h2>{sheet.title}</h2>
            <p className="cheat-sheet-subtitle">{sheet.subtitle}</p>
            <p className="cheat-sheet-description">{sheet.description}</p>
            <button type="button" className="cheat-sheet-button">
              View & Print
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

function CheatSheetDetail({ id, onBack }: { id: CheatSheetId; onBack: () => void }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="cheat-sheet-detail">
      <div className="cheat-sheet-controls no-print">
        <button type="button" onClick={onBack} className="control-button">
          ← Back to all sheets
        </button>
        <button type="button" onClick={handlePrint} className="control-button control-button--primary">
          🖨️ Print / Save PDF
        </button>
      </div>

      <div className="cheat-sheet-content">
        {id === 'layers' && <LayersSheet />}
        {id === 'grain' && <GrainSheet />}
        {id === 'materialization' && <MaterializationSheet />}
        {id === 'testing' && <TestingSheet />}
        {id === 'jinja' && <JinjaSheet />}
        {id === 'commands' && <CommandsSheet />}
        {id === 'naming' && <NamingSheet />}
        {id === 'incremental' && <IncrementalSheet />}
      </div>
    </div>
  )
}

function LayersSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Core Layering Cheat Sheet</h1>
        <p className="sheet-tagline">Staging → Intermediate → Marts</p>
      </header>

      <section className="sheet-section">
        <h2>The Three Layers</h2>
        <div className="layer-grid">
          <div className="layer-card layer-card--staging">
            <h3>Staging (stg_)</h3>
            <p className="layer-purpose"><strong>Purpose:</strong> Clean and rename raw data</p>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>✅ Select columns</li>
                <li>✅ Rename columns to readable names</li>
                <li>✅ Cast data types</li>
                <li>❌ NO joins</li>
                <li>❌ NO aggregations</li>
                <li>❌ NO business logic</li>
              </ul>
            </div>
            <div className="layer-example">
              <h4>Example</h4>
              <code>
                select<br />
                &nbsp;&nbsp;customer_id,<br />
                &nbsp;&nbsp;email_address as email,<br />
                &nbsp;&nbsp;created_at::timestamp as created_at<br />
                from raw.customers
              </code>
            </div>
          </div>

          <div className="layer-card layer-card--intermediate">
            <h3>Intermediate (int_)</h3>
            <p className="layer-purpose"><strong>Purpose:</strong> Reusable business logic</p>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>✅ Business logic (CASE, calculations)</li>
                <li>✅ Joins between staging models</li>
                <li>✅ Light aggregations</li>
                <li>✅ Extract from marts when reusable</li>
                <li>❌ Don't expose to end users</li>
              </ul>
            </div>
            <div className="layer-example">
              <h4>Example</h4>
              <code>
                select<br />
                &nbsp;&nbsp;customer_id,<br />
                &nbsp;&nbsp;sum(order_total) as lifetime_value,<br />
                &nbsp;&nbsp;case when lifetime_value &gt; 1000<br />
                &nbsp;&nbsp;&nbsp;&nbsp;then 'vip' else 'regular' end as segment<br />
                from stg_orders<br />
                group by customer_id
              </code>
            </div>
          </div>

          <div className="layer-card layer-card--mart">
            <h3>Marts (fct_, dim_)</h3>
            <p className="layer-purpose"><strong>Purpose:</strong> Business-facing models</p>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>✅ Join intermediate models</li>
                <li>✅ Final business metrics</li>
                <li>✅ End-user ready</li>
                <li>✅ Well documented</li>
                <li>✅ Tested thoroughly</li>
                <li>❌ Should be simple (complex logic belongs in intermediate)</li>
              </ul>
            </div>
            <div className="layer-example">
              <h4>Example</h4>
              <code>
                select<br />
                &nbsp;&nbsp;c.customer_id,<br />
                &nbsp;&nbsp;c.customer_name,<br />
                &nbsp;&nbsp;o.lifetime_value,<br />
                &nbsp;&nbsp;s.segment<br />
                from stg_customers as c<br />
                left join int_customer_orders as o using (customer_id)<br />
                left join int_customer_segments as s using (customer_id)
              </code>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Decision Flowchart</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>Is this selecting from raw data?</strong></p>
            <p>→ YES: Use <span className="highlight">staging</span></p>
            <p>→ NO: Continue ↓</p>
          </div>
          <div className="flowchart-step">
            <p><strong>Will other models need this logic?</strong></p>
            <p>→ YES: Use <span className="highlight">intermediate</span></p>
            <p>→ NO: Continue ↓</p>
          </div>
          <div className="flowchart-step">
            <p><strong>Is this for end-user consumption?</strong></p>
            <p>→ YES: Use <span className="highlight">mart</span></p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Common Mistakes</h2>
        <ul className="mistakes-list">
          <li>❌ Business logic in staging (e.g., segmentation, metrics)</li>
          <li>❌ Marts with complex CTEs (extract to intermediate)</li>
          <li>❌ Joining raw tables directly (use staging first)</li>
          <li>❌ Duplicating logic across marts (extract to intermediate)</li>
        </ul>
      </section>
    </div>
  )
}

function GrainSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Grain Checklist</h1>
        <p className="sheet-tagline">One row per ___?</p>
      </header>

      <section className="sheet-section">
        <h2>What is Grain?</h2>
        <p className="definition">
          <strong>Grain</strong> = What does one row in this model represent?
        </p>
        <p>
          Example: "one row per customer" means customer_id should be unique. "One row per order line item" means
          order_id is NOT unique (multiple lines per order).
        </p>
      </section>

      <section className="sheet-section">
        <h2>Declare Grain (Always!)</h2>
        <pre className="code-block"><code>{`-- Grain: one row per customer per day
-- Primary key: (customer_id, event_date)

select
  customer_id,
  event_date,
  sum(revenue) as daily_revenue
from events
group by 1, 2`}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Grain Checklist</h2>
        <table className="checklist-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Action</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Add grain comment at top of model</td>
              <td>Makes intent explicit for future developers</td>
            </tr>
            <tr>
              <td>2</td>
              <td>List the primary key columns</td>
              <td>Documents uniqueness assumption</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Add unique test on primary key</td>
              <td>Catches grain violations in data</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Add not_null tests on key columns</td>
              <td>Prevents orphaned/incomplete rows</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Common Grain Patterns</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>One row per entity</h4>
            <p>customer_id, product_id, order_id</p>
            <p className="pattern-key">Key: single column</p>
          </div>
          <div className="pattern-box">
            <h4>One row per entity per time</h4>
            <p>customer_id + date, product_id + month</p>
            <p className="pattern-key">Key: entity + time</p>
          </div>
          <div className="pattern-box">
            <h4>One row per relationship</h4>
            <p>customer_id + product_id, user_id + event_type</p>
            <p className="pattern-key">Key: multiple entities</p>
          </div>
          <div className="pattern-box">
            <h4>One row per event</h4>
            <p>event_id, transaction_id, log_id</p>
            <p className="pattern-key">Key: unique event ID</p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Fanout Warning Signs</h2>
        <ul className="mistakes-list">
          <li>❌ Row count explodes after a join</li>
          <li>❌ Revenue numbers are 10x too high</li>
          <li>❌ Joining many-to-many without aggregation first</li>
          <li>✅ <strong>Fix:</strong> Pre-aggregate to target grain before joining</li>
        </ul>
      </section>
    </div>
  )
}

function MaterializationSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Materialization Decision Guide</h1>
        <p className="sheet-tagline">View, Table, Incremental, or Ephemeral?</p>
      </header>

      <section className="sheet-section">
        <h2>Decision Matrix</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Materialization</th>
              <th>When to Use</th>
              <th>Pros</th>
              <th>Cons</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>View</strong></td>
              <td>
                • Fast-changing logic<br />
                • Lightweight transforms<br />
                • Rarely queried
              </td>
              <td>
                • Always fresh<br />
                • No storage cost<br />
                • Fast builds
              </td>
              <td>
                • Slow queries<br />
                • No indexing
              </td>
            </tr>
            <tr>
              <td><strong>Table</strong></td>
              <td>
                • Frequently queried<br />
                • Complex logic<br />
                • Moderate size (&lt;1B rows)
              </td>
              <td>
                • Fast queries<br />
                • Can index<br />
                • Predictable
              </td>
              <td>
                • Stale between runs<br />
                • Storage cost<br />
                • Slower builds
              </td>
            </tr>
            <tr>
              <td><strong>Incremental</strong></td>
              <td>
                • Large datasets (&gt;1B rows)<br />
                • Append-only events<br />
                • Slow full refreshes
              </td>
              <td>
                • Fast builds<br />
                • Handles scale<br />
                • Cost effective
              </td>
              <td>
                • Complex logic<br />
                • Hard to debug<br />
                • Needs unique key
              </td>
            </tr>
            <tr>
              <td><strong>Ephemeral</strong></td>
              <td>
                • Shared CTEs<br />
                • Never queried directly<br />
                • Simple logic
              </td>
              <td>
                • No table created<br />
                • DRY code
              </td>
              <td>
                • Invisible in warehouse<br />
                • Can't query directly
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Quick Decision Tree</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>Is this queried by end users/BI tools frequently?</strong></p>
            <p>→ YES: Use <span className="highlight">table</span> or <span className="highlight">incremental</span></p>
            <p>→ NO: Continue ↓</p>
          </div>
          <div className="flowchart-step">
            <p><strong>Is this &gt; 100M rows?</strong></p>
            <p>→ YES: Use <span className="highlight">incremental</span></p>
            <p>→ NO: Use <span className="highlight">view</span> (staging) or <span className="highlight">table</span> (marts)</p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Default Patterns</h2>
        <ul className="patterns-list">
          <li><strong>Staging:</strong> Always <code>view</code> (or ephemeral for simple renames)</li>
          <li><strong>Intermediate:</strong> <code>view</code> or <code>ephemeral</code></li>
          <li><strong>Marts:</strong> <code>table</code> (or incremental if huge)</li>
          <li><strong>Large event data:</strong> <code>incremental</code></li>
        </ul>
      </section>
    </div>
  )
}

function TestingSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Testing Mental Models</h1>
        <p className="sheet-tagline">What to test and why</p>
      </header>

      <section className="sheet-section">
        <h2>Test Every Model</h2>
        <table className="test-table">
          <thead>
            <tr>
              <th>Layer</th>
              <th>Always Test</th>
              <th>Sometimes Test</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Staging</strong></td>
              <td>
                • unique + not_null on PK<br />
                • relationships to source
              </td>
              <td>
                • accepted_values for enums<br />
                • data freshness
              </td>
            </tr>
            <tr>
              <td><strong>Intermediate</strong></td>
              <td>
                • unique + not_null on PK<br />
                • relationships to upstream
              </td>
              <td>
                • Business logic assertions<br />
                • Value ranges
              </td>
            </tr>
            <tr>
              <td><strong>Marts</strong></td>
              <td>
                • unique + not_null on PK<br />
                • relationships checks<br />
                • Business metric bounds
              </td>
              <td>
                • Custom SQL tests<br />
                • Cross-model consistency
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>The 4 Core Tests</h2>
        <div className="tests-grid">
          <div className="test-box">
            <h4>unique</h4>
            <p>Column has no duplicates</p>
            <code>tests: [unique]</code>
            <p className="test-use">Use on: Primary keys, natural keys</p>
          </div>
          <div className="test-box">
            <h4>not_null</h4>
            <p>Column has no NULL values</p>
            <code>tests: [not_null]</code>
            <p className="test-use">Use on: Primary keys, required fields</p>
          </div>
          <div className="test-box">
            <h4>accepted_values</h4>
            <p>Column only contains expected values</p>
            <code>values: ['active', 'inactive']</code>
            <p className="test-use">Use on: Status columns, categories</p>
          </div>
          <div className="test-box">
            <h4>relationships</h4>
            <p>Foreign key exists in parent table</p>
            <code>to: ref('customers')</code>
            <p className="test-use">Use on: Foreign keys</p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Testing Checklist</h2>
        <ul className="checklist-list">
          <li>☐ Every model has at least one test</li>
          <li>☐ Primary key has unique + not_null tests</li>
          <li>☐ Foreign keys have relationships tests</li>
          <li>☐ Critical business metrics have bounds checks</li>
          <li>☐ Enum columns have accepted_values tests</li>
          <li>☐ Tests run on every dbt run</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>When to Write Custom Tests</h2>
        <ul className="patterns-list">
          <li><strong>Cross-model consistency:</strong> Sum of parts equals total</li>
          <li><strong>Business rules:</strong> Revenue should never be negative</li>
          <li><strong>Temporal logic:</strong> end_date &gt; start_date</li>
          <li><strong>Completeness:</strong> Every order has at least one line item</li>
        </ul>
      </section>
    </div>
  )
}

function JinjaSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Jinja & Macros Cheat Sheet</h1>
        <p className="sheet-tagline">Template your SQL with code</p>
      </header>

      <section className="sheet-section">
        <h2>Core Jinja Syntax</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>Variables</h4>
            <p className="pattern-key"><code>{`{{ variable_name }}`}</code></p>
            <p>Output a value</p>
            <code>{`{{ target.schema }}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Statements</h4>
            <p className="pattern-key"><code>{`{% statement %}`}</code></p>
            <p>Control flow logic</p>
            <code>{`{% if ... %} {% endif %}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Comments</h4>
            <p className="pattern-key"><code>{`{# comment #}`}</code></p>
            <p>Hidden in output</p>
            <code>{`{# TODO: refactor #}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Filters</h4>
            <p className="pattern-key"><code>{`{{ value | filter }}`}</code></p>
            <p>Transform values</p>
            <code>{`{{ name | upper }}`}</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Common Patterns</h2>
        <pre className="code-block"><code>{`-- Conditional logic
{% if target.name == 'prod' %}
  from prod.raw_data
{% else %}
  from dev.raw_data
{% endif %}

-- Loops
{% for col in ['id', 'name', 'email'] %}
  {{ col }}{% if not loop.last %},{% endif %}
{% endfor %}

-- Set variables
{% set payment_methods = ['credit_card', 'paypal', 'wire'] %}

-- Dynamic column generation
{% for method in payment_methods %}
  sum(case when payment_method = '{{ method }}' then amount end) as {{ method }}_revenue
  {% if not loop.last %},{% endif %}
{% endfor %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>dbt Functions</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Function</th>
              <th>Purpose</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>ref()</code></td>
              <td>Reference another model</td>
              <td><code>{`{{ ref('stg_customers') }}`}</code></td>
            </tr>
            <tr>
              <td><code>source()</code></td>
              <td>Reference a raw table</td>
              <td><code>{`{{ source('raw', 'orders') }}`}</code></td>
            </tr>
            <tr>
              <td><code>config()</code></td>
              <td>Set model config in SQL</td>
              <td><code>{`{{ config(materialized='table') }}`}</code></td>
            </tr>
            <tr>
              <td><code>var()</code></td>
              <td>Use project variables</td>
              <td><code>{`{{ var('start_date') }}`}</code></td>
            </tr>
            <tr>
              <td><code>target</code></td>
              <td>Access environment info</td>
              <td><code>{`{{ target.schema }}`}</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>When to Write a Macro</h2>
        <ul className="checklist-list">
          <li>☐ Same logic used in 3+ models</li>
          <li>☐ Complex SQL that's hard to read inline</li>
          <li>☐ Conditional logic based on warehouse type</li>
          <li>☐ Dynamic column generation</li>
          <li>☐ Custom tests or operations</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Simple Macro Example</h2>
        <pre className="code-block"><code>{`-- macros/cents_to_dollars.sql
{% macro cents_to_dollars(column_name) %}
  round({{ column_name }} / 100.0, 2)
{% endmacro %}

-- models/mart_revenue.sql
select
  order_id,
  {{ cents_to_dollars('amount_cents') }} as amount_dollars
from {{ ref('stg_orders') }}`.trim()}</code></pre>
      </section>
    </div>
  )
}

function CommandsSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Commands Reference</h1>
        <p className="sheet-tagline">CLI quick reference</p>
      </header>

      <section className="sheet-section">
        <h2>Essential Commands</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>What It Does</th>
              <th>When to Use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>dbt run</code></td>
              <td>Build all models</td>
              <td>Deploy to production, refresh all data</td>
            </tr>
            <tr>
              <td><code>dbt test</code></td>
              <td>Run all tests</td>
              <td>Validate data quality after runs</td>
            </tr>
            <tr>
              <td><code>dbt build</code></td>
              <td>Run + test in dependency order</td>
              <td>Best for CI/CD pipelines</td>
            </tr>
            <tr>
              <td><code>dbt compile</code></td>
              <td>Generate SQL without running</td>
              <td>Debug queries, see compiled SQL</td>
            </tr>
            <tr>
              <td><code>dbt docs generate</code></td>
              <td>Build documentation site</td>
              <td>Create searchable docs for team</td>
            </tr>
            <tr>
              <td><code>dbt docs serve</code></td>
              <td>Host docs locally</td>
              <td>View lineage graph, explore models</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Selection Syntax</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Example</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>--select</code></td>
              <td><code>dbt run --select customers</code></td>
              <td>Run only the customers model</td>
            </tr>
            <tr>
              <td><code>+</code></td>
              <td><code>dbt run --select +customers</code></td>
              <td>Run customers and all upstream</td>
            </tr>
            <tr>
              <td><code>+</code></td>
              <td><code>dbt run --select customers+</code></td>
              <td>Run customers and all downstream</td>
            </tr>
            <tr>
              <td><code>tag:</code></td>
              <td><code>dbt run --select tag:nightly</code></td>
              <td>Run all models tagged "nightly"</td>
            </tr>
            <tr>
              <td><code>path:</code></td>
              <td><code>dbt run --select path:marts/</code></td>
              <td>Run all models in marts folder</td>
            </tr>
            <tr>
              <td><code>state:</code></td>
              <td><code>dbt run --select state:modified+</code></td>
              <td>Run modified models + downstream (CI)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Useful Flags</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>--full-refresh</h4>
            <p>Rebuild incremental models from scratch</p>
            <code>dbt run --select my_incremental --full-refresh</code>
          </div>
          <div className="pattern-box">
            <h4>--exclude</h4>
            <p>Skip specific models</p>
            <code>dbt run --exclude tag:deprecated</code>
          </div>
          <div className="pattern-box">
            <h4>--vars</h4>
            <p>Pass runtime variables</p>
            <code>{`dbt run --vars '{"start_date": "2024-01-01"}'`}</code>
          </div>
          <div className="pattern-box">
            <h4>--target</h4>
            <p>Use specific environment</p>
            <code>dbt run --target prod</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Daily Workflow</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>1. Start working on a model</strong></p>
            <p><code>dbt run --select my_model</code> — Build just this model</p>
          </div>
          <div className="flowchart-step">
            <p><strong>2. Check downstream impact</strong></p>
            <p><code>dbt run --select my_model+</code> — Build this + downstream</p>
          </div>
          <div className="flowchart-step">
            <p><strong>3. Validate quality</strong></p>
            <p><code>dbt test --select my_model+</code> — Test this + downstream</p>
          </div>
          <div className="flowchart-step">
            <p><strong>4. Before committing</strong></p>
            <p><code>dbt build --select state:modified+</code> — Build + test changed models</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function NamingSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Naming Conventions</h1>
        <p className="sheet-tagline">Consistency = clarity</p>
      </header>

      <section className="sheet-section">
        <h2>Model Naming Patterns</h2>
        <div className="layer-grid">
          <div className="layer-card layer-card--staging">
            <h3>Staging</h3>
            <p className="layer-purpose">Prefix: <code>stg_</code></p>
            <div className="layer-example">
              <h4>Examples</h4>
              <code>
                stg_customers<br />
                stg_orders<br />
                stg_stripe__payments
              </code>
            </div>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>One model per source table</li>
                <li>Source system in name if multiple</li>
                <li>Use double underscore for source: <code>stg_stripe__charges</code></li>
              </ul>
            </div>
          </div>

          <div className="layer-card layer-card--intermediate">
            <h3>Intermediate</h3>
            <p className="layer-purpose">Prefix: <code>int_</code></p>
            <div className="layer-example">
              <h4>Examples</h4>
              <code>
                int_customer_orders<br />
                int_order_payments<br />
                int_revenue_by_product
              </code>
            </div>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>Describe what it joins/aggregates</li>
                <li>Verb-noun pattern: <code>int_customer_enrichment</code></li>
                <li>Never queried by BI tools</li>
              </ul>
            </div>
          </div>

          <div className="layer-card layer-card--mart">
            <h3>Marts</h3>
            <p className="layer-purpose">Prefix: <code>mart_</code> or <code>fct_</code>/<code>dim_</code></p>
            <div className="layer-example">
              <h4>Examples</h4>
              <code>
                fct_orders<br />
                dim_customers<br />
                mart_sales_dashboard
              </code>
            </div>
            <div className="layer-rules">
              <h4>Rules</h4>
              <ul>
                <li>Business-friendly names</li>
                <li>fct_ for facts, dim_ for dimensions</li>
                <li>Or describe use case: <code>mart_executive_summary</code></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Folder Structure</h2>
        <pre className="code-block">
          <code>{`models/
├── staging/
│   ├── stripe/
│   │   ├── _stripe__sources.yml
│   │   ├── stg_stripe__customers.sql
│   │   └── stg_stripe__charges.sql
│   └── salesforce/
│       ├── _salesforce__sources.yml
│       └── stg_salesforce__accounts.sql
├── intermediate/
│   ├── finance/
│   │   └── int_payment_aggregations.sql
│   └── marketing/
│       └── int_customer_segments.sql
└── marts/
    ├── finance/
    │   ├── fct_revenue.sql
    │   └── dim_products.sql
    └── marketing/
        └── mart_customer_360.sql`}</code>
        </pre>
      </section>

      <section className="sheet-section">
        <h2>Column Naming</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Example</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>snake_case</td>
              <td><code>customer_id</code></td>
              <td>Standard SQL convention</td>
            </tr>
            <tr>
              <td>Suffix IDs with _id</td>
              <td><code>order_id</code>, <code>customer_id</code></td>
              <td>Instantly recognizable as keys</td>
            </tr>
            <tr>
              <td>Suffix booleans with _flag or is_</td>
              <td><code>is_active</code>, <code>is_deleted_flag</code></td>
              <td>Clearly boolean type</td>
            </tr>
            <tr>
              <td>Suffix timestamps with _at</td>
              <td><code>created_at</code>, <code>updated_at</code></td>
              <td>Indicates datetime column</td>
            </tr>
            <tr>
              <td>Suffix dates with _date</td>
              <td><code>order_date</code>, <code>birth_date</code></td>
              <td>Distinguishes from timestamps</td>
            </tr>
            <tr>
              <td>Prefix calculated fields</td>
              <td><code>total_revenue</code>, <code>avg_order_value</code></td>
              <td>Shows it's derived, not raw</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Naming Anti-Patterns</h2>
        <ul className="mistakes-list">
          <li>❌ <code>final_customers</code> — "final" is meaningless, use mart_ prefix</li>
          <li>❌ <code>customers_v2</code> — Version numbers mean old code wasn't deleted</li>
          <li>❌ <code>temp_orders</code> — Temporary models should be ephemeral or deleted</li>
          <li>❌ <code>new_revenue_model</code> — "new" becomes stale immediately</li>
          <li>❌ <code>customerID</code> — Mixing cases creates confusion</li>
          <li>❌ <code>rpt_sales</code> — "rpt" is ambiguous, use mart_ or fct_</li>
        </ul>
      </section>
    </div>
  )
}

function IncrementalSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Incremental Strategies</h1>
        <p className="sheet-tagline">Append, Merge, or Delete+Insert?</p>
      </header>

      <section className="sheet-section">
        <h2>When to Use Incremental</h2>
        <div className="definition">
          Use incremental models when full table rebuilds are too slow or expensive. Typically for datasets &gt; 100M rows or builds taking &gt; 5 minutes.
        </div>
        <ul className="checklist-list">
          <li>✓ Event logs (clickstream, application logs)</li>
          <li>✓ Time-series data (sensor readings, metrics)</li>
          <li>✓ Large fact tables (orders, transactions)</li>
          <li>✓ Append-only datasets (immutable events)</li>
          <li>✗ Small dimension tables (&lt; 1M rows)</li>
          <li>✗ Frequently updated records (use table instead)</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Three Strategies</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Strategy</th>
              <th>How It Works</th>
              <th>Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>append</strong></td>
              <td>Add new rows only, never update existing</td>
              <td>Immutable event logs, clickstream data</td>
            </tr>
            <tr>
              <td><strong>merge</strong></td>
              <td>Insert new rows, update changed rows based on unique_key</td>
              <td>Slowly changing dimensions, order updates</td>
            </tr>
            <tr>
              <td><strong>delete+insert</strong></td>
              <td>Delete partition, then insert fresh data</td>
              <td>Daily snapshots, partitioned by date</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Append Strategy</h2>
        <pre className="code-block"><code>{`{{
  config(
    materialized='incremental',
    unique_key='event_id',
    incremental_strategy='append'
  )
}}

select
  event_id,
  user_id,
  event_type,
  occurred_at
from {{ source('analytics', 'raw_events') }}

{% if is_incremental() %}
  -- Only process events since last run
  where occurred_at > (select max(occurred_at) from {{ this }})
{% endif %}`.trim()}</code></pre>
        <p><strong>Use when:</strong> Records never update after creation (event logs, immutable facts)</p>
      </section>

      <section className="sheet-section">
        <h2>Merge Strategy</h2>
        <pre className="code-block"><code>{`{{
  config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge'
  )
}}

select
  order_id,
  customer_id,
  status,
  total_amount,
  updated_at
from {{ source('ecommerce', 'orders') }}

{% if is_incremental() %}
  -- Get new and updated orders
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}`.trim()}</code></pre>
        <p><strong>Use when:</strong> Records can be updated (orders changing status, customer profiles)</p>
      </section>

      <section className="sheet-section">
        <h2>Delete+Insert Strategy</h2>
        <pre className="code-block"><code>{`{{
  config(
    materialized='incremental',
    unique_key='order_date',
    incremental_strategy='delete+insert',
    partition_by={
      "field": "order_date",
      "data_type": "date"
    }
  )
}}

select
  order_date,
  count(*) as order_count,
  sum(amount) as total_revenue
from {{ ref('fct_orders') }}

{% if is_incremental() %}
  where order_date >= date_sub(current_date(), interval 7 day)
{% endif %}

group by order_date`.trim()}</code></pre>
        <p><strong>Use when:</strong> Daily/hourly aggregations where you want to reprocess recent partitions</p>
      </section>

      <section className="sheet-section">
        <h2>Common Pitfalls</h2>
        <ul className="mistakes-list">
          <li>❌ No <code>unique_key</code> with merge strategy (causes duplicates)</li>
          <li>❌ Using <code>created_at</code> filter when records update (misses updates)</li>
          <li>❌ Not testing with <code>--full-refresh</code> (incremental logic broken)</li>
          <li>❌ Forgetting <code>{`{% if is_incremental() %}`}</code> check (processes all data every run)</li>
          <li>❌ Complex joins in incremental models (use intermediate models instead)</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Testing Incrementals</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>1. Test full refresh</strong></p>
            <p><code>dbt run --select my_incremental --full-refresh</code></p>
          </div>
          <div className="flowchart-step">
            <p><strong>2. Run incremental</strong></p>
            <p><code>dbt run --select my_incremental</code></p>
          </div>
          <div className="flowchart-step">
            <p><strong>3. Compare results</strong></p>
            <p>Row counts should match (or be close for recent data)</p>
          </div>
          <div className="flowchart-step">
            <p><strong>4. Test with data changes</strong></p>
            <p>Update source records and verify they propagate correctly</p>
          </div>
        </div>
      </section>
    </div>
  )
}
