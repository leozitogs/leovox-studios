// Avaliação de agentes, modelos e ferramentas com tarefas reais do projeto.
//
//   npm run evals -- listar
//   npm run evals -- verificar                     valida as tarefas (roda no harness:check)
//   npm run evals -- preparar <id>                 cópia limpa da base, sem histórico
//   npm run evals -- avaliar <id> --ferramenta=codex --modelo=gpt-x
//
// O fluxo é igual para qualquer ferramenta: preparar, abrir a ferramenta na pasta
// preparada, colar o PEDIDO-EVAL.md, deixar trabalhar e avaliar. O oráculo (testes
// da correção real) só entra na pasta na hora de avaliar, então o agente não o vê.
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const root = process.cwd()
const DIR_TAREFAS = resolve(root, 'evals/tasks')
const DIR_TRABALHO = resolve(root, 'evals/.trabalho')
const DIR_RESULTADOS = resolve(root, 'evals/resultados')
const [comando, id] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'))
const opcao = (nome) =>
  process.argv.find((arg) => arg.startsWith(`--${nome}=`))?.slice(nome.length + 3) ?? null

function tarefas() {
  if (!existsSync(DIR_TAREFAS)) return []
  return readdirSync(DIR_TAREFAS)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => ({ file, tarefa: JSON.parse(readFileSync(resolve(DIR_TAREFAS, file), 'utf8')) }))
}

function validar() {
  const erros = []
  const ids = new Set()
  for (const { file, tarefa } of tarefas()) {
    const onde = `LVX-EVAL (${file})`
    for (const campo of ['id', 'tipo', 'origem', 'base', 'pedido', 'avaliar', 'proibido']) {
      if (!(campo in tarefa)) erros.push(`${onde}: falta ${campo}`)
    }
    if (tarefa.id !== file.replace(/\.json$/, '')) erros.push(`${onde}: id difere do arquivo`)
    if (ids.has(tarefa.id)) erros.push(`${onde}: id repetido`)
    ids.add(tarefa.id)
    if (!['bug', 'feature', 'marca', 'movimento', 'harness'].includes(tarefa.tipo)) {
      erros.push(`${onde}: tipo inválido`)
    }
    if (!['historico', 'sintetica'].includes(tarefa.origem)) erros.push(`${onde}: origem inválida`)
    if (!/^[0-9a-f]{7,40}$/.test(tarefa.base ?? ''))
      erros.push(`${onde}: base precisa ser um commit`)
    if (!Array.isArray(tarefa.avaliar) || tarefa.avaliar.length === 0) {
      erros.push(`${onde}: avaliar precisa de ao menos um comando`)
    }
    const oraculo = tarefa.oraculo
    if (oraculo && (!Array.isArray(oraculo.arquivos) || !oraculo.arquivos.length)) {
      erros.push(`${onde}: oráculo sem arquivos`)
    }
    if (oraculo?.commit && !/^[0-9a-f]{7,40}$/.test(oraculo.commit)) {
      erros.push(`${onde}: oraculo.commit inválido`)
    }
  }
  return erros
}

function buscar(idTarefa) {
  const achada = tarefas().find(({ tarefa }) => tarefa.id === idTarefa)
  if (!achada) throw new Error(`tarefa ${idTarefa} não existe; veja \`npm run evals -- listar\``)
  return achada.tarefa
}

function sh(cmd, cwd) {
  return spawnSync(cmd, { cwd, shell: true, encoding: 'utf8', stdio: 'pipe' })
}

function preparar(tarefa) {
  const destino = resolve(DIR_TRABALHO, tarefa.id)
  if (existsSync(destino)) rmSync(destino, { recursive: true, force: true })
  mkdirSync(destino, { recursive: true })
  // Só os arquivos da base, sem histórico: o agente não acha a correção no log.
  // Índice temporário para não tocar o índice do repositório de verdade.
  const indice = resolve(DIR_TRABALHO, `.indice-${tarefa.id}`)
  execFileSync(
    'git',
    ['-c', 'core.autocrlf=false', `--work-tree=${destino}`, 'checkout', tarefa.base, '--', '.'],
    { cwd: root, env: { ...process.env, GIT_INDEX_FILE: indice }, stdio: 'pipe' },
  )
  rmSync(indice, { force: true })
  const pedido = [
    `# Tarefa de avaliação: ${tarefa.id}`,
    '',
    tarefa.pedido,
    '',
    ...(tarefa.contexto ? ['## Contexto', '', tarefa.contexto, ''] : []),
    '## Regras',
    '',
    '- Siga o AGENTS.md deste repositório.',
    ...tarefa.proibido.map((item) => `- Proibido: ${item}`),
    '',
  ].join('\n')
  writeFileSync(resolve(destino, 'PEDIDO-EVAL.md'), pedido)
  const g = [
    '-c',
    'core.autocrlf=false',
    '-c',
    'user.name=eval',
    '-c',
    'user.email=eval@localhost',
    '-c',
    'commit.gpgsign=false',
  ]
  execFileSync('git', ['init', '-q'], { cwd: destino })
  execFileSync('git', [...g, 'add', '-A'], { cwd: destino })
  execFileSync('git', [...g, 'commit', '-q', '-m', 'base da tarefa', '--no-verify'], {
    cwd: destino,
  })
  console.log(`Pronto em ${destino}`)
  console.log('1. Rode `npm ci` lá dentro.')
  console.log('2. Abra a ferramenta nessa pasta e entregue o PEDIDO-EVAL.md como pedido.')
  console.log(
    `3. Depois: npm run evals -- avaliar ${tarefa.id} --ferramenta=<nome> --modelo=<nome>`,
  )
}

function avaliar(tarefa) {
  const pasta = opcao('dir') ? resolve(opcao('dir')) : resolve(DIR_TRABALHO, tarefa.id)
  if (!existsSync(pasta)) throw new Error(`${pasta} não existe; rode preparar antes`)
  const diff = sh(
    'git -c core.autocrlf=false add -A && git diff --cached --shortstat HEAD',
    pasta,
  ).stdout.trim()
  const tocados = sh('git diff --cached --name-only HEAD', pasta)
    .stdout.trim()
    .split('\n')
    .filter(Boolean)

  if (tarefa.oraculo) {
    for (const arquivo of tarefa.oraculo.arquivos) {
      const conteudo = tarefa.oraculo.commit
        ? execFileSync('git', ['show', `${tarefa.oraculo.commit}:${arquivo}`], { cwd: root })
        : readFileSync(resolve(root, arquivo))
      mkdirSync(dirname(resolve(pasta, arquivo)), { recursive: true })
      writeFileSync(resolve(pasta, arquivo), conteudo)
    }
  }

  const passos = tarefa.avaliar.map((passo) => {
    const { cmd, espera = 'sucesso' } = typeof passo === 'string' ? { cmd: passo } : passo
    const inicio = Date.now()
    const saida = sh(cmd, pasta)
    const ok = espera === 'falha' ? saida.status !== 0 : saida.status === 0
    console.log(`${ok ? 'ok   ' : 'FALHA'} ${cmd}${espera === 'falha' ? ' (deve falhar)' : ''}`)
    if (!ok) console.log((saida.stdout + saida.stderr).split('\n').slice(-15).join('\n'))
    return { cmd, espera, ok, ms: Date.now() - inicio }
  })
  const proibidosTocados = (tarefa.naoTocar ?? []).filter((prefixo) =>
    tocados.some((arquivo) => arquivo.startsWith(prefixo)),
  )

  const resultado = {
    tarefa: tarefa.id,
    quando: new Date().toISOString(),
    ferramenta: opcao('ferramenta'),
    modelo: opcao('modelo'),
    passou: passos.every((passo) => passo.ok) && proibidosTocados.length === 0,
    passos,
    diff,
    arquivosTocados: tocados.length,
    foraDoEscopo: proibidosTocados,
    rubrica: tarefa.rubrica ?? null,
    notaDoPO: null,
  }
  mkdirSync(DIR_RESULTADOS, { recursive: true })
  const nome = `${tarefa.id}-${resultado.quando.replace(/[:.]/g, '-')}.json`
  writeFileSync(resolve(DIR_RESULTADOS, nome), `${JSON.stringify(resultado, null, 2)}\n`)
  console.log(`\n${resultado.passou ? 'PASSOU' : 'NÃO PASSOU'} · ${diff || 'sem diff'}`)
  console.log(`Resultado em evals/resultados/${nome}`)
  if (!resultado.passou) process.exitCode = 1
}

if (comando === 'verificar') {
  const erros = validar()
  if (erros.length) {
    console.error(erros.join('\n'))
    process.exit(1)
  }
  console.log(`Tarefas de eval válidas: ${tarefas().length}`)
} else if (comando === 'listar') {
  for (const { tarefa } of tarefas()) {
    console.log(
      `${tarefa.id.padEnd(24)} ${tarefa.tipo.padEnd(10)} ${tarefa.origem.padEnd(10)} base ${tarefa.base.slice(0, 7)}`,
    )
  }
} else if (comando === 'preparar' && id) {
  preparar(buscar(id))
} else if (comando === 'avaliar' && id) {
  avaliar(buscar(id))
} else {
  console.error('Uso: npm run evals -- <listar|verificar|preparar <id>|avaliar <id>>')
  process.exit(1)
}
