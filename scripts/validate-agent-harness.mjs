import { readdirSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { readCatalog, routeAgents } from '../harness/agents/router.mjs'

const root = process.cwd()
const catalog = readCatalog(root)
const allowedPhases = new Set(['orchestrate', 'plan', 'build', 'polish', 'evaluate'])
const ids = new Set()

function fail(code, message) {
  throw new Error(`${code}: ${message}`)
}

for (const agent of catalog.agents) {
  if (ids.has(agent.id)) fail('LVX-AGENT-001', `agente duplicado: ${agent.id}`)
  ids.add(agent.id)
  if (!allowedPhases.has(agent.phase)) fail('LVX-AGENT-002', `fase inválida: ${agent.id}`)
  if (!Array.isArray(agent.evidence) || agent.evidence.length === 0) {
    fail('LVX-AGENT-003', `evidência ausente: ${agent.id}`)
  }

  const source = readFileSync(resolve(root, agent.file), 'utf8')
  const declaredName = source.match(/^name:\s*(.+)$/m)?.[1]?.trim()
  if (declaredName !== agent.id) {
    fail('LVX-AGENT-004', `${agent.file} declara ${declaredName ?? 'nenhum nome'}`)
  }
}

for (const agent of catalog.agents) {
  for (const requirement of agent.requires) {
    if (!ids.has(requirement))
      fail('LVX-AGENT-005', `${agent.id} requer agente inexistente ${requirement}`)
    if (requirement === agent.id) fail('LVX-AGENT-006', `${agent.id} requer a si mesmo`)
  }
}

const files = readdirSync(resolve(root, catalog.sourceDirectory))
  .filter((file) => file.endsWith('.md'))
  .map((file) => basename(file, '.md'))
  .sort()
const registered = [...ids].sort()
if (JSON.stringify(files) !== JSON.stringify(registered)) {
  fail('LVX-AGENT-007', 'catálogo e .claude/agents estão divergentes')
}

for (const reviewer of catalog.policy.alwaysReviewers) {
  const agent = catalog.agents.find((candidate) => candidate.id === reviewer)
  if (!agent || agent.phase !== 'evaluate' || agent.writesProduction) {
    fail('LVX-AGENT-008', `revisor obrigatório inválido: ${reviewer}`)
  }
}

const scrollRoute = routeAgents(catalog, {
  paths: ['src/scenes/Pilares/usePilaresScroll.ts'],
  task: 'corrigir scroll reverse e timeline',
}).map(({ id }) => id)
for (const expected of [
  'leovox-scroll-storyteller',
  'leovox-animation-engineer',
  'leovox-brand-guard',
  'leovox-a11y-auditor',
]) {
  if (!scrollRoute.includes(expected))
    fail('LVX-AGENT-009', `rota de scroll não inclui ${expected}`)
}

const catalogRoute = routeAgents(catalog, {
  paths: ['harness/agents/catalog.json'],
  task: 'atualizar catálogo do harness',
}).map(({ id }) => id)
if (!catalogRoute.includes('leovox-conductor')) {
  fail('LVX-AGENT-010', 'mudança no catálogo não aciona o conductor')
}

console.log(`Harness de agentes válido: ${registered.length} agentes, 2 cenários de roteamento`)
