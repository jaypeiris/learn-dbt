export type ParsedSql = {
  refs: string[]
  materialization: string
  columns: string[]
}

const REF_REGEX = /ref\(\s*['"]([\w\-_]+)['"]\s*\)/gi
const MATERIALIZATION_REGEX = /materialized\s*=\s*['"]([\w_]+)['"]/i

export function parseSqlModel(sql: string): ParsedSql {
  const refs = Array.from(sql.matchAll(REF_REGEX)).map((match) => match[1])
  const materialization = detectMaterialization(sql)
  const columns = detectColumns(sql)

  return { refs, materialization, columns }
}

function detectMaterialization(sql: string): string {
  const result = sql.match(MATERIALIZATION_REGEX)
  if (!result) {
    return 'view'
  }
  return result[1].toLowerCase()
}

function detectColumns(sql: string): string[] {
  const selectMatch = sql.match(/select([\s\S]*?)from/i)
  if (!selectMatch) {
    return []
  }

  const columnCandidates = selectMatch[1]
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean)

  const aliases = columnCandidates.map((column) => {
    const aliasMatch = column.match(/\s+as\s+([\w_]+)/i)
    if (aliasMatch) {
      return aliasMatch[1]
    }
    const bare = column.replace(/["`]/g, '').split(/\s+/)[0]
    return bare
  })

  return Array.from(new Set(aliases.filter(Boolean)))
}
