import { execFileSync } from 'node:child_process'
import { readCatalog, routeAgents } from '../harness/agents/router.mjs'

const args = process.argv.slice(2)
const baseArg = args.find((arg) => arg.startsWith('--base='))?.slice('--base='.length)
const task = args.find((arg) => arg.startsWith('--task='))?.slice('--task='.length) ?? ''
const explicitPaths = args.filter((arg) => !arg.startsWith('--'))

function changedPaths() {
  if (explicitPaths.length > 0) return explicitPaths
  const base = baseArg || process.env.LEOVOX_HARNESS_BASE || 'HEAD^'
  const output = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], {
    encoding: 'utf8',
  })
  return output.split(/\r?\n/).filter(Boolean)
}

const paths = changedPaths()
const route = routeAgents(readCatalog(), { paths, task })

console.log(`Arquivos avaliados: ${paths.length}`)
for (const selection of route) {
  const reason = selection.reason.policy
    ? selection.reason.policy
    : [...selection.reason.pathHits, ...selection.reason.keywordHits].join(', ') ||
      `requerido por ${selection.reason.requiredBy}`
  console.log(`${selection.phase.padEnd(11)} ${selection.id}: ${reason}`)
  console.log(`  evidência: ${selection.evidence.join(' | ')}`)
}
