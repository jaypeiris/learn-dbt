# dbt Learning Studio

Welcome to a concept first practice space for anyone learning dbt Core. Everything in this app runs client side, never touches your warehouse, and focuses on making the mental models behind dbt feel approachable.

## Who this is for
- Analysts who write SQL and want to understand how dbt structures a project.
- Analytics engineers who need a refresher on layers, refs, tests, materializations, or snapshots.
- Stakeholders who read dbt projects and want to decode lineage, manifests, and documentation.

No warehouse credentials, adapters, or command line skills are required. If you can open the site in a browser, you are ready to learn.

## What you will learn
The studio is organized into seven core modules plus supporting paths and references:
1. **Models and refs** - see how dbt treats every model as SQL and why `ref()` exists.
2. **Project layers** - understand staging, intermediate, and mart layers and how they shape a project.
3. **Materializations** - compare views, tables, incremental builds, and ephemeral models.
4. **Glue work** - connect tests, documentation, and exposures to the SQL they protect.
5. **Snapshots** - track how data changes over time and when versioning matters.
6. **Manifest views** - peek inside the compiled graph and learn how dbt reasons about dependencies.
7. **Jinja and macros** - write variables, loops, and reusable macros (including safe built-ins and package-style patterns).

Every module includes narrative lessons, interactive SQL edits, conceptual animations, and takeaways you can apply to your own project.

## How to use the platform
### Learn tab
- Start here for guided lessons. The left sidebar lists every lesson and keeps track of what you have opened.
- Each lesson pairs instructions with contextual SQL, a mini editor, lineage diagram, and step checks. Complete the prompts to reveal extra explanations.
- Your progress autosaves in the browser. Come back later and you will pick up where you left off.

### Skill Paths
- Role based roadmaps (Analyst, Engineer, Reader) live under the Paths route. Click a path to see time estimates, learning outcomes, and sequenced steps that combine lessons, practice, and real world actions.

### Practice tab
- Short coding challenges reinforce concepts like refs, layers, and testing. Paste or edit SQL until all checks pass, then read the explanation to understand why it works.
- Jinja and macro challenges live here too (variables, loops, execute guards, and package-style patterns).
- The Mistake Museum highlights actual project failures. Inspect the broken SQL, reveal the fix, and note the prevention tips.
- The Explain route lets you paste any dbt model SQL, automatically surfaces dependencies, suggests a layer, and gives next steps for validation.
- The Simulator route provides a VSCode-like practice environment where you can explore a sample dbt project and run simulated dbt commands.

### Reference tab
- Cheat Sheets provide printable guides for layers, grains, naming, commands, macros, materializations, tests, and incremental strategies. Use them as quick reminders during real projects.
- Project Explorer tours three fictional dbt projects so you can study folder structures, naming, and how layers build on each other.
- Manifest explains how dbt stores lineage inside `manifest.json`. Click nodes to see dependencies and why the graph matters.

### Guide tab
- Foundations outlines what dbt assumes you already know (SQL basics, warehouse access, EL pipelines, Git, schema permissions, and layered thinking). Use it as a checklist before running dbt in production.
- Next Steps suggests advanced topics, workflows, and community resources once you finish the core curriculum.

### Search everywhere
Press `Cmd/Ctrl + K` to open global search. Type any concept (ref, snapshots, tests, manifest, etc.) and jump directly to relevant lessons or explainers.

## Getting started
1. Open the app and land on the Learn tab.
2. Read the first lesson ("A dbt model is just SQL") and complete the prompt in the editor.
3. Use the lineage graph and build order animation to visualize how dbt thinks.
4. Move through the remaining lessons in order or switch to a skill path that matches your role.
5. Alternate between Learn and Practice tabs to reinforce theory with exercises.
6. Try the Simulator to practice `dbt ls`, `dbt compile`, `dbt run`, `dbt test`, and `dbt docs generate` without installing dbt locally.
6. Keep Cheat Sheets open in another window when you need a quick reminder of commands, layers, or incremental patterns.

## Tracking progress
- Lessons mark themselves complete as soon as all tasks in the sidebar finish.
- The current lesson, completion status, and any SQL edits you make are saved locally inside your browser. Clearing browser storage resets everything if you want to start over.

## dbt Core Simulator
The Simulator is a safe playground that mimics a dbt project and terminal without connecting to a warehouse.
- Access: **Practice → Simulator** (or go directly to `/#/simulator`).
- Edit files: toggle **Editable project** (in-memory only; refresh resets).
- Commands: try `dbt ls`, `dbt compile`, `dbt run`, `dbt test`, `dbt docs generate`.
- Artifacts: `dbt compile` / `dbt docs generate` create files under `target/` like `target/manifest.json` and `target/compiled/*.sql`.

## Tips for success
- Work in short sessions (20 to 30 minutes). Each lesson is designed to be digestible and focused on one idea.
- After finishing a module, head to Practice challenges that reinforce the same topic.
- Use the Mistake Museum to learn from failures you might otherwise make in production.
- When you build your own project, reference the demo projects to structure folders and naming consistently.
- Share what you learn with your team. Teaching others is the fastest way to internalize these concepts.

## Frequently asked questions
**Does this connect to my warehouse?**  
No. Everything is static content with lightweight string parsing. Nothing leaves your browser.

**Can I run dbt commands here?**  
Yes, via the Simulator (simulated output only). It does not execute SQL against a database. When you are ready to run against a real warehouse, use dbt Core locally or dbt Cloud.

**Do I need to install anything?**  
If you are just learning, open the hosted site and start. If you cloned the repo to explore the code, run `npm install` followed by `npm run dev` to launch the Vite dev server.

**How do I reset my progress?**  
Clear the `learn_dbt_*` keys from your browser local storage, or open the console and call `resetAllProgress()`.

## Ready to learn?
Pick the first lesson, follow the prompts, and keep experimenting. This studio is a sandbox for ideas. Make mistakes, rewind, explore the references, and build confidence before touching production data.
