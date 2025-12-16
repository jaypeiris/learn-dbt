import './NextStepsPage.css'

export default function NextStepsPage() {
  return (
    <div className="next-steps-page">
      <header className="next-steps-header">
        <h1>What Comes Next</h1>
        <p className="next-steps-subtitle">
          You've learned dbt Core fundamentals—models, layers, materializations, tests, and the manifest. Here's how to
          level up your skills and build production-grade data pipelines.
        </p>
      </header>

      <section className="next-section">
        <h2>1. Deep Dive into Advanced Features</h2>
        <p className="next-intro">
          The basics get you building, but these features separate hobbyists from professionals:
        </p>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Macros and Jinja</h3>
            <p>
              Write reusable SQL snippets using Jinja templating. Create custom macros to DRY up repetitive logic,
              generate dynamic SQL, and build flexible data pipelines.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> A <code>cents_to_dollars()</code> macro that converts currency fields
              consistently across all models.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/jinja-macros"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>

          <div className="feature-card">
            <h3>Incremental Models</h3>
            <p>
              Stop rebuilding entire tables on every run. Incremental models only process new or updated rows, making
              them essential for large fact tables and event logs.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> A daily sales fact table that only appends yesterday's transactions
              instead of scanning 5 years of history.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/incremental-models"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>

          <div className="feature-card">
            <h3>Snapshots</h3>
            <p>
              Track how source data changes over time. Snapshots let you see what a customer's address was last year,
              even if it's updated today.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> A product pricing snapshot so you can analyze historical pricing
              trends for past orders.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/snapshots"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>

          <div className="feature-card">
            <h3>Custom Tests and Packages</h3>
            <p>
              Go beyond built-in tests. Write custom singular tests for business logic, or install community packages
              (dbt-utils, dbt-expectations) for advanced validations.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> A custom test that ensures revenue always equals price × quantity for
              every order.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/tests"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>

          <div className="feature-card">
            <h3>Seeds and Sources</h3>
            <p>
              Seeds let you version small CSV files in your repo. Sources let you test raw tables before modeling them,
              catching upstream data quality issues early.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> A country code lookup CSV as a seed, and source freshness checks to
              alert if ELT pipelines stall.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/seeds"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>

          <div className="feature-card">
            <h3>Exposures and Metrics</h3>
            <p>
              Exposures document which dashboards depend on your models. Metrics define reusable business calculations
              (like ARR or churn rate) that BI tools can reference.
            </p>
            <div className="feature-example">
              <strong>Example use case:</strong> An exposure linking your Revenue Dashboard to <code>mart_revenue</code>
              , ensuring stakeholders know when models change.
            </div>
            <a
              href="https://docs.getdbt.com/docs/build/exposures"
              target="_blank"
              rel="noopener noreferrer"
              className="feature-link"
            >
              Read the docs →
            </a>
          </div>
        </div>
      </section>

      <section className="next-section">
        <h2>2. Build Production Workflows</h2>
        <p className="next-intro">
          Running <code>dbt run</code> manually works for development, but production requires automation:
        </p>
        <div className="workflow-grid">
          <div className="workflow-card">
            <div className="workflow-number">1</div>
            <h3>Set Up CI/CD</h3>
            <p>
              Use GitHub Actions, GitLab CI, or dbt Cloud to automatically test changes before merging. Run{' '}
              <code>dbt build --select state:modified+</code> on every pull request to catch breaking changes.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-number">2</div>
            <h3>Schedule Production Runs</h3>
            <p>
              Use dbt Cloud, Airflow, Prefect, or Dagster to run dbt on a schedule. Most teams run staging models
              hourly, intermediate models daily, and marts on-demand or after upstream jobs complete.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-number">3</div>
            <h3>Monitor Failures and Performance</h3>
            <p>
              Set up Slack alerts for failed dbt runs. Use <code>dbt run-operation</code> to run custom macros that
              archive logs or send metrics to observability tools like Monte Carlo or Datafold.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-number">4</div>
            <h3>Implement Slim CI</h3>
            <p>
              Don't rebuild everything on every commit. Use <code>state:modified+</code> to only test changed models and
              their downstream dependencies, cutting CI time from 30 minutes to 2 minutes.
            </p>
          </div>
        </div>
      </section>

      <section className="next-section">
        <h2>3. Deepen Your Analytics Engineering Skills</h2>
        <p className="next-intro">
          dbt is a tool, but analytics engineering is a discipline. Here's how to think like a pro:
        </p>
        <div className="skills-list">
          <div className="skill-item">
            <div className="skill-icon">📐</div>
            <div className="skill-content">
              <h3>Master Dimensional Modeling</h3>
              <p>
                Learn Kimball's star schema design—fact tables, dimension tables, slowly changing dimensions (SCD). Read{' '}
                <em>The Data Warehouse Toolkit</em> to understand why marts should have wide, denormalized tables.
              </p>
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-icon">🔍</div>
            <div className="skill-content">
              <h3>Get Obsessive About Data Quality</h3>
              <p>
                Write tests for every model. Test uniqueness, not-null constraints, referential integrity, and business
                rules. Treat failing tests like production incidents—investigate immediately.
              </p>
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-icon">📊</div>
            <div className="skill-content">
              <h3>Study Real dbt Projects</h3>
              <p>
                Explore open-source dbt projects on GitHub (dbt Labs' Jaffle Shop, GitLab's data team repo). See how
                mature teams structure folders, name models, and document transformations.
              </p>
            </div>
          </div>

          <div className="skill-item">
            <div className="skill-icon">🧩</div>
            <div className="skill-content">
              <h3>Learn When to Denormalize</h3>
              <p>
                Warehouses aren't OLTP databases. It's often better to duplicate data (e.g., joining customer name into
                every order) than to force BI tools to join 5 tables for a simple report.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="next-section">
        <h2>4. Explore the dbt Ecosystem</h2>
        <p className="next-intro">
          dbt has a thriving community and ecosystem of tools:
        </p>
        <div className="ecosystem-grid">
          <div className="ecosystem-card">
            <h3>dbt Packages</h3>
            <p>
              Install community-built packages via <code>packages.yml</code>. Popular packages:
            </p>
            <ul>
              <li>
                <strong>dbt-utils:</strong> 50+ macros for common tasks (surrogate keys, date spines, pivoting)
              </li>
              <li>
                <strong>dbt-expectations:</strong> 50+ tests inspired by Great Expectations
              </li>
              <li>
                <strong>dbt-audit-helper:</strong> Compare query results when refactoring models
              </li>
            </ul>
            <a
              href="https://hub.getdbt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ecosystem-link"
            >
              Browse the dbt Package Hub →
            </a>
          </div>

          <div className="ecosystem-card">
            <h3>dbt Cloud</h3>
            <p>
              The managed service from dbt Labs. Features include:
            </p>
            <ul>
              <li>Web-based IDE with built-in version control</li>
              <li>Scheduled jobs and alerting</li>
              <li>Automatic documentation hosting</li>
              <li>Slim CI and production observability</li>
            </ul>
            <a
              href="https://www.getdbt.com/product/dbt-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="ecosystem-link"
            >
              Learn about dbt Cloud →
            </a>
          </div>

          <div className="ecosystem-card">
            <h3>dbt Community</h3>
            <p>
              Join the conversation:
            </p>
            <ul>
              <li>
                <strong>dbt Slack:</strong> 50,000+ analytics engineers sharing patterns and troubleshooting
              </li>
              <li>
                <strong>Discourse:</strong> Long-form Q&A and feature discussions
              </li>
              <li>
                <strong>Coalesce:</strong> Annual dbt conference with talks from practitioners
              </li>
            </ul>
            <a
              href="https://www.getdbt.com/community/join-the-community"
              target="_blank"
              rel="noopener noreferrer"
              className="ecosystem-link"
            >
              Join the community →
            </a>
          </div>
        </div>
      </section>

      <section className="next-steps-footer">
        <h2>Your Next Action</h2>
        <div className="action-cards">
          <div className="action-card action-card--beginner">
            <h3>If you're just starting:</h3>
            <p>
              Build a personal project using your own data (Spotify listening history, Strava runs, personal finances).
              Start with staging models, then build one mart. Deploy it to GitHub and share it.
            </p>
          </div>

          <div className="action-card action-card--intermediate">
            <h3>If you've built a few models:</h3>
            <p>
              Refactor your existing dbt project to follow best practices. Add tests to every model. Implement CI/CD.
              Write a macro to solve a repetitive problem. Document your learnings in a blog post.
            </p>
          </div>

          <div className="action-card action-card--advanced">
            <h3>If you're production-ready:</h3>
            <p>
              Contribute to the dbt community. Write a dbt package. Speak at a local meetup. Mentor junior analysts.
              Optimize your incremental models for performance. Build a data quality dashboard.
            </p>
          </div>
        </div>

        <div className="final-cta">
          <p>
            <strong>Remember:</strong> The best way to learn dbt is to build with it. Theory only gets you so far—start
            transforming real data, make mistakes, and iterate. Welcome to analytics engineering.
          </p>
        </div>
      </section>
    </div>
  )
}
