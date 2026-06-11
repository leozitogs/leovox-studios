// Checagem de marca: travessão banido em todo e qualquer conteúdo Leovox.
// Varre o repositório inteiro (código, copy, markdown, css, configs) e falha
// se encontrar travessão (em dash) ou meia-risca (en dash).
//
// Exceção única: docs/ guarda documentos de referência copiados verbatim
// da identidade da marca e o contexto do projeto; não são conteúdo produzido
// neste repositório e ficam fora do escopo da varredura.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git', '.vite', 'docs'])

// .txt fica fora: os unicos txt do repo sao metadados de terceiros
// (licencas de fontes do Google etc.), que nao sao conteudo Leovox.
const TEXT_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.html',
  '.md',
  '.json',
  '.yml',
  '.yaml',
  '.svg',
])

// Escapes unicode de propósito: este arquivo também é varrido.
const BANNED = [
  { char: '\u2014', name: 'travessão (em dash)' },
  { char: '\u2013', name: 'meia-risca (en dash)' },
]

function hasTextExtension(name) {
  const dot = name.lastIndexOf('.')
  if (dot < 0) return false
  return TEXT_EXTENSIONS.has(name.slice(dot).toLowerCase())
}

function walk(dir, violations) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)

    let stats
    try {
      stats = statSync(fullPath)
    } catch {
      continue // entrada inacessível (sync de arquivos em andamento)
    }

    if (stats.isDirectory()) {
      if (!IGNORED_DIRS.has(entry)) walk(fullPath, violations)
      continue
    }

    if (!hasTextExtension(entry)) continue

    let content
    try {
      content = readFileSync(fullPath, 'utf8')
    } catch {
      continue // arquivo inacessível no momento da varredura
    }

    const lines = content.split('\n')
    lines.forEach((line, index) => {
      for (const banned of BANNED) {
        if (line.includes(banned.char)) {
          violations.push({
            file: relative(ROOT, fullPath),
            line: index + 1,
            name: banned.name,
          })
        }
      }
    })
  }
}

const violations = []
walk(ROOT, violations)

if (violations.length > 0) {
  console.error('REPROVADO: travessão encontrado. Regra absoluta da marca Leovox.')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} contém ${v.name}`)
  }
  process.exit(1)
}

console.log('OK: nenhum travessão ou meia-risca no conteúdo do repositório.')
