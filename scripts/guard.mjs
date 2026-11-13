// Guarda compartilhada pelos hooks das ferramentas de IA.
//
//   node scripts/guard.mjs antes    (PreToolUse do Claude e do Codex, BeforeTool do Gemini)
//   node scripts/guard.mjs depois   (PostToolUse, AfterTool)
//
// Lê o JSON do evento no stdin. Sai com 2 e o motivo no stderr para bloquear; as três
// ferramentas entendem esse contrato. Evento num formato desconhecido passa (exit 0):
// a garantia que não depende de ferramenta são os hooks de git e o CI.
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'

const fase = process.argv[2]

let evento = {}
try {
  const bruto = readFileSync(0, 'utf8')
  evento = bruto.trim() ? JSON.parse(bruto) : {}
} catch {
  process.exit(0)
}

const root =
  process.env.CLAUDE_PROJECT_DIR ?? process.env.GEMINI_PROJECT_DIR ?? evento.cwd ?? process.cwd()

const entrada = evento.tool_input ?? evento.toolInput ?? evento.input ?? {}
const comando = String(entrada.command ?? entrada.cmd ?? '')

// Caminhos tocados: campos de Claude e Gemini, e o cabeçalho do apply_patch do Codex.
const caminhos = [entrada.file_path, entrada.path, entrada.absolute_path, entrada.notebook_path]
  .filter(Boolean)
  .map(String)
for (const [, path] of comando.matchAll(/^\*\*\* (?:Update|Add|Delete) File: (.+)$/gm)) {
  caminhos.push(path.trim())
}
const relativos = caminhos.map((path) =>
  (isAbsolute(path) ? relative(root, path) : path).replaceAll('\\', '/'),
)

function bloquear(motivo) {
  console.error(`Bloqueado pelo harness Leovox: ${motivo}`)
  process.exit(2)
}

const GERADOS = [
  /^\.claude\/agents\//,
  /^\.claude\/skills\//,
  /^\.github\/copilot-instructions\.md$/,
]
const fonteDe = (path) =>
  path.startsWith('.claude/agents/')
    ? 'harness/roles/ e harness/agents/catalog.json'
    : path.startsWith('.claude/skills/')
      ? '.agents/skills/'
      : 'AGENTS.md'

if (fase === 'antes') {
  const regras = [
    [/--no-verify\b/, 'pular os hooks de git não é permitido'],
    [/\bgit\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)/, 'push forçado é decisão do PO'],
    [/\bgit\s+reset\s+--hard\b/, 'reset --hard apaga trabalho; peça ao PO'],
    [/\bgit\s+clean\s+-[a-z]*f/, 'git clean apaga arquivos não versionados; peça ao PO'],
    [/\bwrangler\s+(deploy|publish|secret)\b/, 'deploy e segredos da Cloudflare são do PO'],
    [/\bspec:aprovar\b|spec-aprovar\.mjs/, 'aprovar spec é ato do PO, nunca do agente'],
  ]
  for (const [padrao, motivo] of regras) if (padrao.test(comando)) bloquear(motivo)

  for (const path of relativos) {
    if (GERADOS.some((padrao) => padrao.test(path))) {
      bloquear(`${path} é gerado. Edite ${fonteDe(path)} e rode npm run harness:sync`)
    }
    if (/^\.harness\/local\//.test(path)) bloquear('a lista local de termos privados é do PO')
  }
  process.exit(0)
}

if (fase === 'depois') {
  const travessao = new RegExp('[\u2013\u2014]')
  const achados = []
  for (const path of relativos) {
    const abs = resolve(root, path)
    if (!existsSync(abs) || /\.(png|jpe?g|webp|avif|webm|mp4|glb|woff2?|ttf|otf)$/i.test(path))
      continue
    readFileSync(abs, 'utf8')
      .split('\n')
      .forEach((linha, indice) => {
        if (travessao.test(linha)) achados.push(`${path}:${indice + 1}`)
      })
  }
  if (achados.length) {
    // Exit 2 depois da ferramenta: não desfaz a edição, mas devolve o aviso ao agente.
    console.error(
      `Travessão encontrado (proibido na marca): ${achados.join(', ')}. Troque por vírgula, ponto ou parênteses.`,
    )
    process.exit(2)
  }
  process.exit(0)
}

process.exit(0)
