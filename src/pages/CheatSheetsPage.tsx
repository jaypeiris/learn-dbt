import { useState } from 'react'
import './CheatSheetsPage.css'

type CheatSheetId = 'layers' | 'grain' | 'materialization' | 'testing' | 'jinja' | 'commands' | 'github' | 'naming' | 'incremental' | 'sources-seeds' | 'packages' | 'hooks' | 'snapshots'

const CHEAT_SHEETS = [
  {
    id: 'github' as CheatSheetId,
    title: 'Git & GitHub Commands',
    subtitle: 'Branch, commit, PR',
    description: 'A practical workflow cheat sheet for day-to-day work',
    icon: 'git',
  },
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
  {
    id: 'sources-seeds' as CheatSheetId,
    title: 'Sources & Seeds',
    subtitle: 'Connect to raw data',
    description: 'How to define sources, check freshness, and load CSV seeds',
    icon: '🌱',
  },
  {
    id: 'packages' as CheatSheetId,
    title: 'dbt Packages',
    subtitle: 'Essential packages',
    description: 'Popular packages and how to install them',
    icon: '📦',
  },
  {
    id: 'hooks' as CheatSheetId,
    title: 'Hooks & Operations',
    subtitle: 'Run SQL before/after',
    description: 'Use hooks and operations to run custom SQL',
    icon: '🪝',
  },
  {
    id: 'snapshots' as CheatSheetId,
    title: 'Snapshots (SCD Type 2)',
    subtitle: 'Track historical changes',
    description: 'Capture slowly changing dimensions over time',
    icon: '📸',
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
        {id === 'github' && <GitHubSheet />}
        {id === 'naming' && <NamingSheet />}
        {id === 'incremental' && <IncrementalSheet />}
        {id === 'sources-seeds' && <SourcesSeedsSheet />}
        {id === 'packages' && <PackagesSheet />}
        {id === 'hooks' && <HooksSheet />}
        {id === 'snapshots' && <SnapshotsSheet />}
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
        <p className="sheet-tagline">Complete guide to templating in dbt</p>
      </header>

      <section className="sheet-section">
        <h2>Core Jinja Syntax</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>Expressions</h4>
            <p className="pattern-key"><code>{`{{ ... }}`}</code></p>
            <p>Display values and call functions</p>
            <code>{`{{ ref('customers') }}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Statements</h4>
            <p className="pattern-key"><code>{`{% ... %}`}</code></p>
            <p>Control flow (if, for, set)</p>
            <code>{`{% if condition %} ... {% endif %}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Comments</h4>
            <p className="pattern-key"><code>{`{# ... #}`}</code></p>
            <p>Hidden notes in code</p>
            <code>{`{# TODO: optimize this #}`}</code>
          </div>
          <div className="pattern-box">
            <h4>Whitespace Control</h4>
            <p className="pattern-key"><code>{`{%- ... -%}`}</code></p>
            <p>Strip whitespace before/after</p>
            <code>{`{%- if condition -%}`}</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Variable Assignment</h2>
        <pre className="code-block"><code>{`-- String
{% set my_string = "example" %}

-- List
{% set payment_methods = ['card', 'paypal', 'wire'] %}

-- Dictionary
{% set config_map = {"dev": "dev_schema", "prod": "prod_schema"} %}

-- From query result
{% set query_result = run_query("select max(order_date) from orders") %}
{% set max_date = query_result.columns[0].values()[0] %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Conditional Logic</h2>
        <pre className="code-block"><code>{`-- Basic if/else
{% if target.name == 'prod' %}
  from analytics_prod.orders
{% elif target.name == 'dev' %}
  from analytics_dev.orders
{% else %}
  from analytics_ci.orders
{% endif %}

-- Logical operators: and, or, not
{% if is_incremental() and target.name == 'prod' %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}

-- Comparison: ==, !=, >, <, >=, <=
{% if var('start_date', none) is not none %}
  where order_date >= '{{ var('start_date') }}'
{% endif %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Loops</h2>
        <pre className="code-block"><code>{`-- Loop over list
{% set columns = ['id', 'name', 'email', 'created_at'] %}
select
  {% for col in columns %}
    {{ col }}{% if not loop.last %},{% endif %}
  {% endfor %}
from customers

-- Loop with index
{% for method in ['card', 'paypal', 'wire'] %}
  sum(case when payment_method = '{{ method }}'
      then amount end) as {{ method }}_revenue
  {% if not loop.last %},{% endif %}
{% endfor %}

-- Loop over dictionary
{% set schemas = {"staging": "stg", "marts": "mrt"} %}
{% for key, value in schemas.items() %}
  {{ key }}: {{ value }}
{% endfor %}

-- Loop properties
loop.first    -- Boolean: True on first iteration
loop.last     -- Boolean: True on final iteration
loop.index    -- Integer: 1-indexed iteration count
loop.index0   -- Integer: 0-indexed iteration count`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Jinja Filters</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Filter</th>
              <th>Example</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>lower</code></td>
              <td><code>{`{{ "TEXT" | lower }}`}</code></td>
              <td>"text"</td>
            </tr>
            <tr>
              <td><code>upper</code></td>
              <td><code>{`{{ "text" | upper }}`}</code></td>
              <td>"TEXT"</td>
            </tr>
            <tr>
              <td><code>capitalize</code></td>
              <td><code>{`{{ "hello world" | capitalize }}`}</code></td>
              <td>"Hello world"</td>
            </tr>
            <tr>
              <td><code>trim</code></td>
              <td><code>{`{{ "  text  " | trim }}`}</code></td>
              <td>"text"</td>
            </tr>
            <tr>
              <td><code>replace</code></td>
              <td><code>{`{{ "hello" | replace("h", "j") }}`}</code></td>
              <td>"jello"</td>
            </tr>
            <tr>
              <td><code>length</code></td>
              <td><code>{`{{ "hello" | length }}`}</code></td>
              <td>5</td>
            </tr>
            <tr>
              <td><code>default</code></td>
              <td><code>{`{{ var('key', '') | default('fallback') }}`}</code></td>
              <td>Returns default if undefined/empty</td>
            </tr>
            <tr>
              <td><code>int</code></td>
              <td><code>{`{{ "42" | int }}`}</code></td>
              <td>42</td>
            </tr>
            <tr>
              <td><code>float</code></td>
              <td><code>{`{{ "3.14" | float }}`}</code></td>
              <td>3.14</td>
            </tr>
            <tr>
              <td><code>round</code></td>
              <td><code>{`{{ 3.14159 | round(2) }}`}</code></td>
              <td>3.14</td>
            </tr>
            <tr>
              <td><code>round(method='floor')</code></td>
              <td><code>{`{{ 3.9 | round(method='floor') }}`}</code></td>
              <td>3</td>
            </tr>
            <tr>
              <td><code>round(method='ceil')</code></td>
              <td><code>{`{{ 3.1 | round(method='ceil') }}`}</code></td>
              <td>4</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>String Operations</h2>
        <pre className="code-block"><code>{`-- Slicing
{{ "database"[0:4] }}  -- "data"

-- Splitting
{% set parts = "first,second,third".split(',') %}
-- Results in: ['first', 'second', 'third']

-- Concatenation
{{ "Hello " ~ "World" }}  -- "Hello World"

-- Repetition
{{ "-" * 20 }}  -- "--------------------"

-- Join list into string
{% set columns = ['id', 'name', 'email'] %}
{{ columns | join(', ') }}  -- "id, name, email"`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Variable Tests</h2>
        <pre className="code-block"><code>{`-- Check if defined
{% if my_var is defined %}
  {{ my_var }}
{% endif %}

-- Check if none/null
{% if my_var is none %}
  -- Handle null case
{% endif %}

-- Type checks
{% if my_var is string %}
  '{{ my_var }}'
{% elif my_var is number %}
  {{ my_var }}
{% endif %}

-- Numeric tests
{% if count is even %}
  -- Even number
{% elif count is odd %}
  -- Odd number
{% endif %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>dbt Built-in Functions</h2>
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
              <td>Reference dbt model</td>
              <td><code>{`{{ ref('stg_customers') }}`}</code></td>
            </tr>
            <tr>
              <td><code>source()</code></td>
              <td>Reference raw source table</td>
              <td><code>{`{{ source('stripe', 'charges') }}`}</code></td>
            </tr>
            <tr>
              <td><code>config()</code></td>
              <td>Set model configuration</td>
              <td><code>{`{{ config(materialized='table') }}`}</code></td>
            </tr>
            <tr>
              <td><code>var()</code></td>
              <td>Access project variables</td>
              <td><code>{`{{ var('start_date', '2024-01-01') }}`}</code></td>
            </tr>
            <tr>
              <td><code>env_var()</code></td>
              <td>Access environment variables</td>
              <td><code>{`{{ env_var('DBT_DATABASE') }}`}</code></td>
            </tr>
            <tr>
              <td><code>target</code></td>
              <td>Current environment info</td>
              <td><code>{`{{ target.schema }}`}</code></td>
            </tr>
            <tr>
              <td><code>this</code></td>
              <td>Current model's relation</td>
              <td><code>{`select max(date) from {{ this }}`}</code></td>
            </tr>
            <tr>
              <td><code>is_incremental()</code></td>
              <td>Check if running incrementally</td>
              <td><code>{`{% if is_incremental() %}`}</code></td>
            </tr>
            <tr>
              <td><code>run_query()</code></td>
              <td>Execute query, return results</td>
              <td><code>{`{% set result = run_query(sql) %}`}</code></td>
            </tr>
            <tr>
              <td><code>execute</code></td>
              <td>True during execution phase</td>
              <td><code>{`{% if execute %}`}</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Target Context Variables</h2>
        <pre className="code-block"><code>{`{{ target.name }}       -- Target name (dev, prod)
{{ target.schema }}     -- Target schema
{{ target.type }}       -- Warehouse type (snowflake, bigquery, etc)
{{ target.database }}   -- Database name
{{ target.threads }}    -- Number of threads
{{ target.profile_name }}  -- Profile name from profiles.yml`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Writing Macros</h2>
        <pre className="code-block"><code>{`-- macros/date_spine.sql
{% macro date_spine(start_date, end_date) %}
  with date_spine as (
    {{ dbt_utils.date_spine(
        datepart="day",
        start_date="'" ~ start_date ~ "'",
        end_date="'" ~ end_date ~ "'"
    ) }}
  )
  select * from date_spine
{% endmacro %}

-- Using the macro
{{ date_spine('2024-01-01', '2024-12-31') }}

-- Macro with default arguments
{% macro cents_to_dollars(column_name, precision=2) %}
  round({{ column_name }} / 100.0, {{ precision }})
{% endmacro %}

-- Call with: {{ cents_to_dollars('amount_cents', 3) }}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Generic Tests (Macros in tests/generic/)</h2>
        <pre className="code-block"><code>{`-- tests/generic/test_column_value_greater_than.sql
{% test column_value_greater_than(model, column_name, threshold) %}
  select {{ column_name }}
  from {{ model }}
  where {{ column_name }} <= {{ threshold }}
{% endtest %}

-- Usage in schema.yml
models:
  - name: orders
    columns:
      - name: total_amount
        tests:
          - column_value_greater_than:
              threshold: 0`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>When to Write Macros</h2>
        <ul className="checklist-list">
          <li>☐ Logic used in 3+ models (DRY principle)</li>
          <li>☐ Complex SQL that's hard to read inline</li>
          <li>☐ Warehouse-specific logic (use target.type)</li>
          <li>☐ Dynamic column/table generation</li>
          <li>☐ Custom generic tests</li>
          <li>☐ Operations/maintenance scripts</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Common Patterns</h2>
        <pre className="code-block"><code>{`-- Dynamic pivoting
{% set payment_methods = ['card', 'paypal', 'wire', 'ach'] %}
select
  customer_id,
  {% for method in payment_methods %}
    sum(case when payment_method = '{{ method }}'
        then amount else 0 end) as {{ method }}_total
    {%- if not loop.last %},{% endif %}
  {% endfor %}
from payments
group by customer_id

-- Environment-based logic
{% if target.name == 'prod' %}
  {% set schema_suffix = '' %}
{% else %}
  {% set schema_suffix = '_' ~ target.name %}
{% endif %}

-- Generate union of similar tables
{% set tables = ['events_2023', 'events_2024', 'events_2025'] %}
{% for table in tables %}
  select *, '{{ table }}' as source_table
  from {{ source('raw', table) }}
  {% if not loop.last %} union all {% endif %}
{% endfor %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Debugging Tips</h2>
        <ul className="patterns-list">
          <li><strong>View compiled SQL:</strong> <code>dbt compile -s model_name</code> then check target/compiled/</li>
          <li><strong>Log values:</strong> <code>{`{{ log('Debug: ' ~ my_variable, info=true) }}`}</code></li>
          <li><strong>Check variable type:</strong> <code>{`{{ my_var | string }}`}</code> to cast for inspection</li>
          <li><strong>Use dbt compile:</strong> Generates SQL without execution for validation</li>
        </ul>
      </section>
    </div>
  )
}

function CommandsSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Commands Reference</h1>
        <p className="sheet-tagline">Comprehensive CLI guide</p>
      </header>

      <section className="sheet-section">
        <h2>Core Development Commands</h2>
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
              <td>Execute models (creates tables/views)</td>
              <td>Build data transformations</td>
            </tr>
            <tr>
              <td><code>dbt test</code></td>
              <td>Execute data tests</td>
              <td>Validate data quality</td>
            </tr>
            <tr>
              <td><code>dbt build</code></td>
              <td>Run + test in DAG order</td>
              <td>Production deployments, CI/CD</td>
            </tr>
            <tr>
              <td><code>dbt compile</code></td>
              <td>Generate SQL without execution</td>
              <td>Debug, review compiled queries</td>
            </tr>
            <tr>
              <td><code>dbt seed</code></td>
              <td>Load CSV files into warehouse</td>
              <td>Load reference data, mappings</td>
            </tr>
            <tr>
              <td><code>dbt snapshot</code></td>
              <td>Capture SCD Type 2 changes</td>
              <td>Track historical dimension changes</td>
            </tr>
            <tr>
              <td><code>dbt source freshness</code></td>
              <td>Check if sources are up-to-date</td>
              <td>Monitor data pipeline health</td>
            </tr>
            <tr>
              <td><code>dbt retry</code></td>
              <td>Re-run from point of failure</td>
              <td>After fixing errors mid-run</td>
            </tr>
            <tr>
              <td><code>dbt show</code></td>
              <td>Preview query results in terminal</td>
              <td>Quick data inspection</td>
            </tr>
            <tr>
              <td><code>dbt run-operation</code></td>
              <td>Execute macro from CLI</td>
              <td>Run maintenance scripts, operations</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Documentation Commands</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>dbt docs generate</h4>
            <p>Build documentation site with lineage graph</p>
            <code>dbt docs generate</code>
          </div>
          <div className="pattern-box">
            <h4>dbt docs serve</h4>
            <p>Host docs locally (default: localhost:8080)</p>
            <code>dbt docs serve --port 8001</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Project Management Commands</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Command</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>dbt init</code></td>
              <td>Initialize new dbt project</td>
            </tr>
            <tr>
              <td><code>dbt debug</code></td>
              <td>Validate setup and database connection</td>
            </tr>
            <tr>
              <td><code>dbt deps</code></td>
              <td>Install packages from packages.yml</td>
            </tr>
            <tr>
              <td><code>dbt clean</code></td>
              <td>Delete target/ and dbt_packages/ folders</td>
            </tr>
            <tr>
              <td><code>dbt parse</code></td>
              <td>Parse project and output timing info</td>
            </tr>
            <tr>
              <td><code>dbt ls / list</code></td>
              <td>List resources in project (models, tests, sources)</td>
            </tr>
            <tr>
              <td><code>dbt clone</code></td>
              <td>Clone nodes to target database</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Node Selection Methods</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Selector</th>
              <th>Syntax</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>By name</td>
              <td><code>model_name</code></td>
              <td><code>dbt run -s customers</code></td>
            </tr>
            <tr>
              <td>By tag</td>
              <td><code>tag:tag_name</code></td>
              <td><code>dbt run -s tag:nightly</code></td>
            </tr>
            <tr>
              <td>By path</td>
              <td><code>path:folder/</code></td>
              <td><code>dbt run -s path:marts/finance/</code></td>
            </tr>
            <tr>
              <td>By source</td>
              <td><code>source:source_name</code></td>
              <td><code>dbt run -s source:salesforce+</code></td>
            </tr>
            <tr>
              <td>By config</td>
              <td><code>config.key:value</code></td>
              <td><code>dbt run -s config.materialized:table</code></td>
            </tr>
            <tr>
              <td>By test type</td>
              <td><code>test_type:generic</code></td>
              <td><code>dbt test -s test_type:singular</code></td>
            </tr>
            <tr>
              <td>By state</td>
              <td><code>state:modified</code></td>
              <td><code>dbt build -s state:modified+</code></td>
            </tr>
            <tr>
              <td>By package</td>
              <td><code>package:pkg_name</code></td>
              <td><code>dbt run -s package:dbt_utils</code></td>
            </tr>
            <tr>
              <td>By result</td>
              <td><code>result:error</code></td>
              <td><code>dbt retry -s result:error</code></td>
            </tr>
            <tr>
              <td>By exposure</td>
              <td><code>exposure:exp_name</code></td>
              <td><code>dbt run -s +exposure:weekly_dashboard</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Graph Operators</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Syntax</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Upstream</td>
              <td><code>+model</code></td>
              <td>Select model + all parents</td>
            </tr>
            <tr>
              <td>Downstream</td>
              <td><code>model+</code></td>
              <td>Select model + all children</td>
            </tr>
            <tr>
              <td>Both</td>
              <td><code>+model+</code></td>
              <td>Select model + parents + children</td>
            </tr>
            <tr>
              <td>N-degree</td>
              <td><code>2+model</code></td>
              <td>Select model + 2 levels of parents</td>
            </tr>
            <tr>
              <td>N-degree down</td>
              <td><code>model+3</code></td>
              <td>Select model + 3 levels of children</td>
            </tr>
            <tr>
              <td>Intersection</td>
              <td><code>@model</code></td>
              <td>Select model + parents of children</td>
            </tr>
            <tr>
              <td>Wildcard</td>
              <td><code>marts.*</code></td>
              <td>All models in marts folder</td>
            </tr>
            <tr>
              <td>Union (space)</td>
              <td><code>model1 model2</code></td>
              <td>Select both models</td>
            </tr>
            <tr>
              <td>Union (comma)</td>
              <td><code>tag:daily,tag:nightly</code></td>
              <td>Models with either tag</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Essential Flags</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>--select / -s</h4>
            <p>Specify which nodes to run</p>
            <code>dbt run -s +customers</code>
          </div>
          <div className="pattern-box">
            <h4>--exclude</h4>
            <p>Exclude specific nodes</p>
            <code>dbt run --exclude tag:deprecated</code>
          </div>
          <div className="pattern-box">
            <h4>--full-refresh</h4>
            <p>Rebuild incremental models completely</p>
            <code>dbt run --full-refresh</code>
          </div>
          <div className="pattern-box">
            <h4>--vars</h4>
            <p>Pass variables at runtime</p>
            <code>{`dbt run --vars '{"key": "value"}'`}</code>
          </div>
          <div className="pattern-box">
            <h4>--target / -t</h4>
            <p>Specify target environment</p>
            <code>dbt run --target prod</code>
          </div>
          <div className="pattern-box">
            <h4>--fail-fast / -x</h4>
            <p>Stop on first error</p>
            <code>dbt test -x</code>
          </div>
          <div className="pattern-box">
            <h4>--defer</h4>
            <p>Use prod artifacts for unbuilt refs</p>
            <code>dbt run -s state:modified+ --defer</code>
          </div>
          <div className="pattern-box">
            <h4>--state</h4>
            <p>Path to prior manifest.json</p>
            <code>dbt run -s state:modified --state ./prod</code>
          </div>
          <div className="pattern-box">
            <h4>--debug</h4>
            <p>Show detailed debug logging</p>
            <code>dbt run --debug</code>
          </div>
          <div className="pattern-box">
            <h4>--warn-error</h4>
            <p>Treat warnings as errors</p>
            <code>dbt build --warn-error</code>
          </div>
          <div className="pattern-box">
            <h4>--no-version-check</h4>
            <p>Skip dbt version check</p>
            <code>dbt run --no-version-check</code>
          </div>
          <div className="pattern-box">
            <h4>--threads</h4>
            <p>Number of concurrent threads</p>
            <code>dbt run --threads 8</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Logging Flags</h2>
        <ul className="patterns-list">
          <li><code>--log-format</code>: text | json | debug | default</li>
          <li><code>--log-level</code>: debug | info | warn | error | none</li>
          <li><code>--quiet / -q</code>: Suppress non-error output</li>
          <li><code>--no-use-colors</code>: Disable colored output</li>
          <li><code>--record-timing-info</code>: Save performance profile</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Daily Development Workflow</h2>
        <pre className="code-block"><code>{`# 1. Work on a single model
dbt run -s my_model

# 2. Test your model
dbt test -s my_model

# 3. Check downstream impact
dbt build -s my_model+

# 4. Before committing (CI flow)
dbt build -s state:modified+ --defer --state ./prod-artifacts

# 5. Full refresh a specific incremental
dbt run -s my_incremental_model --full-refresh

# 6. Run all models in a folder
dbt run -s path:marts/finance/

# 7. Run models with specific tag
dbt run -s tag:daily

# 8. Preview query results
dbt show -s my_model --limit 10

# 9. Check source freshness
dbt source freshness`}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Production Deployment Pattern</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>1. Install dependencies</strong></p>
            <p><code>dbt deps</code></p>
          </div>
          <div className="flowchart-step">
            <p><strong>2. Check source freshness</strong></p>
            <p><code>dbt source freshness</code></p>
          </div>
          <div className="flowchart-step">
            <p><strong>3. Build everything</strong></p>
            <p><code>dbt build --target prod</code></p>
          </div>
          <div className="flowchart-step">
            <p><strong>4. Generate docs</strong></p>
            <p><code>dbt docs generate --target prod</code></p>
          </div>
        </div>
      </section>
    </div>
  )
}

function GitHubSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Git &amp; GitHub Commands</h1>
        <p className="sheet-tagline">Branch, commit, PR — confidently</p>
      </header>

      <section className="sheet-section">
        <h2>Everyday Workflow</h2>
        <pre className="code-block"><code>{`# 1) Get latest
git switch main
git pull

# 2) Make a branch
git switch -c feat/my-change

# 3) Work + save
git status
git add -A
git commit -m "Explain what changed"

# 4) Publish + open PR
git push -u origin feat/my-change`}</code></pre>
        <ul className="checklist-list">
          <li>Keep commits small and descriptive.</li>
          <li>Push early so your work is backed up and visible.</li>
          <li>Prefer <code>git revert</code> over rewriting history on shared branches.</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Inspect What Changed</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>Status</h4>
            <p>What’s staged vs unstaged?</p>
            <code>git status</code>
          </div>
          <div className="pattern-box">
            <h4>Diff</h4>
            <p>See edits (unstaged / staged)</p>
            <code>git diff</code>
            <code>git diff --staged</code>
          </div>
          <div className="pattern-box">
            <h4>Log</h4>
            <p>Readable history</p>
            <code>git log --oneline --decorate --graph --all</code>
          </div>
          <div className="pattern-box">
            <h4>Show</h4>
            <p>Inspect a commit</p>
            <code>git show &lt;sha&gt;</code>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Undo (Safely)</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Command</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Unstage a file</td>
              <td><code>git restore --staged path/to/file</code></td>
              <td>Keeps your working copy changes.</td>
            </tr>
            <tr>
              <td>Discard local edits</td>
              <td><code>git restore path/to/file</code></td>
              <td>Throws away changes.</td>
            </tr>
            <tr>
              <td>Edit last commit message</td>
              <td><code>git commit --amend</code></td>
              <td>Avoid amending after pushing (unless you force-push intentionally).</td>
            </tr>
            <tr>
              <td>Undo a pushed commit</td>
              <td><code>git revert &lt;sha&gt;</code></td>
              <td>Creates a new commit that reverses the change (safe for shared branches).</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Branching &amp; Sync</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Command</th>
              <th>Tip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Create + switch branch</td>
              <td><code>git switch -c feat/name</code></td>
              <td>Use short, meaningful names.</td>
            </tr>
            <tr>
              <td>Update from main (merge)</td>
              <td><code>git fetch</code><br /><code>git merge origin/main</code></td>
              <td>Simple and safe.</td>
            </tr>
            <tr>
              <td>Update from main (rebase)</td>
              <td><code>git fetch</code><br /><code>git rebase origin/main</code></td>
              <td>Clean history; resolve conflicts carefully.</td>
            </tr>
            <tr>
              <td>Delete branch (local)</td>
              <td><code>git branch -d feat/name</code></td>
              <td>Use <code>-D</code> only if needed.</td>
            </tr>
            <tr>
              <td>Delete branch (remote)</td>
              <td><code>git push origin --delete feat/name</code></td>
              <td>Clean up after merge.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Stash (Pause Work)</h2>
        <pre className="code-block"><code>{`# Save away uncommitted changes
git stash push -m "WIP: description"

# See stashes
git stash list

# Re-apply the latest stash (keeps it)
git stash apply

# Apply and remove the latest stash
git stash pop`}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>First-Time Setup (New Machine)</h2>
        <pre className="code-block"><code>{`# Identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Helpful defaults
git config --global init.defaultBranch main
git config --global pull.rebase false`}</code></pre>
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

function SourcesSeedsSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Sources & Seeds</h1>
        <p className="sheet-tagline">Connect to raw data</p>
      </header>

      <section className="sheet-section">
        <h2>What Are Sources?</h2>
        <p className="definition">
          <strong>Sources</strong> define raw tables in your data warehouse that dbt should know about.
          They enable testing, documentation, and freshness checks on upstream data.
        </p>
      </section>

      <section className="sheet-section">
        <h2>Defining Sources</h2>
        <pre className="code-block"><code>{`-- models/staging/_sources.yml
version: 2

sources:
  - name: stripe
    database: raw
    schema: stripe_data
    tables:
      - name: customers
        description: Raw customer data from Stripe
        columns:
          - name: id
            description: Unique customer identifier
            tests:
              - unique
              - not_null
          - name: email
            tests:
              - not_null

      - name: charges
        description: Payment charges from Stripe
        freshness:
          warn_after: {count: 12, period: hour}
          error_after: {count: 24, period: hour}
        loaded_at_field: created_at`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Using Sources in Models</h2>
        <pre className="code-block"><code>{`-- models/staging/stg_customers.sql
select
  id as customer_id,
  email,
  created_at
from {{ source('stripe', 'customers') }}

-- Benefits:
-- ✓ dbt knows dependencies
-- ✓ Shows in lineage graph
-- ✓ Can test source data
-- ✓ Can check freshness`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Source Freshness Checks</h2>
        <pre className="code-block"><code>{`# Check all sources
dbt source freshness

# Check specific source
dbt source freshness --select source:stripe

# Output shows:
# PASS: loaded within warn threshold
# WARN: older than warn_after
# ERROR: older than error_after`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Source Properties</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Purpose</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>database</code></td>
              <td>Database name (if different from target)</td>
              <td><code>raw_data</code></td>
            </tr>
            <tr>
              <td><code>schema</code></td>
              <td>Schema containing tables</td>
              <td><code>stripe_production</code></td>
            </tr>
            <tr>
              <td><code>loaded_at_field</code></td>
              <td>Timestamp column for freshness</td>
              <td><code>updated_at</code></td>
            </tr>
            <tr>
              <td><code>freshness</code></td>
              <td>Define warn/error thresholds</td>
              <td><code>warn_after: 12 hours</code></td>
            </tr>
            <tr>
              <td><code>quoting</code></td>
              <td>Control identifier quoting</td>
              <td><code>database: true</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>What Are Seeds?</h2>
        <p className="definition">
          <strong>Seeds</strong> are CSV files in your repository that dbt loads into your warehouse as tables.
          Use for small reference/mapping data, not large datasets.
        </p>
      </section>

      <section className="sheet-section">
        <h2>Creating Seeds</h2>
        <pre className="code-block"><code>{`# File: seeds/country_codes.csv
country_code,country_name,region
US,United States,North America
GB,United Kingdom,Europe
JP,Japan,Asia

# File: seeds/payment_method_mapping.csv
raw_method,standardized_method
cc,credit_card
card,credit_card
paypal,paypal
pp,paypal`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Loading Seeds</h2>
        <pre className="code-block"><code>{`# Load all seeds
dbt seed

# Load specific seed
dbt seed --select country_codes

# Full refresh (rebuild)
dbt seed --full-refresh

# Seeds are loaded into: <target_schema>.<seed_name>`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Using Seeds in Models</h2>
        <pre className="code-block"><code>{`-- Reference with ref(), just like models
select
  o.order_id,
  o.country_code,
  c.country_name,
  c.region
from {{ ref('orders') }} as o
left join {{ ref('country_codes') }} as c
  on o.country_code = c.country_code`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Configuring Seeds</h2>
        <pre className="code-block"><code>{`-- dbt_project.yml
seeds:
  my_project:
    # Apply to all seeds
    +schema: seed_data

    # Specific seed configs
    country_codes:
      +column_types:
        country_code: varchar(2)
        country_name: varchar(100)

-- Or in seeds/properties.yml
version: 2

seeds:
  - name: country_codes
    description: ISO country codes and names
    config:
      column_types:
        country_code: varchar(2)
    columns:
      - name: country_code
        tests:
          - unique
          - not_null`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Seeds vs Sources: When to Use</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Use Seeds For</th>
              <th>Use Sources For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Small reference data (&lt; 1MB)</td>
              <td>Large production tables</td>
            </tr>
            <tr>
              <td>Mapping tables (state codes, categories)</td>
              <td>Transactional data</td>
            </tr>
            <tr>
              <td>Data managed in version control</td>
              <td>Data loaded by external systems</td>
            </tr>
            <tr>
              <td>Test fixtures for development</td>
              <td>Production data pipelines</td>
            </tr>
            <tr>
              <td>Rarely changing data</td>
              <td>Frequently updated data</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Best Practices</h2>
        <ul className="patterns-list">
          <li><strong>Sources:</strong> Always define sources for raw data you reference</li>
          <li><strong>Freshness:</strong> Set thresholds based on SLAs, not just guesses</li>
          <li><strong>Seeds:</strong> Keep CSVs small (&lt; 1MB), use sources for larger data</li>
          <li><strong>Testing:</strong> Add unique/not_null tests to source primary keys</li>
          <li><strong>Documentation:</strong> Document both sources and seeds with descriptions</li>
          <li><strong>Organization:</strong> Group sources by system (stripe, salesforce, etc.)</li>
        </ul>
      </section>
    </div>
  )
}

function PackagesSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>dbt Packages</h1>
        <p className="sheet-tagline">Essential packages & how to use them</p>
      </header>

      <section className="sheet-section">
        <h2>What Are Packages?</h2>
        <p className="definition">
          <strong>Packages</strong> are reusable dbt code libraries that provide macros, models, and tests
          you can use across projects. They're like npm packages but for dbt.
        </p>
      </section>

      <section className="sheet-section">
        <h2>Installing Packages</h2>
        <pre className="code-block"><code>{`# 1. Create packages.yml in project root
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

  - package: calogica/dbt_expectations
    version: 0.10.3

  - package: dbt-labs/codegen
    version: 0.12.1

# 2. Install packages
dbt deps

# Packages are installed to: dbt_packages/`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Essential Packages</h2>
        <div className="patterns-grid">
          <div className="pattern-box">
            <h4>dbt_utils</h4>
            <p>Most popular package with 100+ utility macros</p>
            <code>dbt-labs/dbt_utils</code>
            <p className="pattern-key">Macros for dates, SQL generation, testing</p>
          </div>
          <div className="pattern-box">
            <h4>dbt_expectations</h4>
            <p>Great Expectations-inspired tests</p>
            <code>calogica/dbt_expectations</code>
            <p className="pattern-key">Advanced data quality tests</p>
          </div>
          <div className="pattern-box">
            <h4>codegen</h4>
            <p>Generate dbt YAML and SQL boilerplate</p>
            <code>dbt-labs/codegen</code>
            <p className="pattern-key">Automate documentation scaffolding</p>
          </div>
          <div className="pattern-box">
            <h4>dbt_date</h4>
            <p>Date dimension and calendar utilities</p>
            <code>calogica/dbt_date</code>
            <p className="pattern-key">Fiscal calendars, date spines</p>
          </div>
          <div className="pattern-box">
            <h4>audit_helper</h4>
            <p>Compare datasets during refactoring</p>
            <code>dbt-labs/audit_helper</code>
            <p className="pattern-key">Validate migration accuracy</p>
          </div>
          <div className="pattern-box">
            <h4>dbt_artifacts</h4>
            <p>Save run artifacts to warehouse</p>
            <code>brooklyn-data/dbt_artifacts</code>
            <p className="pattern-key">Track model run history</p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>dbt_utils: Common Macros</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Macro</th>
              <th>Purpose</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>surrogate_key()</code></td>
              <td>Generate hash key from columns</td>
              <td><code>{`{{ dbt_utils.surrogate_key(['col1', 'col2']) }}`}</code></td>
            </tr>
            <tr>
              <td><code>date_spine()</code></td>
              <td>Generate date series</td>
              <td><code>{`{{ dbt_utils.date_spine(...) }}`}</code></td>
            </tr>
            <tr>
              <td><code>union_relations()</code></td>
              <td>Union multiple tables</td>
              <td><code>{`{{ dbt_utils.union_relations(relations=[ref('a'), ref('b')]) }}`}</code></td>
            </tr>
            <tr>
              <td><code>get_column_values()</code></td>
              <td>Get distinct values from column</td>
              <td><code>{`{{ dbt_utils.get_column_values(ref('orders'), 'status') }}`}</code></td>
            </tr>
            <tr>
              <td><code>star()</code></td>
              <td>Select all columns except specified</td>
              <td><code>{`{{ dbt_utils.star(from=ref('stg_orders'), except=['_loaded_at']) }}`}</code></td>
            </tr>
            <tr>
              <td><code>pivot()</code></td>
              <td>Pivot values into columns</td>
              <td><code>{`{{ dbt_utils.pivot('status', dbt_utils.get_column_values(...)) }}`}</code></td>
            </tr>
            <tr>
              <td><code>group_by()</code></td>
              <td>Group by column numbers</td>
              <td><code>{`{{ dbt_utils.group_by(n=3) }}`}</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>dbt_utils: Test Macros</h2>
        <pre className="code-block"><code>{`# schema.yml
models:
  - name: orders
    columns:
      - name: order_id
        tests:
          # Relationship where condition
          - dbt_utils.relationships_where:
              to: ref('customers')
              field: customer_id
              from_condition: "status != 'cancelled'"

          # Values must be in list
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000

      - name: order_date
        tests:
          # Date is not in future
          - dbt_utils.expression_is_true:
              expression: "<= current_date"

      - name: email
        tests:
          # Regex pattern match
          - dbt_utils.not_null_proportion:
              at_least: 0.95`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>dbt_expectations: Example Tests</h2>
        <pre className="code-block"><code>{`models:
  - name: orders
    tests:
      # Row count in range
      - dbt_expectations.expect_table_row_count_to_be_between:
          min_value: 1000
          max_value: 1000000

    columns:
      - name: order_total
        tests:
          # Values in range
          - dbt_expectations.expect_column_values_to_be_between:
              min_value: 0
              max_value: 10000

          # No null values
          - dbt_expectations.expect_column_values_to_not_be_null

      - name: email
        tests:
          # Email format validation
          - dbt_expectations.expect_column_values_to_match_regex:
              regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>codegen: Generate Boilerplate</h2>
        <pre className="code-block"><code>{`# Generate base model SQL for source
dbt run-operation generate_base_model --args '{"source_name": "stripe", "table_name": "customers"}'

# Generate schema YAML for models
dbt run-operation generate_model_yaml --args '{"model_names": ["stg_customers", "stg_orders"]}'

# Generate source YAML
dbt run-operation generate_source --args '{"schema_name": "raw_stripe", "database_name": "analytics"}'

# Output can be copied and pasted into your project`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Using Package Macros</h2>
        <pre className="code-block"><code>{`-- Always prefix with package name
select
  {{ dbt_utils.surrogate_key(['customer_id', 'order_id']) }} as order_line_key,
  customer_id,
  order_id,
  product_id
from {{ ref('stg_order_lines') }}

-- Generate date spine
{{ dbt_utils.date_spine(
    datepart="day",
    start_date="cast('2020-01-01' as date)",
    end_date="cast('2025-12-31' as date)"
) }}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Package Best Practices</h2>
        <ul className="patterns-list">
          <li><strong>Version pinning:</strong> Always specify exact versions in packages.yml</li>
          <li><strong>Review changelog:</strong> Check breaking changes before upgrading</li>
          <li><strong>Test after upgrade:</strong> Run <code>dbt build</code> after <code>dbt deps</code></li>
          <li><strong>Namespace awareness:</strong> Always use package prefix: <code>dbt_utils.macro_name</code></li>
          <li><strong>Documentation:</strong> Check package docs on hub.getdbt.com</li>
          <li><strong>Minimal packages:</strong> Only install what you need to reduce dependencies</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Finding Packages</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>1. Browse dbt Package Hub</strong></p>
            <p>Visit hub.getdbt.com for official registry</p>
          </div>
          <div className="flowchart-step">
            <p><strong>2. Check GitHub</strong></p>
            <p>Search for "dbt-package" or "dbt-[warehouse]" on GitHub</p>
          </div>
          <div className="flowchart-step">
            <p><strong>3. Read Documentation</strong></p>
            <p>Review README and available macros</p>
          </div>
          <div className="flowchart-step">
            <p><strong>4. Add to packages.yml</strong></p>
            <p>Install with dbt deps</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function HooksSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Hooks & Operations</h1>
        <p className="sheet-tagline">Run SQL before, after, or around dbt runs</p>
      </header>

      <section className="sheet-section">
        <h2>What Are Hooks?</h2>
        <p className="definition">
          <strong>Hooks</strong> are snippets of SQL that run at specific points in the dbt execution lifecycle.
          Use them for grants, logging, cleanup, or warehouse optimization.
        </p>
      </section>

      <section className="sheet-section">
        <h2>Hook Types</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Hook</th>
              <th>When It Runs</th>
              <th>Use For</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>on-run-start</code></td>
              <td>Beginning of dbt run/test/build</td>
              <td>Create schemas, set session variables</td>
            </tr>
            <tr>
              <td><code>on-run-end</code></td>
              <td>End of dbt run/test/build</td>
              <td>Log results, send notifications, cleanup</td>
            </tr>
            <tr>
              <td><code>pre-hook</code></td>
              <td>Before building each model</td>
              <td>Truncate staging tables, disable constraints</td>
            </tr>
            <tr>
              <td><code>post-hook</code></td>
              <td>After building each model</td>
              <td>Grant permissions, create indexes, optimize</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>on-run-start & on-run-end</h2>
        <pre className="code-block"><code>{`-- dbt_project.yml
on-run-start:
  - "create schema if not exists {{ target.schema }}_snapshot"
  - "{{ log_run_start() }}"  # Call custom macro

on-run-end:
  - "{{ log_run_results() }}"  # Custom logging macro
  - "{{ dbt_artifacts.upload_results(results) }}"  # Package macro
  - "grant usage on schema {{ target.schema }} to role analyst"

# Multiple hooks run in order
# Access results with: {{ results }} variable`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>pre-hook & post-hook (Model Level)</h2>
        <pre className="code-block"><code>{`-- In model SQL file
{{
  config(
    pre_hook="delete from {{ this }} where is_deleted = true",
    post_hook=[
      "grant select on {{ this }} to role analyst",
      "create index if not exists idx_customer_id on {{ this }} (customer_id)"
    ]
  )
}}

select * from {{ ref('stg_orders') }}

-- Or in dbt_project.yml
models:
  my_project:
    marts:
      +post-hook:
        - "grant select on {{ this }} to role reporting_user"`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Common post-hook: Grant Permissions</h2>
        <pre className="code-block"><code>{`-- dbt_project.yml
models:
  my_project:
    marts:
      +post-hook:
        - "grant select on {{ this }} to role analyst"
        - "grant select on {{ this }} to role bi_tool"

# Or create a macro for reusability
-- macros/grant_select.sql
{% macro grant_select(role) %}
  grant select on {{ this }} to role {{ role }}
{% endmacro %}

# Then use in config
{{
  config(
    post_hook="{{ grant_select('analyst') }}"
  )
}}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Accessing Context in Hooks</h2>
        <pre className="code-block"><code>{`# Available variables in hooks:

{{ this }}           # Current model's relation
{{ target }}         # Target configuration (name, schema, etc)
{{ var('...') }}     # Project variables
{{ ref('...') }}     # Reference other models
{{ source('...') }}  # Reference sources

# on-run-end only:
{{ results }}        # List of result objects from run

# Example: Log failures
{% if results %}
  {% for result in results %}
    {% if result.status == 'error' %}
      insert into {{ target.schema }}.dbt_run_errors
      values ('{{ result.node.name }}', '{{ result.message }}', current_timestamp)
    {% endif %}
  {% endfor %}
{% endif %}`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Operations (run-operation)</h2>
        <p className="definition">
          Operations are macros that you run standalone via CLI, not tied to models.
          Use for maintenance, migrations, or administrative tasks.
        </p>
        <pre className="code-block"><code>{`-- macros/grant_all_schemas.sql
{% macro grant_all_schemas(role) %}
  {% set schemas = ['analytics', 'staging', 'marts'] %}
  {% for schema in schemas %}
    grant usage on schema {{ schema }} to role {{ role }};
    grant select on all tables in schema {{ schema }} to role {{ role }};
  {% endfor %}
{% endmacro %}

# Run from command line
dbt run-operation grant_all_schemas --args '{"role": "analyst"}'

-- macros/drop_old_models.sql
{% macro drop_old_models(schema_name, days_old=30) %}
  {% set query %}
    select table_name
    from {{ schema_name }}.information_schema.tables
    where table_schema = '{{ schema_name }}'
      and table_type = 'VIEW'
      and created < current_date - interval '{{ days_old }} days'
  {% endset %}

  {% set results = run_query(query) %}
  {% for row in results %}
    drop view if exists {{ schema_name }}.{{ row[0] }};
  {% endfor %}
{% endmacro %}

# Run it
dbt run-operation drop_old_models --args '{"schema_name": "dev_staging", "days_old": 7}'`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Hook Execution Order</h2>
        <div className="flowchart">
          <div className="flowchart-step">
            <p><strong>1. on-run-start hooks</strong></p>
            <p>Run once at beginning</p>
          </div>
          <div className="flowchart-step">
            <p><strong>2. For each model:</strong></p>
            <p>→ pre-hook (if defined)</p>
            <p>→ Build model</p>
            <p>→ post-hook (if defined)</p>
          </div>
          <div className="flowchart-step">
            <p><strong>3. on-run-end hooks</strong></p>
            <p>Run once at end (even if errors)</p>
          </div>
        </div>
      </section>

      <section className="sheet-section">
        <h2>Real-World Hook Examples</h2>
        <pre className="code-block"><code>{`# 1. Warehouse optimization (Snowflake)
post-hook: "alter table {{ this }} cluster by (order_date)"

# 2. Data retention policy
pre-hook: "delete from {{ this }} where created_at < current_date - 365"

# 3. Audit logging
on-run-end:
  - "{{ log_dbt_results(results) }}"

# 4. Grant to multiple roles
post-hook:
  - "grant select on {{ this }} to role analyst"
  - "grant select on {{ this }} to role data_scientist"
  - "grant select on {{ this }} to role bi_tool"

# 5. Create indexes for performance
post-hook:
  - "create index if not exists idx_customer on {{ this }} (customer_id)"
  - "create index if not exists idx_date on {{ this }} (order_date)"

# 6. Materialized view refresh (BigQuery)
post-hook: "call \`{{ target.project }}\`.{{ target.dataset }}.refresh_materialized_view('{{ this }}')"`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Best Practices</h2>
        <ul className="patterns-list">
          <li><strong>Idempotent:</strong> Hooks should be safe to run multiple times</li>
          <li><strong>Fast:</strong> Avoid slow hooks that block model execution</li>
          <li><strong>Error handling:</strong> Use <code>if</code> statements to handle edge cases</li>
          <li><strong>Conditional execution:</strong> Use <code>{`{% if target.name == 'prod' %}`}</code> for environment-specific hooks</li>
          <li><strong>Logging:</strong> Use <code>{`{{ log('message', info=true) }}`}</code> for visibility</li>
          <li><strong>Testing:</strong> Test hooks in dev before deploying to prod</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Debugging Hooks</h2>
        <ul className="patterns-list">
          <li><strong>Check compiled SQL:</strong> Look in target/run/ for hook SQL</li>
          <li><strong>Use --debug flag:</strong> <code>dbt run --debug</code> shows hook execution</li>
          <li><strong>Test in isolation:</strong> Create temporary models to test hooks</li>
          <li><strong>Check logs:</strong> Hooks appear in logs/dbt.log with timestamps</li>
        </ul>
      </section>
    </div>
  )
}

function SnapshotsSheet() {
  return (
    <div className="sheet">
      <header className="sheet-header">
        <h1>Snapshots (SCD Type 2)</h1>
        <p className="sheet-tagline">Track historical changes over time</p>
      </header>

      <section className="sheet-section">
        <h2>What Are Snapshots?</h2>
        <p className="definition">
          <strong>Snapshots</strong> implement Slowly Changing Dimension (SCD) Type 2 logic, capturing
          how records change over time. Each snapshot adds validity timestamps to track when records were active.
        </p>
      </section>

      <section className="sheet-section">
        <h2>Why Use Snapshots?</h2>
        <ul className="checklist-list">
          <li>✓ Track customer status changes (active → churned → reactivated)</li>
          <li>✓ Monitor product price history</li>
          <li>✓ Audit record modifications for compliance</li>
          <li>✓ Analyze historical dimensions (how many customers were active on 2024-01-01?)</li>
          <li>✓ Point-in-time reporting (what was the customer's address last year?)</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Two Snapshot Strategies</h2>
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
              <td><strong>timestamp</strong></td>
              <td>Track changes using updated_at column</td>
              <td>Tables with reliable update timestamps</td>
            </tr>
            <tr>
              <td><strong>check</strong></td>
              <td>Compare all columns to detect changes</td>
              <td>Tables without timestamps, need full change detection</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Timestamp Strategy</h2>
        <pre className="code-block"><code>{`-- snapshots/snap_customers.sql
{% snapshot snap_customers %}

{{
  config(
    target_schema='snapshots',
    unique_key='customer_id',
    strategy='timestamp',
    updated_at='updated_at',
    invalidate_hard_deletes=True
  )
}}

select * from {{ source('stripe', 'customers') }}

{% endsnapshot %}

-- Result adds these columns:
-- dbt_valid_from: when this version became active
-- dbt_valid_to: when this version became inactive (null = current)
-- dbt_scd_id: unique hash for each version
-- dbt_updated_at: snapshot of the updated_at field`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Check Strategy</h2>
        <pre className="code-block"><code>{`-- snapshots/snap_products.sql
{% snapshot snap_products %}

{{
  config(
    target_schema='snapshots',
    unique_key='product_id',
    strategy='check',
    check_cols=['price', 'status', 'category'],
    invalidate_hard_deletes=True
  )
}}

select
  product_id,
  product_name,
  price,
  status,
  category
from {{ source('ecommerce', 'products') }}

{% endsnapshot %}

-- Triggers new snapshot version when price, status, or category changes
-- Use check_cols='all' to check every column`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Running Snapshots</h2>
        <pre className="code-block"><code>{`# Run all snapshots
dbt snapshot

# Run specific snapshot
dbt snapshot --select snap_customers

# Check snapshots in DAG
dbt ls --resource-type snapshot

# Snapshots should run frequently (hourly/daily) to capture changes`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Snapshot Configuration Options</h2>
        <table className="decision-table">
          <thead>
            <tr>
              <th>Config</th>
              <th>Purpose</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>target_schema</code></td>
              <td>Where to store snapshot table</td>
              <td><code>snapshots</code></td>
            </tr>
            <tr>
              <td><code>unique_key</code></td>
              <td>Column(s) that identify unique records</td>
              <td><code>customer_id</code></td>
            </tr>
            <tr>
              <td><code>strategy</code></td>
              <td>Detection method (timestamp or check)</td>
              <td><code>timestamp</code></td>
            </tr>
            <tr>
              <td><code>updated_at</code></td>
              <td>Timestamp column (timestamp strategy only)</td>
              <td><code>updated_at</code></td>
            </tr>
            <tr>
              <td><code>check_cols</code></td>
              <td>Columns to monitor (check strategy only)</td>
              <td><code>['status', 'email']</code> or <code>'all'</code></td>
            </tr>
            <tr>
              <td><code>invalidate_hard_deletes</code></td>
              <td>Close out deleted records</td>
              <td><code>True</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="sheet-section">
        <h2>Using Snapshots in Models</h2>
        <pre className="code-block"><code>{`-- Get current (active) records only
select *
from {{ ref('snap_customers') }}
where dbt_valid_to is null

-- Get historical records at specific date
select *
from {{ ref('snap_customers') }}
where '2024-01-01' between dbt_valid_from and coalesce(dbt_valid_to, '9999-12-31')

-- Track changes over time
select
  customer_id,
  status,
  dbt_valid_from,
  dbt_valid_to,
  datediff('day', dbt_valid_from, coalesce(dbt_valid_to, current_date)) as days_in_status
from {{ ref('snap_customers') }}
order by customer_id, dbt_valid_from`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Snapshot Lifecycle Example</h2>
        <pre className="code-block"><code>{`-- Initial snapshot on 2024-01-01
customer_id | status   | dbt_valid_from | dbt_valid_to
-----------+----------+----------------+-------------
1          | active   | 2024-01-01     | null

-- Customer status changes on 2024-02-15
-- After running dbt snapshot:
customer_id | status   | dbt_valid_from | dbt_valid_to
-----------+----------+----------------+-------------
1          | active   | 2024-01-01     | 2024-02-15
1          | churned  | 2024-02-15     | null

-- Customer reactivates on 2024-03-20
customer_id | status      | dbt_valid_from | dbt_valid_to
-----------+-------------+----------------+-------------
1          | active      | 2024-01-01     | 2024-02-15
1          | churned     | 2024-02-15     | 2024-03-20
1          | reactivated | 2024-03-20     | null`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Hard Deletes</h2>
        <pre className="code-block"><code>{`# When invalidate_hard_deletes=True:
# If a record disappears from source, dbt sets dbt_valid_to to current timestamp

-- Before deletion
customer_id | status | dbt_valid_from | dbt_valid_to
-----------+--------+----------------+-------------
999        | active | 2024-01-01     | null

-- After source record deleted and snapshot runs
customer_id | status | dbt_valid_from | dbt_valid_to
-----------+--------+----------------+----------------
999        | active | 2024-01-01     | 2024-05-15

# Preserves historical record but marks it as no longer active`.trim()}</code></pre>
      </section>

      <section className="sheet-section">
        <h2>Best Practices</h2>
        <ul className="patterns-list">
          <li><strong>Schedule regularly:</strong> Run snapshots hourly or daily for accuracy</li>
          <li><strong>Unique keys:</strong> Ensure unique_key truly identifies records uniquely</li>
          <li><strong>Use timestamp when possible:</strong> More efficient than check strategy</li>
          <li><strong>Limit check_cols:</strong> Checking all columns can be slow; specify key columns</li>
          <li><strong>Monitor growth:</strong> Snapshot tables grow over time; monitor size</li>
          <li><strong>Test validity:</strong> Query for overlapping periods (shouldn't exist)</li>
          <li><strong>Document strategy:</strong> Explain why timestamp vs check was chosen</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Common Pitfalls</h2>
        <ul className="mistakes-list">
          <li>❌ Non-unique unique_key causes duplicates</li>
          <li>❌ Unreliable updated_at timestamps miss changes</li>
          <li>❌ Running snapshots infrequently loses granularity</li>
          <li>❌ Not handling timezones consistently</li>
          <li>❌ Forgetting to filter dbt_valid_to is null for current records</li>
          <li>❌ Snapshotting large tables without incremental source strategy</li>
        </ul>
      </section>

      <section className="sheet-section">
        <h2>Advanced: Snapshot + Incremental</h2>
        <pre className="code-block"><code>{`-- For very large tables, snapshot from an incremental staging model
-- models/staging/stg_large_table.sql
{{
  config(
    materialized='incremental',
    unique_key='record_id'
  )
}}

select * from {{ source('raw', 'large_table') }}
{% if is_incremental() %}
  where updated_at > (select max(updated_at) from {{ this }})
{% endif %}

-- snapshots/snap_large_table.sql
{% snapshot snap_large_table %}
{{
  config(
    target_schema='snapshots',
    unique_key='record_id',
    strategy='timestamp',
    updated_at='updated_at'
  )
}}

select * from {{ ref('stg_large_table') }}

{% endsnapshot %}

-- Reduces snapshot processing time significantly`.trim()}</code></pre>
      </section>
    </div>
  )
}
