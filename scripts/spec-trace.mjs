// Rastreio spec → contrato → teste.
//
//   npm run spec:trace              tabela de cobertura por critério
//   npm run spec:trace -- --strict  falha se critério automático não tem teste
//                                   ou se um teste cita critério inexistente
//
// Um teste cobre um critério quando o título de test(), it() ou describe()
// traz o ID entre colchetes: test('[PIL-04] parado no meio...').
import { coletarTags, listarContratos } from '../harness/lib/specs.mjs'

const root = process.cwd()
const strict = process.argv.includes('--strict')
const tags = coletarTags(root)
const conhecidos = new Set()
const erros = []
let automaticos = 0
let cobertos = 0
let manuais = 0

for (const { file, contrato } of listarContratos(root)) {
  console.log(`\n${contrato.id} (${file})`)
  for (const criterio of contrato.acceptance) {
    conhecidos.add(criterio.id)
    const onde = tags.get(criterio.id) ?? []
    if (criterio.verify === 'manual') {
      manuais += 1
      console.log(
        `  ${criterio.id}  manual   ${onde.length ? onde.join(', ') : 'QA do PO e plano'}`,
      )
      continue
    }
    automaticos += 1
    if (onde.length) cobertos += 1
    else
      erros.push(
        `LVX-TRACE-001: ${criterio.id} pede verify "${criterio.verify}" e nenhum teste o cita`,
      )
    console.log(
      `  ${criterio.id}  ${criterio.verify.padEnd(7)}  ${onde.length ? onde.join(', ') : 'SEM TESTE'}`,
    )
  }
}

for (const [id, onde] of tags) {
  if (!conhecidos.has(id)) {
    erros.push(`LVX-TRACE-002: ${onde.join(', ')} cita ${id}, que não existe em contrato nenhum`)
  }
}

console.log(
  `\nCobertura: ${cobertos}/${automaticos} critérios automáticos com teste, ${manuais} manuais`,
)
if (erros.length) {
  for (const erro of erros) console.error(erro)
  if (strict) process.exit(1)
}
