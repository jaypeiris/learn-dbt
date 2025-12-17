# Implementation Plan: Module 7 (Jinja & Macros), Practice Challenges, and dbt Core Simulator

## Overview
Add comprehensive Jinja/Macro content to the dbt learning platform with three major components:
1. **Module 7: Jinja & Macros** - 5 interactive lessons
2. **Jinja Practice Challenges** - 6-8 new challenges
3. **dbt Core Simulator** - VSCode-like terminal + file system viewer

**Focus:** dbt Core only (no Cloud features)
**Target:** Free educational resource

---

## PHASE 1: Module 7 - Jinja & Macros (5 Lessons)

### 1.1 Create Module Directory Structure

**Location:** `src/data/lessons/module_07_jinja_macros/`

**Files to create:**
```
module_07_lesson_01_variables_and_loops.lesson.json
module_07_lesson_02_writing_macros.lesson.json
module_07_lesson_03_builtin_functions.lesson.json
module_07_lesson_04_packages.lesson.json
module_07_lesson_05_dynamic_sql.lesson.json
```

### 1.2 Lesson 1: Variables and Loops

**Learning Objective:** Master {% set %} variables and {% for %} loops

**Content Structure:**
- **Starter State:** Model with hardcoded column list
- **Task 1:** Convert to {% set columns = [...] %}
- **Task 2:** Use {% for col in columns %} to iterate
- **Task 3:** Use loop.last to handle comma placement

**Models:**
1. `hardcoded_columns` (editable) - Student fixes this
2. `dynamic_example` (read-only) - Reference implementation
3. `loop_properties` (read-only) - Shows loop.index, loop.first, loop.last

**Checks:**
- `contains_text`: "{% set"
- `contains_text`: "{% for"
- `contains_text`: "loop.last"

**Reveal Sections:**
1. "How Jinja variables work" - Explain {% set %} syntax
2. "Why dynamic columns matter" - Prevents hardcoded lists that get stale
3. "Loop properties" - loop.index, loop.first, loop.last, loop.length

**Comparisons:**
- Left: Static column list
- Right: Dynamic with {% for %}

### 1.3 Lesson 2: Writing Macros

**Learning Objective:** Create reusable {% macro %} blocks

**Content Structure:**
- **Starter State:** Repeated SQL logic across 2+ models
- **Task 1:** Define {% macro cents_to_dollars() %}
- **Task 2:** Call the macro using {{ cents_to_dollars(column_name) }}
- **Task 3:** Use the macro in multiple places

**Models:**
1. `repeated_logic` (editable) - Has duplicated CASE statements
2. `with_macro_def` (editable) - Define the macro here
3. `using_macro` (editable) - Call the macro
4. `macro_example` (read-only) - Reference implementation

**Checks:**
- `contains_text`: "{% macro"
- `contains_text`: "{% endmacro"
- `contains_text`: "{{ cents_to_dollars"

**Reveal Sections:**
1. "What macros are" - Functions for SQL
2. "Macro arguments" - How to pass parameters
3. "Where macros live" - macros/ folder in real projects
4. "Macro scope" - Available across entire project

**Comparisons:**
- Left: Duplicated logic in multiple models
- Right: DRY code with macro

### 1.4 Lesson 3: Built-in dbt Functions

**Learning Objective:** Use run_query(), {{ target }}, and {% if execute %}

**Content Structure:**
- **Part A:** target variable
  - Task: Use {{ target.name }} to conditionally set table name
- **Part B:** {% if execute %} guard
  - Task: Wrap run_query() in execute check
- **Part C:** run_query()
  - Task: Dynamically query available values

**Models:**
1. `target_example` (editable) - Use target.name, target.schema
2. `execute_guard` (editable) - Add missing {% if execute %}
3. `dynamic_query` (editable) - Use run_query() safely
4. `builtin_reference` (read-only) - Shows all built-in functions

**Checks:**
- `contains_text`: "target.name"
- `contains_text`: "{% if execute %}"
- `contains_text`: "run_query"

**Reveal Sections:**
1. "The target variable" - name, schema, database, type
2. "Parse vs execute phases" - Why execute check matters
3. "run_query() safely" - Always wrap in {% if execute %}
4. "Other built-ins" - var(), env_var(), modules

**Comparisons:**
- Left: Hardcoded without execute check (breaks dbt ls)
- Right: Safe with {% if execute %}

### 1.5 Lesson 4: Package Usage

**Learning Objective:** Use dbt_utils and other packages

**Content Structure:**
- **Starter State:** Manual implementation of common patterns
- **Task 1:** Replace with dbt_utils.surrogate_key()
- **Task 2:** Use dbt_utils.get_column_values()
- **Task 3:** Use dbt_utils.star() with exclude

**Models:**
1. `manual_surrogate_key` (editable) - Replace with macro
2. `manual_column_list` (editable) - Use get_column_values()
3. `select_star_except` (editable) - Use star(exclude=[...])
4. `dbt_utils_reference` (read-only) - Common dbt_utils macros

**Checks:**
- `contains_text`: "dbt_utils.surrogate_key"
- `contains_text`: "dbt_utils.get_column_values"
- `contains_text`: "dbt_utils.star"

**Reveal Sections:**
1. "What packages are" - Reusable macro libraries
2. "Installing packages" - packages.yml file
3. "Common packages" - dbt_utils, dbt_expectations, codegen
4. "When to use packages" - DRY principle

**Comparisons:**
- Left: 10 lines of manual MD5 hashing
- Right: 1 line with dbt_utils.surrogate_key()

### 1.6 Lesson 5: Dynamic SQL Patterns (Capstone)

**Learning Objective:** Combine everything - variables, loops, macros, packages

**Content Structure:**
- **Complex Scenario:** Build a dynamic pivot table
- **Task 1:** Use run_query() to get dynamic list of categories
- **Task 2:** Loop through categories to create columns
- **Task 3:** Use a macro for the CASE statement logic
- **Task 4:** Add {% if execute %} guard

**Models:**
1. `dynamic_pivot` (editable) - Student builds complete solution
2. `pivot_step1` (read-only) - Shows static version
3. `pivot_step2` (read-only) - Shows with dynamic list
4. `pivot_final` (read-only) - Complete solution

**Checks:**
- `contains_text`: "{% if execute %}"
- `contains_text`: "run_query"
- `contains_text`: "{% for"
- `min_unique_refs`: 1

**Reveal Sections:**
1. "Why dynamic pivots matter" - Data-driven columns
2. "The pattern" - Query → Loop → Generate
3. "Common use cases" - Product types, regions, time periods
4. "Performance considerations" - When dynamic patterns help/hurt

**Comparisons:**
- Left: Hardcoded pivot (breaks when new category added)
- Right: Dynamic pivot (adapts automatically)

### 1.7 Register Module 7 in System

**File: `src/lib/lessonEngine.ts`**
```typescript
// Add imports (after module06 imports)
import module07Lesson01Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_01_variables_and_loops.lesson.json'
import module07Lesson02Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_02_writing_macros.lesson.json'
import module07Lesson03Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_03_builtin_functions.lesson.json'
import module07Lesson04Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_04_packages.lesson.json'
import module07Lesson05Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_05_dynamic_sql.lesson.json'

// Add to lessonDefinitions array (after module06 lessons)
  module07Lesson01Raw,
  module07Lesson02Raw,
  module07Lesson03Raw,
  module07Lesson04Raw,
  module07Lesson05Raw,
```

**File: `src/data/lessons/lesson_index.json`**
```json
{
  "id": "module-07-lesson-01-variables-loops",
  "title": "Module 7 Lesson 1 - Jinja variables and loops",
  "summary": "Use {% set %} and {% for %} to make SQL dynamic and maintainable"
},
{
  "id": "module-07-lesson-02-writing-macros",
  "title": "Module 7 Lesson 2 - Writing reusable macros",
  "summary": "Create {% macro %} blocks to eliminate duplicated SQL logic"
},
{
  "id": "module-07-lesson-03-builtin-functions",
  "title": "Module 7 Lesson 3 - Built-in dbt functions",
  "summary": "Use target, execute, and run_query() for context-aware models"
},
{
  "id": "module-07-lesson-04-packages",
  "title": "Module 7 Lesson 4 - Using dbt packages",
  "summary": "Replace manual code with battle-tested macros from dbt_utils"
},
{
  "id": "module-07-lesson-05-dynamic-sql",
  "title": "Module 7 Lesson 5 - Dynamic SQL patterns",
  "summary": "Combine Jinja techniques to build data-driven models that adapt automatically"
}
```

---

## PHASE 2: Jinja Practice Challenges

### 2.1 Create Jinja Challenge Category

**File: `src/data/challenges/jinja-challenges.json`**

**Challenge Structure:**
```json
{
  "id": "jinja-mastery",
  "title": "Jinja & Macros",
  "description": "Master Jinja templating and custom macros in dbt",
  "challenges": [...]
}
```

### 2.2 Challenge Definitions (8 challenges)

**Challenge 1: Add Variables**
- **Difficulty:** beginner
- **Starter:** Hardcoded list in SQL
- **Task:** Convert to {% set my_list = [...] %}
- **Checks:** contains_text "{% set"

**Challenge 2: For Loop Basics**
- **Difficulty:** beginner
- **Starter:** Repeated column names
- **Task:** Replace with {% for col in columns %}
- **Checks:** contains_text "{% for", contains_text "{% endfor %}"

**Challenge 3: Loop Properties**
- **Difficulty:** intermediate
- **Starter:** Loop without proper comma handling
- **Task:** Use loop.last or loop.index
- **Checks:** contains_text "loop.last" OR contains_text "loop.index"

**Challenge 4: Write a Simple Macro**
- **Difficulty:** intermediate
- **Starter:** Duplicated CASE statement
- **Task:** Extract to {% macro %} and call it
- **Checks:** contains_text "{% macro", contains_text "{%- endmacro %}"

**Challenge 5: Macro with Arguments**
- **Difficulty:** intermediate
- **Starter:** Macro with no parameters
- **Task:** Add arguments and use them
- **Checks:** contains_text "{% macro", contains_text "("

**Challenge 6: Add Execute Guard**
- **Difficulty:** intermediate
- **Starter:** run_query() without protection
- **Task:** Wrap in {% if execute %}
- **Checks:** contains_text "{% if execute %}", contains_text "run_query"

**Challenge 7: Use dbt_utils**
- **Difficulty:** intermediate
- **Starter:** Manual surrogate key generation
- **Task:** Replace with dbt_utils.surrogate_key()
- **Checks:** contains_text "dbt_utils.surrogate_key"

**Challenge 8: Dynamic Pivot**
- **Difficulty:** advanced
- **Starter:** Static pivot table
- **Task:** Make it dynamic with run_query() + for loop
- **Checks:** contains_text "run_query", contains_text "{% for", contains_text "{% if execute %}"

### 2.3 Extend Validation System

**File: `types/practice.d.ts`**

Add new check types:
```typescript
export type ChallengeCheck = {
  type: 'includes_ref'
       | 'materialization'
       | 'mentions_column'
       | 'contains_text'
       | 'layer_structure'
       | 'test_count'
       | 'jinja_macro_defined'    // NEW
       | 'jinja_for_loop'         // NEW
       | 'jinja_if_execute'       // NEW
       | 'jinja_set_variable'     // NEW
  value: string | number
  hint: string
}
```

**File: `src/pages/PracticePage.tsx`**

Extend evaluateCheck function (around line 189):
```typescript
case 'jinja_macro_defined':
  return /\{\%\s*[-]?\s*macro\s+\w+/.test(sql)

case 'jinja_for_loop':
  return /\{\%\s*for\s+\w+\s+in\s+/.test(sql)

case 'jinja_if_execute':
  return /\{\%\s*if\s+execute\s*\%\}/.test(sql)

case 'jinja_set_variable':
  return /\{\%\s*set\s+\w+\s*=/.test(sql)
```

### 2.4 Register Jinja Challenges

**File: `src/lib/practiceEngine.ts`**

Add import:
```typescript
import jinjaChallenges from '../data/challenges/jinja-challenges.json'
```

Add to categories array:
```typescript
const challengeCategories: ChallengeCategory[] = [
  refChallenges as ChallengeCategory,
  materializationChallenges as ChallengeCategory,
  layerChallenges as ChallengeCategory,
  grainChallenges as ChallengeCategory,
  testingChallenges as ChallengeCategory,
  refactoringChallenges as ChallengeCategory,
  jinjaChallenges as ChallengeCategory,  // NEW
]
```

---

## PHASE 3: dbt Core Simulator (VSCode-like Interface)

### 3.1 Architecture Overview

**Components:**
1. **Terminal Emulator** - Simulates bash/zsh terminal
2. **File System Viewer** - Tree view of dbt project structure
3. **Command Parser** - Interprets dbt commands
4. **Simulator Engine** - Executes dbt logic without database
5. **Output Renderer** - Shows dbt command output

**Technology Stack:**
- `xterm.js` - Terminal emulator
- `xterm-addon-fit` - Responsive terminal sizing
- `nunjucks` - Jinja2 rendering in JavaScript
- CodeMirror 6 (already in use) - File editor

### 3.2 Install Dependencies

**File: `package.json`**
```json
{
  "dependencies": {
    "@xterm/xterm": "^5.5.0",
    "@xterm/addon-fit": "^0.10.0",
    "nunjucks": "^3.2.4"
  }
}
```

### 3.3 Create Terminal Component

**File: `src/components/terminal/Terminal.tsx`**

```typescript
import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import './Terminal.css'

interface TerminalProps {
  onCommand: (cmd: string) => Promise<string>
  workingDirectory: string
}

export default function Terminal({ onCommand, workingDirectory }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerm | null>(null)

  // Initialize terminal, handle command input, render output
  // Full implementation details...
}
```

**File: `src/components/terminal/Terminal.css`**
- Style terminal container
- Set dbt-themed colors (match existing brand)
- Responsive sizing

### 3.4 Create File System Viewer

**File: `src/components/simulator/FileSystemTree.tsx`**

```typescript
interface FileNode {
  name: string
  type: 'file' | 'directory'
  path: string
  content?: string
  children?: FileNode[]
}

interface FileSystemTreeProps {
  files: FileNode
  onFileSelect: (path: string) => void
  selectedPath?: string
}

export default function FileSystemTree({ files, onFileSelect, selectedPath }: FileSystemTreeProps) {
  // Recursive tree rendering
  // Expand/collapse folders
  // Highlight selected file
}
```

**File: `src/components/simulator/FileSystemTree.css`**
- VSCode-style tree UI
- Folder icons (open/closed)
- File type icons
- Hover states

### 3.5 Create Simulator Engine

**File: `src/lib/simulatorEngine.ts`**

```typescript
export interface VirtualFileSystem {
  'models/staging/stg_orders.sql': string
  'models/staging/stg_customers.sql': string
  'models/marts/fct_orders.sql': string
  'macros/cents_to_dollars.sql': string
  'dbt_project.yml': string
}

export interface SimulationResult {
  output: string
  exitCode: number
  compiledSql?: string
  manifest?: any
}

export class DbtSimulator {
  constructor(private fs: VirtualFileSystem) {}

  // Core command handlers
  async compile(): Promise<SimulationResult>
  async run(): Promise<SimulationResult>
  async test(): Promise<SimulationResult>
  async ls(): Promise<SimulationResult>
  async docs(): Promise<SimulationResult>

  // Helper methods
  private parseModel(sql: string): ParsedModel
  private buildDAG(): DAGNode[]
  private renderJinja(template: string, context: object): string
}
```

**Key Methods:**

1. **compile()**
   - Parse all models
   - Render Jinja templates
   - Show compiled SQL
   - Generate manifest

2. **run()**
   - Show DAG build order
   - Simulate model execution
   - Show "success" messages per model

3. **test()**
   - Parse schema.yml tests
   - Show test execution
   - Report pass/fail (simulated)

4. **ls()**
   - List all models with resource types
   - Support selectors (tag:, marts., etc.)

5. **docs()**
   - Show "Catalog generated" message
   - Could show lineage graph

### 3.6 Jinja Rendering Engine

**File: `src/lib/jinjaRenderer.ts`**

```typescript
import nunjucks from 'nunjucks'

export class JinjaRenderer {
  private env: nunjucks.Environment

  constructor() {
    this.env = new nunjucks.Environment(null, { autoescape: false })
    this.registerFilters()
    this.registerGlobals()
  }

  // dbt built-in functions
  private registerGlobals() {
    this.env.addGlobal('ref', (model: string) => `{{ ref('${model}') }}`)
    this.env.addGlobal('source', (name: string, table: string) => `{{ source('${name}', '${table}') }}`)
    this.env.addGlobal('config', (opts: object) => `{{ config(...) }}`)
  }

  // dbt filters
  private registerFilters() {
    this.env.addFilter('as_bool', (value: any) => Boolean(value))
    this.env.addFilter('as_number', (value: any) => Number(value))
    // Add more dbt filters...
  }

  render(template: string, context: object): string {
    return this.env.renderString(template, context)
  }
}
```

### 3.7 Create Simulator Page

**File: `src/pages/SimulatorPage.tsx`**

**Layout:**
```
┌─────────────────────────────────────────────┐
│  Simulator: dbt Core Practice Environment  │
├──────────────┬──────────────────────────────┤
│ File Tree    │  Code Editor                 │
│              │  (CodeMirror)                │
│ models/      │                              │
│  staging/    │  Current file content        │
│  marts/      │                              │
│ macros/      │                              │
│ tests/       │                              │
│              │                              │
├──────────────┴──────────────────────────────┤
│  Terminal                                   │
│  $ dbt run                                  │
│  Running with dbt=1.8.0                     │
│  Found 3 models, 2 tests...                 │
└─────────────────────────────────────────────┘
```

**State Management:**
```typescript
const [fileSystem, setFileSystem] = useState<VirtualFileSystem>(defaultProject)
const [selectedFile, setSelectedFile] = useState<string>('models/marts/fct_orders.sql')
const [terminalOutput, setTerminalOutput] = useState<string[]>([])
const [workingDir, setWorkingDir] = useState<string>('/dbt-project')

const simulator = useMemo(() => new DbtSimulator(fileSystem), [fileSystem])

const handleCommand = async (cmd: string): Promise<string> => {
  const result = await simulator.executeCommand(cmd)
  return result.output
}
```

**File: `src/pages/SimulatorPage.css`**
- Grid layout for 3-panel interface
- Responsive breakpoints
- Dark theme option

### 3.8 Default Sample Project

**File: `src/data/simulator/default-project.ts`**

```typescript
export const defaultProject: VirtualFileSystem = {
  'dbt_project.yml': `
name: my_dbt_project
version: 1.0.0
profile: default
models:
  my_dbt_project:
    staging:
      materialized: view
    marts:
      materialized: table
`,
  'models/staging/stg_orders.sql': `
select
  order_id,
  customer_id,
  order_date,
  total_amount
from {{ source('raw', 'orders') }}
`,
  'models/marts/fct_orders.sql': `
{{ config(materialized='table') }}

select
  order_id,
  customer_id,
  order_date,
  total_amount
from {{ ref('stg_orders') }}
`,
  'macros/cents_to_dollars.sql': `
{% macro cents_to_dollars(column_name) %}
  ({{ column_name }} / 100.0)
{% endmacro %}
`
}
```

### 3.9 Add Simulator to Navigation

**File: `src/App.tsx`**

Add route:
```typescript
<Route path="/simulator" element={<SimulatorPage />} />
```

**File: `src/components/navigation/Navigation.tsx`**

Add link:
```typescript
<NavLink to="/simulator">dbt Simulator</NavLink>
```

### 3.10 Simulator Features (MVP - Read-Only)

**Phase 3A: Basic Terminal + Files (Week 3)**
- Terminal component renders with xterm.js
- File tree displays project structure
- Click files to VIEW content (read-only)
- Basic command parsing (ls, cd, cat)

**Phase 3B: dbt Commands (Week 4)**
- `dbt ls` - Lists models
- `dbt compile` - Shows compiled SQL in terminal
- `dbt run` - Simulates build order with success messages
- `dbt test` - Shows test results

**Phase 3C: Jinja Rendering (Week 5)**
- Render {{ ref() }} and {{ config() }}
- Support {% set %} variables
- Support {% for %} loops
- Show before/after template expansion in compile output

**DEFERRED to Future:**
- ❌ File editing (MVP is read-only)
- ❌ Custom project upload (default project only)
- ❌ Save/load state (resets each session)
- ❌ Advanced selectors (basic selectors only)

---

## IMPLEMENTATION ORDER

### Week 1: Module 7 All Lessons + Jinja Highlighting
- Create module directory
- Write all 5 lesson JSON files (lessons 1-5)
- Add Jinja syntax highlighting to SqlEditor component
- Register in lessonEngine.ts and lesson_index.json
- Test all lessons in browser

### Week 2: Jinja Practice Challenges
- Create jinja-challenges.json with 8 challenges
- Extend validation system with new Jinja check types
- Register challenges in practiceEngine.ts
- Test challenge validation
- Build and verify

### Week 3: Simulator Foundation
- Install xterm.js and nunjucks
- Create Terminal component
- Create FileSystemTree component
- Create basic SimulatorPage layout
- Wire up navigation

### Week 4: Simulator Engine
- Build DbtSimulator class
- Implement dbt compile
- Implement dbt run
- Implement dbt ls
- Create default project

### Week 5: Jinja Integration
- Build JinjaRenderer class
- Integrate nunjucks
- Support ref(), config(), source()
- Support variables and loops
- Show before/after rendering

### Week 6: Polish & Testing
- Add Jinja syntax highlighting to editors
- UI polish (loading states, error messages)
- Cross-browser testing
- Mobile responsive tweaks
- Documentation

---

## CRITICAL FILES TO MODIFY

### New Files (Create)
```
src/data/lessons/module_07_jinja_macros/module_07_lesson_01_variables_and_loops.lesson.json
src/data/lessons/module_07_jinja_macros/module_07_lesson_02_writing_macros.lesson.json
src/data/lessons/module_07_jinja_macros/module_07_lesson_03_builtin_functions.lesson.json
src/data/lessons/module_07_jinja_macros/module_07_lesson_04_packages.lesson.json
src/data/lessons/module_07_jinja_macros/module_07_lesson_05_dynamic_sql.lesson.json
src/data/challenges/jinja-challenges.json
src/components/terminal/Terminal.tsx
src/components/terminal/Terminal.css
src/components/simulator/FileSystemTree.tsx
src/components/simulator/FileSystemTree.css
src/pages/SimulatorPage.tsx
src/pages/SimulatorPage.css
src/lib/simulatorEngine.ts
src/lib/jinjaRenderer.ts
src/data/simulator/default-project.ts
```

### Existing Files (Modify)
```
src/lib/lessonEngine.ts (add module 7 imports)
src/data/lessons/lesson_index.json (add 5 entries)
src/lib/practiceEngine.ts (add jinja challenges import)
types/practice.d.ts (add new check types)
src/pages/PracticePage.tsx (extend validation)
src/App.tsx (add simulator route)
src/components/navigation/Navigation.tsx (add simulator link)
package.json (add dependencies)
```

---

## VALIDATION CHECKLIST

After implementation, verify:

- [ ] Module 7 appears in lesson list
- [ ] All 5 lessons are accessible and render correctly
- [ ] Lesson tasks validate properly
- [ ] Jinja challenges appear in practice page
- [ ] Challenge validation works with new check types
- [ ] Terminal renders and accepts input
- [ ] File tree displays and responds to clicks
- [ ] dbt commands produce output
- [ ] Jinja templates render correctly
- [ ] Simulator accessible from navigation
- [ ] All builds pass (TypeScript + Vite)
- [ ] No console errors in browser

---

## RISK MITIGATION

**Risk 1:** Jinja rendering complexity
- **Mitigation:** Start with simple patterns (ref, config), add complexity incrementally
- **Fallback:** Use regex-based rendering instead of full nunjucks

**Risk 2:** Terminal emulator performance
- **Mitigation:** Limit output buffer size, lazy load history
- **Fallback:** Use simpler textarea-based terminal

**Risk 3:** Simulator feature scope creep
- **Mitigation:** Strict MVP scope - read-only files, basic commands only
- **Defer:** Advanced features (file editing, state management) to future

**Risk 4:** Mobile responsiveness
- **Mitigation:** Simulator is desktop-focused, show "best viewed on desktop" message
- **Defer:** Full mobile simulator to future (if ever)

---

## SUCCESS METRICS

**Module 7:**
- 5 complete lessons with interactive tasks
- Covers all core Jinja concepts for dbt
- Fits existing lesson patterns
- Average completion time: 60-90 minutes

**Jinja Challenges:**
- 8 challenges across difficulty levels
- Covers variables, loops, macros, packages
- Build on Module 7 lessons
- Average completion time per challenge: 5-15 minutes

**Simulator:**
- Functional terminal accepting dbt commands
- File system viewer showing project structure
- dbt compile, run, ls, test commands work
- Jinja rendering shows before/after
- Users can experiment without local setup

---

## USER DECISIONS (CONFIRMED)

✅ **Module 7:** Implement all 5 lessons at once - complete module immediately available

✅ **Simulator Scope:** Read-only with default project
   - Files are viewable, not editable (MVP)
   - Default sample project only (no custom uploads)
   - Session state resets (no persistence needed)

✅ **Implementation Order:** Module 7 → Challenges → Simulator
   - Week 1-2: All 5 Jinja lessons
   - Week 2: Jinja practice challenges
   - Week 3-5: Simulator (terminal, file viewer, command execution)

✅ **Jinja Syntax Highlighting:** YES - Add to all editors immediately
   - Better learning experience for Jinja syntax
   - Apply to SqlEditor component globally

✅ **Lesson Focus:** Models and macros only (no custom tests, snapshots)
