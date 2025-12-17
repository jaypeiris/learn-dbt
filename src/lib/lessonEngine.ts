import type { LessonDefinition, LessonIndexEntry } from '../../types/lesson'
import lessonIndexRaw from '../data/lessons/lesson_index.json'
import lesson01Raw from '../data/lessons/module_01_models_refs/lesson_01_models_are_sql.lesson.json'
import lesson02Raw from '../data/lessons/module_01_models_refs/lesson_02_why_ref.lesson.json'
import lesson03Raw from '../data/lessons/module_01_models_refs/lesson_03_dependencies_build_order.lesson.json'
import lesson04Raw from '../data/lessons/module_01_models_refs/lesson_04_what_dbt_learns.lesson.json'
import lessonCapstoneRaw from '../data/lessons/module_01_models_refs/capstone_make_dbt_see_model.lesson.json'
import module02Lesson01Raw from '../data/lessons/module_02_project_structure/lesson_01_why_staging.lesson.json'
import module02Lesson02Raw from '../data/lessons/module_02_project_structure/lesson_02_staging_boring.lesson.json'
import module02Lesson03Raw from '../data/lessons/module_02_project_structure/lesson_03_intermediate.lesson.json'
import module02Lesson04Raw from '../data/lessons/module_02_project_structure/lesson_04_marts.lesson.json'
import module02Lesson05Raw from '../data/lessons/module_02_project_structure/lesson_05_layers_reasoning.lesson.json'
import module02Lesson06Raw from '../data/lessons/module_02_project_structure/lesson_06_grain.lesson.json'
import module03Lesson01Raw from '../data/lessons/module_03_materializations/lesson_01_what_is_materialization.lesson.json'
import module03Lesson02Raw from '../data/lessons/module_03_materializations/lesson_02_view_vs_table.lesson.json'
import module03Lesson03Raw from '../data/lessons/module_03_materializations/lesson_03_incremental.lesson.json'
import module03Lesson04Raw from '../data/lessons/module_03_materializations/lesson_04_ephemeral.lesson.json'
import module03Lesson05Raw from '../data/lessons/module_03_materializations/lesson_05_intent.lesson.json'
import module04Lesson01Raw from '../data/lessons/module_04_tests_docs_exposures/lesson_01_tests_are_questions.lesson.json'
import module04Lesson02Raw from '../data/lessons/module_04_tests_docs_exposures/lesson_02_tests_attach.lesson.json'
import module04Lesson03Raw from '../data/lessons/module_04_tests_docs_exposures/lesson_03_documentation.lesson.json'
import module04Lesson04Raw from '../data/lessons/module_04_tests_docs_exposures/lesson_04_exposures.lesson.json'
import module04Lesson05Raw from '../data/lessons/module_04_tests_docs_exposures/lesson_05_glue.lesson.json'
import module05Lesson01Raw from '../data/lessons/module_05_snapshots/module_05_lesson_01_current_vs_historical.lesson.json'
import module05Lesson02Raw from '../data/lessons/module_05_snapshots/module_05_lesson_02_why_change_matters.lesson.json'
import module05Lesson03Raw from '../data/lessons/module_05_snapshots/module_05_lesson_03_what_snapshots_represent.lesson.json'
import module05Lesson04Raw from '../data/lessons/module_05_snapshots/module_05_lesson_04_snapshots_vs_models.lesson.json'
import module05Lesson05Raw from '../data/lessons/module_05_snapshots/module_05_lesson_05_when_to_use_snapshots.lesson.json'
import module06Lesson01Raw from '../data/lessons/module_06_manifest_view/module_06_lesson_01_graph_not_script.lesson.json'
import module06Lesson02Raw from '../data/lessons/module_06_manifest_view/module_06_lesson_02_model_metadata.lesson.json'
import module06Lesson03Raw from '../data/lessons/module_06_manifest_view/module_06_lesson_03_node_types.lesson.json'
import module06Lesson04Raw from '../data/lessons/module_06_manifest_view/module_06_lesson_04_why_compilation.lesson.json'
import module06Lesson05Raw from '../data/lessons/module_06_manifest_view/module_06_lesson_05_mental_model.lesson.json'
import module07Lesson01Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_01_variables_and_loops.lesson.json'
import module07Lesson02Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_02_writing_macros.lesson.json'
import module07Lesson03Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_03_builtin_functions.lesson.json'
import module07Lesson04Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_04_packages.lesson.json'
import module07Lesson05Raw from '../data/lessons/module_07_jinja_macros/module_07_lesson_05_dynamic_sql.lesson.json'
import introLessonRaw from '../data/lessons/intro_to_refs.lesson.json'
import incrementalLessonRaw from '../data/lessons/incremental_materializations.lesson.json'

const lessonIndex = lessonIndexRaw as LessonIndexEntry[]

function normalizeLessonDefinition(raw: unknown): LessonDefinition {
  const source = raw as Record<string, unknown>

  const starterState = (source.starterState ?? source.starter_state) as LessonDefinition['starterState']
  const revealSections = (source.revealSections ?? source.reveal_sections) as LessonDefinition['revealSections']
  const successMessage = (source.successMessage ?? source.success_message) as LessonDefinition['successMessage']

  return {
    ...(raw as LessonDefinition),
    starterState,
    revealSections,
    successMessage,
  }
}

const lessonDefinitions: LessonDefinition[] = [
  lesson01Raw,
  lesson02Raw,
  lesson03Raw,
  lesson04Raw,
  lessonCapstoneRaw,
  module02Lesson01Raw,
  module02Lesson02Raw,
  module02Lesson03Raw,
  module02Lesson04Raw,
  module02Lesson05Raw,
  module02Lesson06Raw,
  module03Lesson01Raw,
  module03Lesson02Raw,
  module03Lesson03Raw,
  module03Lesson04Raw,
  module03Lesson05Raw,
  module04Lesson01Raw,
  module04Lesson02Raw,
  module04Lesson03Raw,
  module04Lesson04Raw,
  module04Lesson05Raw,
  module05Lesson01Raw,
  module05Lesson02Raw,
  module05Lesson03Raw,
  module05Lesson04Raw,
  module05Lesson05Raw,
  module06Lesson01Raw,
  module06Lesson02Raw,
  module06Lesson03Raw,
  module06Lesson04Raw,
  module06Lesson05Raw,
  module07Lesson01Raw,
  module07Lesson02Raw,
  module07Lesson03Raw,
  module07Lesson04Raw,
  module07Lesson05Raw,
  introLessonRaw,
  incrementalLessonRaw,
].map((definition) => normalizeLessonDefinition(definition))

/**
 * Current architecture: Lessons are statically imported and registered in a map.
 * This provides type safety and explicit control over lesson loading.
 * 
 * Future enhancement: Consider a dynamic module registration system that allows
 * new modules to register themselves at runtime, enabling easier extensibility
 * for community-contributed content or plugin-based lesson modules.
 */
const lessonMap: Record<string, LessonDefinition> = lessonDefinitions.reduce((map, lesson) => {
  map[lesson.id] = lesson
  return map
}, {} as Record<string, LessonDefinition>)

export function getLessonIndex(): LessonIndexEntry[] {
  return lessonIndex
}

export function getLessonById(id: string): LessonDefinition | undefined {
  return lessonMap[id]
}

export function getDefaultLessonId(): string {
  return lessonIndex[0]?.id ?? ''
}
