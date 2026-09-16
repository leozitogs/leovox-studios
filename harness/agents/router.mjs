import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function readCatalog(root = process.cwd()) {
  return JSON.parse(readFileSync(resolve(root, 'harness/agents/catalog.json'), 'utf8'))
}

function matches(agent, paths, task) {
  const normalizedTask = task.toLocaleLowerCase('pt-BR')
  const pathHits = paths.filter((path) =>
    agent.pathPatterns.some((pattern) => new RegExp(pattern, 'i').test(path)),
  )
  const keywordHits = agent.keywords.filter((keyword) =>
    normalizedTask.includes(keyword.toLocaleLowerCase('pt-BR')),
  )
  return { score: pathHits.length * 3 + keywordHits.length, pathHits, keywordHits }
}

export function routeAgents(catalog, { paths = [], task = '' } = {}) {
  const normalizedPaths = paths.map((path) => path.replaceAll('\\', '/'))
  const byId = new Map(catalog.agents.map((agent) => [agent.id, agent]))
  const selected = new Map()

  for (const agent of catalog.agents) {
    if (agent.phase === 'orchestrate') continue
    const match = matches(agent, normalizedPaths, task)
    if (match.score > 0) selected.set(agent.id, { agent, reason: match })
  }

  const addWithRequirements = (id, reason) => {
    const agent = byId.get(id)
    if (!agent) return
    if (!selected.has(id)) selected.set(id, { agent, reason })
    for (const required of agent.requires) {
      addWithRequirements(required, { score: 0, requiredBy: id, pathHits: [], keywordHits: [] })
    }
  }

  for (const [id, selection] of [...selected]) addWithRequirements(id, selection.reason)
  for (const id of catalog.policy.alwaysReviewers) {
    addWithRequirements(id, { score: 0, policy: 'always-reviewer', pathHits: [], keywordHits: [] })
  }

  const domains = new Set(
    [...selected.values()]
      .filter(({ agent }) => agent.phase !== 'evaluate')
      .flatMap(({ agent }) => agent.domains),
  )
  const touchesCatalog = normalizedPaths.some((path) =>
    /^(AGENTS|CLAUDE)\.md$|^\.claude\/|^harness\/agents\/|^docs\/harness\//.test(path),
  )
  if (domains.size >= catalog.policy.conductorDomainThreshold || touchesCatalog) {
    addWithRequirements('leovox-conductor', {
      score: 0,
      policy: touchesCatalog ? 'catalog-governance' : 'multi-domain',
      pathHits: [],
      keywordHits: [],
    })
  }

  const phaseOrder = ['orchestrate', 'plan', 'build', 'polish', 'evaluate']
  return [...selected.values()]
    .sort(
      (a, b) =>
        phaseOrder.indexOf(a.agent.phase) - phaseOrder.indexOf(b.agent.phase) ||
        a.agent.id.localeCompare(b.agent.id),
    )
    .map(({ agent, reason }) => ({
      id: agent.id,
      phase: agent.phase,
      writesProduction: agent.writesProduction,
      evidence: agent.evidence,
      reason,
    }))
}
