// Verifica o próprio harness. Roda no check:fast, no validate, no pre-commit e no CI.
//
// 1. Orçamento de contexto: AGENTS.md curto, pontes finas, soma abaixo do limite do Codex.
// 2. Todo caminho citado nos AGENTS.md existe.
// 3. Arquivos gerados em sincronia com as fontes (harness:sync --check).
// 4. Ciclo de vida das specs: status, aprovação presa ao hash, contrato, IDs.
// 5. Planos ativos com as seções que permitem trocar de ferramenta no meio.
// 6. Tarefas de eval válidas.
// 7. Termos privados: lista local fora do git (.harness/local/termos-privados.txt).
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizar } from '../harness/lib/frontmatter.mjs'
import {
  APROVADOS,
  coletarTags,
  hashCorpo,
  listarContratos,
  listarSpecs,
  STATUS,
  TIPOS,
} from '../harness/lib/specs.mjs'

const root = process.cwd()
const erros = []
const avisos = []
const ler = (path) => normalizar(readFileSync(resolve(root, path), 'utf8'))
const existe = (path) => existsSync(resolve(root, path))
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' })

// 1. Orçamento de contexto
const ORCAMENTO = { agentsLinhas: 160, ponteLinhas: 60, somaBytes: 32 * 1024 }
const agentsMd = git('ls-files', '--cached', '--others', '--exclude-standard')
  .split('\n')
  .filter((path) => /(^|\/)AGENTS\.md$/.test(path) && !path.startsWith('node_modules/'))
const raiz = ler('AGENTS.md')
if (raiz.split('\n').length > ORCAMENTO.agentsLinhas) {
  erros.push(
    `LVX-CTX-001: AGENTS.md passou de ${ORCAMENTO.agentsLinhas} linhas; mova detalhe para docs/`,
  )
}
const soma = agentsMd.reduce((total, path) => total + statSync(resolve(root, path)).size, 0)
if (soma > ORCAMENTO.somaBytes) {
  erros.push(`LVX-CTX-002: AGENTS.md somados têm ${soma} bytes (limite ${ORCAMENTO.somaBytes})`)
}
for (const [ponte, exige] of [
  ['CLAUDE.md', '@AGENTS.md'],
  ['GEMINI.md', 'AGENTS.md'],
]) {
  if (!existe(ponte)) {
    erros.push(`LVX-CTX-003: ${ponte} não existe`)
    continue
  }
  const texto = ler(ponte)
  if (!texto.includes(exige)) erros.push(`LVX-CTX-004: ${ponte} precisa apontar ${exige}`)
  if (texto.split('\n').length > ORCAMENTO.ponteLinhas) {
    erros.push(
      `LVX-CTX-005: ${ponte} passou de ${ORCAMENTO.ponteLinhas} linhas; é ponte, não cópia`,
    )
  }
}

// 2. Caminhos citados entre crases nos AGENTS.md
// Arquivo local por decisão (como docs/DECISOES.md) conta como existente.
const ignoradoPeloGit = (path) =>
  spawnSync('git', ['check-ignore', '-q', path], { cwd: root }).status === 0
for (const path of agentsMd) {
  const base = path.includes('/') ? path.slice(0, path.lastIndexOf('/') + 1) : ''
  for (const [, citado] of ler(path).matchAll(/`([^`\s]+)`/g)) {
    if (!/\//.test(citado)) continue
    if (/[<>*{}$]|^https?:|^--|^npm|^@/.test(citado)) continue
    const alvo = citado.replace(/:\d+$/, '').replace(/\/$/, '')
    if (!existe(alvo) && !existe(base + alvo) && !ignoradoPeloGit(alvo)) {
      erros.push(`LVX-CTX-006: ${path} cita \`${citado}\`, que não existe`)
    }
  }
}

// 3. Gerados em sincronia
{
  const sync = spawnSync(process.execPath, ['scripts/harness-sync.mjs', '--check'], {
    cwd: root,
    encoding: 'utf8',
  })
  if (sync.status !== 0) erros.push(sync.stderr.trim() || 'LVX-SYNC: falhou')
}

// 4. Specs
const contratos = new Map(listarContratos(root).map((item) => [item.path, item.contrato]))
const tags = coletarTags(root)
for (const spec of listarSpecs(root)) {
  const { path, file, dados, corpo, temFrontmatter, criterios } = spec
  const onde = `LVX-SPEC (${path})`
  if (!temFrontmatter) {
    erros.push(`${onde}: sem frontmatter; copie docs/specs/_modelo.md`)
    continue
  }
  if (dados.id !== file.replace(/\.md$/, '')) erros.push(`${onde}: id difere do nome do arquivo`)
  if (!STATUS.includes(dados.status))
    erros.push(`${onde}: status "${dados.status}" fora de ${STATUS}`)
  if (!TIPOS.includes(dados.tipo)) erros.push(`${onde}: tipo "${dados.tipo}" fora de ${TIPOS}`)
  if (dados.status === 'proposta' && !/^## Decisões em aberto/m.test(corpo)) {
    avisos.push(`${onde}: proposta sem seção "Decisões em aberto"`)
  }

  if (APROVADOS.has(dados.status)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dados.aprovada_em ?? '')) {
      erros.push(`${onde}: ${dados.status} sem aprovada_em`)
    }
    if (dados.aprovacao !== hashCorpo(corpo)) {
      erros.push(
        `${onde}: o corpo mudou depois da aprovação (${dados.aprovacao ?? 'nenhuma'} ≠ ${hashCorpo(corpo)}). ` +
          'Volte o status para proposta e peça ao PO `npm run spec:aprovar`.',
      )
    }
  }

  const precisaContrato = dados.tipo === 'cena' && ['em-build', 'entregue'].includes(dados.status)
  if (precisaContrato && !dados.contrato) erros.push(`${onde}: cena ${dados.status} sem contrato`)
  if (dados.contrato) {
    const contrato = contratos.get(dados.contrato)
    if (!contrato) {
      erros.push(`${onde}: contrato ${dados.contrato} não existe`)
      continue
    }
    if (contrato.spec && contrato.spec !== path) {
      erros.push(`${onde}: o contrato aponta outra spec (${contrato.spec})`)
    }
    const doContrato = contrato.acceptance.map((criterio) => criterio.id).sort()
    if (criterios.length && JSON.stringify([...criterios].sort()) !== JSON.stringify(doContrato)) {
      erros.push(`${onde}: IDs da spec e do contrato diferem`)
    }
    if (dados.status === 'entregue') {
      for (const criterio of contrato.acceptance) {
        if (criterio.verify !== 'manual' && !tags.has(criterio.id)) {
          erros.push(`${onde}: entregue, mas ${criterio.id} não tem teste`)
        }
      }
    }
  }
  if (!criterios.length && APROVADOS.has(dados.status)) {
    avisos.push(`${onde}: critérios sem ID na spec; o contrato é a fonte (formato legado)`)
  }
}

// 5. Planos ativos
const ativos = resolve(root, 'docs/plans/active')
if (existsSync(ativos)) {
  for (const file of readdirSync(ativos).filter((nome) => nome.endsWith('.md'))) {
    const texto = ler(`docs/plans/active/${file}`)
    for (const secao of ['Spec', 'Escopo de escrita', 'Estado para a próxima sessão']) {
      if (!texto.includes(`## ${secao}`)) {
        erros.push(`LVX-PLANO (docs/plans/active/${file}): falta a seção "${secao}"`)
      }
    }
  }
}

// 6. Evals
{
  const evals = spawnSync(process.execPath, ['scripts/evals.mjs', 'verificar'], {
    cwd: root,
    encoding: 'utf8',
  })
  if (evals.status !== 0) erros.push(evals.stderr.trim() || 'LVX-EVAL: falhou')
}

// 7. Termos privados (lista local, nunca versionada)
{
  const lista = resolve(root, '.harness/local/termos-privados.txt')
  const termos = [
    ...(existsSync(lista) ? readFileSync(lista, 'utf8').split(/\r?\n/) : []),
    ...(process.env.LEOVOX_TERMOS_PRIVADOS ?? '').split(','),
  ]
    .map((termo) => termo.trim())
    .filter((termo) => termo && !termo.startsWith('#'))
  if (termos.length) {
    const padrao = new RegExp(
      termos.map((termo) => termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
      'i',
    )
    const arquivos = git('ls-files', '--cached', '--others', '--exclude-standard')
      .split('\n')
      .filter(
        (path) =>
          path &&
          existe(path) &&
          !/\.(png|jpe?g|webp|avif|gif|webm|mp4|mov|glb|woff2?|ttf|otf|ico|pdf)$/i.test(path),
      )
    let achados = 0
    for (const path of arquivos) {
      const linhas = readFileSync(resolve(root, path), 'utf8').split('\n')
      linhas.forEach((linha, indice) => {
        if (padrao.test(linha)) {
          achados += 1
          erros.push(`LVX-PRIV-001: termo privado em ${path}:${indice + 1}`)
        }
      })
    }
    if (!achados) console.log(`Termos privados: nenhum em ${arquivos.length} arquivos`)
  } else if (!process.env.CI) {
    avisos.push(
      'LVX-PRIV-000: sem lista local de termos privados (.harness/local/termos-privados.txt)',
    )
  }
}

// Hooks de git instalados (só aviso, e nunca no CI)
if (!process.env.CI) {
  const hooksPath = spawnSync('git', ['config', '--get', 'core.hooksPath'], {
    cwd: root,
    encoding: 'utf8',
  }).stdout.trim()
  if (hooksPath !== '.githooks') {
    avisos.push('LVX-HOOK-000: hooks de git não instalados; rode `npm run harness:install`')
  }
}

for (const aviso of avisos) console.warn(`aviso  ${aviso}`)
if (erros.length) {
  for (const erro of erros) console.error(`erro   ${erro}`)
  console.error(`\nharness:check falhou com ${erros.length} erro(s)`)
  process.exit(1)
}
console.log(`harness:check ok (${avisos.length} aviso(s))`)
