import './FoundationsPage.css'

export default function FoundationsPage() {
  return (
    <div className="foundations-page">
      <header className="foundations-header">
        <h1>What dbt Core Assumes</h1>
        <p className="foundations-subtitle">
          Before you build any model, dbt expects certain infrastructure and knowledge to already be in place.
          Understanding these assumptions helps you troubleshoot faster and know when dbt is—or isn't—the right tool.
        </p>
      </header>

      <div className="foundations-grid">
        <section className="foundation-card foundation-card--warehouse">
          <div className="foundation-icon">🏢</div>
          <h2>You Have a Data Warehouse</h2>
          <p className="foundation-lead">
            dbt doesn't store data. It only generates SQL and executes it against your warehouse.
          </p>
          <div className="foundation-details">
            <h3>What this means:</h3>
            <ul>
              <li>You need Snowflake, BigQuery, Redshift, Databricks, Postgres, or another supported adapter</li>
              <li>Your warehouse must be running and accessible before dbt can do anything</li>
              <li>dbt will create tables/views in your warehouse schemas—it doesn't maintain its own database</li>
              <li>If your warehouse is slow, dbt will be slow (dbt doesn't cache query results)</li>
            </ul>
            <div className="foundation-note">
              <strong>Not sure?</strong> If you don't have a warehouse yet, you can't run dbt. Start with your
              cloud provider's free tier (e.g., Snowflake trial, BigQuery sandbox) before learning dbt.
            </div>
          </div>
        </section>

        <section className="foundation-card foundation-card--sql">
          <div className="foundation-icon">💬</div>
          <h2>You Know SQL</h2>
          <p className="foundation-lead">
            dbt models are written in SQL. If you're not comfortable with SELECT, JOIN, GROUP BY, and CTEs, learn those first.
          </p>
          <div className="foundation-details">
            <h3>Minimum SQL skills:</h3>
            <ul>
              <li>Write SELECT statements with WHERE and JOIN clauses</li>
              <li>Use aggregate functions (SUM, COUNT, AVG) with GROUP BY</li>
              <li>Understand Common Table Expressions (WITH clauses)</li>
              <li>Know the difference between LEFT JOIN, INNER JOIN, and FULL OUTER JOIN</li>
              <li>Recognize when a query produces fanout (duplicate rows from joins)</li>
            </ul>
            <div className="foundation-note">
              <strong>New to SQL?</strong> Spend a few weeks practicing SELECT queries on sample datasets before
              tackling dbt. dbt makes SQL more powerful, but it can't teach you SQL from scratch.
            </div>
          </div>
        </section>

        <section className="foundation-card foundation-card--raw">
          <div className="foundation-icon">📊</div>
          <h2>Your Raw Data is Already Loaded</h2>
          <p className="foundation-lead">
            dbt doesn't extract or load data. It transforms data that's already in your warehouse.
          </p>
          <div className="foundation-details">
            <h3>What this means:</h3>
            <ul>
              <li>You need an EL tool (Fivetran, Airbyte, Stitch, custom scripts) to land data first</li>
              <li>dbt starts with source() calls pointing to raw tables in your warehouse</li>
              <li>dbt's job is the "T" in ELT—it doesn't handle the "E" or "L"</li>
              <li>If your source tables are empty or stale, dbt can't fix that</li>
            </ul>
            <div className="foundation-note">
              <strong>No raw data yet?</strong> Use dbt seeds to upload small CSV files for practice, but in
              production you'll need a proper EL pipeline feeding your warehouse.
            </div>
          </div>
        </section>

        <section className="foundation-card foundation-card--version">
          <div className="foundation-icon">📝</div>
          <h2>You Use Version Control</h2>
          <p className="foundation-lead">
            dbt projects are code, and code should live in Git. dbt itself doesn't enforce this, but real teams do.
          </p>
          <div className="foundation-details">
            <h3>Why it matters:</h3>
            <ul>
              <li>Every model change is tracked—you can see who changed what and when</li>
              <li>Multiple analysts can work on separate branches without conflicts</li>
              <li>CI/CD tools (like dbt Cloud or GitHub Actions) can test changes before they hit production</li>
              <li>You can roll back bad deploys by reverting commits</li>
            </ul>
            <div className="foundation-note">
              <strong>New to Git?</strong> Learn basic Git commands (clone, commit, push, pull, branch, merge) before
              trying to collaborate on dbt projects. dbt Cloud provides a GUI, but CLI users need Git fluency.
            </div>
          </div>
        </section>

        <section className="foundation-card foundation-card--schema">
          <div className="foundation-icon">🗂️</div>
          <h2>You Have Schema Permissions</h2>
          <p className="foundation-lead">
            dbt needs CREATE permissions on schemas where it builds models. Read-only warehouse access won't work.
          </p>
          <div className="foundation-details">
            <h3>Required permissions:</h3>
            <ul>
              <li>CREATE TABLE and CREATE VIEW in your development schema (e.g., dev_yourname)</li>
              <li>SELECT access to raw source schemas</li>
              <li>DROP and TRUNCATE permissions if using full-refresh or snapshots</li>
              <li>In production, a service account with elevated permissions to build in analytics/marts schemas</li>
            </ul>
            <div className="foundation-note">
              <strong>Locked out?</strong> Ask your data platform admin to grant you a personal dev schema. Most
              teams give analysts their own sandbox so they can't break production.
            </div>
          </div>
        </section>

        <section className="foundation-card foundation-card--mental">
          <div className="foundation-icon">🧠</div>
          <h2>You Think in Layers, Not Dashboards</h2>
          <p className="foundation-lead">
            dbt is about modeling data incrementally. If you're used to writing one giant query per dashboard, dbt will
            feel backwards at first.
          </p>
          <div className="foundation-details">
            <h3>Mindset shift:</h3>
            <ul>
              <li>Instead of one 300-line query, you write 5 small models that ref() each other</li>
              <li>Staging models clean raw data. Intermediate models join and enrich. Marts finalize for BI tools.</li>
              <li>You'll write more files, but each file is simpler and more reusable</li>
              <li>The goal is maintainability and shared logic, not "fewest queries possible"</li>
            </ul>
            <div className="foundation-note">
              <strong>Feels weird?</strong> This layered approach takes time to internalize. Start by refactoring one
              messy query into 2-3 dbt models and notice how much easier it is to debug and extend.
            </div>
          </div>
        </section>
      </div>

      <section className="foundations-footer">
        <h2>When dbt Isn't the Right Tool</h2>
        <p>
          dbt is powerful, but it's not a universal solution. Here are scenarios where dbt doesn't fit:
        </p>
        <ul className="not-right-list">
          <li>
            <strong>You need real-time transformations:</strong> dbt runs in batch mode. For streaming transformations,
            use Apache Flink, Kafka Streams, or warehouse-native streaming features.
          </li>
          <li>
            <strong>You're doing data science modeling:</strong> dbt handles SQL transformations, not Python-based ML
            models. Use dbt to prepare training data, then hand off to Jupyter, MLflow, or Databricks notebooks.
          </li>
          <li>
            <strong>You need to orchestrate complex workflows:</strong> dbt runs models in dependency order, but it
            doesn't handle job retries, alerting, or coordinating non-SQL tasks. Use Airflow, Prefect, or Dagster
            around dbt.
          </li>
          <li>
            <strong>Your warehouse doesn't support CREATE TABLE:</strong> Some read-only replicas or federated query
            engines can't materialize tables. dbt won't work there.
          </li>
        </ul>
        <div className="foundations-cta">
          <p>
            <strong>Ready to continue?</strong> If you have a warehouse, know SQL, and have raw data loaded, you're
            set. Head to the <strong>Lessons</strong> tab to start building models, or explore <strong>Skill Paths</strong> for
            role-specific guidance.
          </p>
        </div>
      </section>
    </div>
  )
}
