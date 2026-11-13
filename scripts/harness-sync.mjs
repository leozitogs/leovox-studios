// Gera os arquivos de cada ferramenta a partir das fontes do harness.
//
//   npm run harness:sync            escreve os gerados
//   npm run harness:sync -- --check falha se algum gerado divergir da fonte
//
// Fontes (edite aqui):
//   harness/roles/*.md + harness/agents/catalog.json  papéis da squad
//   harness/agents/contrato-comum.md                  regras comuns dos papéis
//   .agents/skills/<nome>/                            fluxos (padrão Agent Skills)
//   AGENTS.md e AGENTS.md aninhados                   contexto
//
// Gerados (não edite):
//   .claude/agents/*.md               subagentes do Claude Code
//   .claude/skills/<nome>/            cópia das skills para o Claude Code
//   <pasta>/CLAUDE.md                 ponte de cada AGENTS.md aninhado
//   .github/copilot-instructions.md   núcleo do AGENTS.md para o Copilot
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { lerFrontmatter, normalizar } from '../harness/lib/frontmatter.mjs'

const root = process.cwd()
const check = process.argv.includes('--check')
const MARCA = 'GERADO por npm run harness:sync'
const IGNORAR = new Set([
  'node_modules',
  '.git',
  'dist',
  '.wrangler',
  'playwright-report',
  'test-results',
])

const ler = (path) => normalizar(readFileSync(resolve(root, path), 'utf8'))
const rel = (path) => relative(root, path).replaceAll('\\', '/')
const banner = (fonte) => `<!-- ${MARCA} a partir de ${fonte}. Edite a fonte, não este arquivo. -->`

function listar(dir, filtro = () => true) {
  const abs = resolve(root, dir)
  if (!existsSync(abs)) return []
  const saida = []
  for (const entrada of readdirSync(abs, { withFileTypes: true })) {
    if (IGNORAR.has(entrada.name)) continue
    const caminho = join(abs, entrada.name)
    if (entrada.isDirectory()) saida.push(...listar(rel(caminho), filtro))
    else if (filtro(rel(caminho))) saida.push(rel(caminho))
  }
  return saida.sort()
}

const esperados = new Map()

// 1. Papéis viram subagentes do Claude Code.
const catalogo = JSON.parse(ler('harness/agents/catalog.json'))
const contrato = ler('harness/agents/contrato-comum.md').trim()
for (const agente of catalogo.agents) {
  const { dados, corpo } = lerFrontmatter(ler(agente.file))
  if (!agente.claude) throw new Error(`LVX-SYNC-001: ${agente.id} sem bloco "claude" no catálogo`)
  const frente = [
    '---',
    `name: ${dados.name}`,
    `description: ${dados.description}`,
    `tools: ${agente.claude.tools.join(', ')}`,
    `model: ${agente.claude.model}`,
    '---',
  ].join('\n')
  esperados.set(
    `.claude/agents/${agente.id}.md`,
    `${frente}\n\n${banner(agente.file)}\n${corpo.trimEnd()}\n\n${contrato}\n`,
  )
}

// 2. Skills: .agents/skills é a fonte; o Claude Code lê .claude/skills.
for (const arquivo of listar('.agents/skills')) {
  const destino = arquivo.replace(/^\.agents\/skills\//, '.claude/skills/')
  let conteudo = ler(arquivo)
  if (arquivo.endsWith('/SKILL.md')) {
    const { temFrontmatter } = lerFrontmatter(conteudo)
    if (!temFrontmatter) throw new Error(`LVX-SYNC-002: ${arquivo} sem frontmatter`)
    const fim = conteudo.indexOf('\n---', 4) + 4
    conteudo = `${conteudo.slice(0, fim)}\n${banner(arquivo)}${conteudo.slice(fim)}`
  }
  esperados.set(destino, conteudo)
}

// 3. Cada AGENTS.md aninhado ganha a ponte CLAUDE.md ao lado.
for (const arquivo of listar('.', (path) => /(^|\/)AGENTS\.md$/.test(path))) {
  if (arquivo === 'AGENTS.md' || arquivo.startsWith('.')) continue
  esperados.set(`${dirname(arquivo)}/CLAUDE.md`, `${banner(arquivo)}\n\n@AGENTS.md\n`)
}

// 4. Copilot no github.com não lê AGENTS.md: recebe o núcleo dele.
{
  const agents = ler('AGENTS.md')
  const secoes = ['Regras que não podem regredir', 'Comandos']
  const partes = secoes.map((titulo) => {
    const inicio = agents.indexOf(`## ${titulo}`)
    if (inicio < 0) throw new Error(`LVX-SYNC-003: AGENTS.md sem a seção "${titulo}"`)
    const fim = agents.indexOf('\n## ', inicio + 3)
    return agents.slice(inicio, fim < 0 ? undefined : fim).trim()
  })
  esperados.set(
    '.github/copilot-instructions.md',
    [
      banner('AGENTS.md'),
      '',
      '# Leovox Portfolio · instruções para o Copilot',
      '',
      'A fonte completa é o `AGENTS.md` da raiz. Este arquivo repete só o núcleo, para as',
      'superfícies do Copilot que não leem o `AGENTS.md` (chat e revisão no github.com).',
      '',
      ...partes.flatMap((parte) => [parte, '']),
    ].join('\n'),
  )
}

// Órfãos: arquivo gerado que nenhuma fonte produz mais.
const pastasGeradas = ['.claude/agents', '.claude/skills']
const orfaos = [
  ...pastasGeradas.flatMap((dir) => listar(dir)),
  ...listar('.', (path) => /(^|\/)CLAUDE\.md$/.test(path) && path !== 'CLAUDE.md').filter((path) =>
    ler(path).includes(MARCA),
  ),
].filter((path) => !esperados.has(path))

const divergentes = []
for (const [path, conteudo] of esperados) {
  const abs = resolve(root, path)
  const atual = existsSync(abs) ? normalizar(readFileSync(abs, 'utf8')) : null
  if (atual === conteudo) continue
  divergentes.push(path)
  if (!check) {
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, conteudo)
  }
}
if (!check) for (const path of orfaos) rmSync(resolve(root, path))

if (check && (divergentes.length || orfaos.length)) {
  const linhas = [
    ...divergentes.map((path) => `  divergente: ${path}`),
    ...orfaos.map((path) => `  órfão:      ${path}`),
  ]
  console.error(`LVX-SYNC-004: gerados fora de sincronia com as fontes\n${linhas.join('\n')}`)
  console.error('Rode `npm run harness:sync` e confira o diff.')
  process.exit(1)
}

console.log(
  check
    ? `Gerados em sincronia: ${esperados.size} arquivos`
    : `harness:sync: ${divergentes.length} escritos, ${orfaos.length} removidos, ${esperados.size} no total`,
)
