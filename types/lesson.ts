export type LessonCheck =
  | { type: 'includes_ref'; value: string; hint: string }
  | { type: 'materialization'; value: string; hint: string }
  | { type: 'mentions_column'; value: string; hint: string }
  | { type: 'contains_text'; value: string; hint: string }
  | { type: 'min_unique_refs'; value: number; hint: string }

export type LessonTask = {
  id: string
  prompt: string
  check: LessonCheck
}

export type LessonModel = {
  id: string
  title: string
  description: string
  sql: string
  editable: boolean
  variant?: 'model' | 'snapshot'
}

export type LessonAnnotationItem = {
  label: string
  description: string
}

export type LessonAnnotations = {
  tests?: LessonAnnotationItem[]
  docs?: LessonAnnotationItem[]
  exposures?: LessonAnnotationItem[]
  snapshots?: LessonAnnotationItem[]
}

export type LessonRevealSection = {
  title: string
  body: string
}

export type LessonComparisonSide = {
  label: string
  code: string
}

export type LessonComparison = {
  title: string
  left: LessonComparisonSide
  right: LessonComparisonSide
  note?: string
}

export type LessonFeatureFlags = {
  showManifestExplorer?: boolean
}

export type LessonDefinition = {
  id: string
  title: string
  summary: string
  description: string
  concept: string
  models: LessonModel[]
  tasks: LessonTask[]
  annotations?: LessonAnnotations
  starterState?: string
  hint?: string
  revealSections?: LessonRevealSection[]
  comparisons?: LessonComparison[]
  takeaway?: string
  features?: LessonFeatureFlags
  successMessage?: string
}

export type LessonIndexEntry = {
  id: string
  title: string
  summary: string
}
