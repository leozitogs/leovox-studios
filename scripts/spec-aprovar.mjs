// Aprovação de spec. Ato do Product Owner, nunca de agente.
//
//   npm run spec:aprovar -- <id-da-spec>
//
// Grava a data e o hash do corpo no frontmatter. Se o corpo mudar depois,
// `npm run harness:check` acusa a aprovação caducada e a spec volta a pedir
// o PO. Os hooks das ferramentas de IA bloqueiam este comando para agentes.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { escreverFrontmatter, lerFrontmatter } from '../harness/lib/frontmatter.mjs'
import { hashCorpo } from '../harness/lib/specs.mjs'

const id = process.argv[2]
if (!id) {
  console.error('Uso: npm run spec:aprovar -- <id-da-spec>')
  process.exit(1)
}
if (process.env.CI) {
  console.error('LVX-SPEC-APROVAR: aprovação não roda em CI. É um ato do PO.')
  process.exit(1)
}

const path = resolve(process.cwd(), `docs/specs/${id}.md`)
const { dados, corpo } = lerFrontmatter(readFileSync(path, 'utf8'))
if (!['proposta', 'aprovada', 'em-build', 'entregue'].includes(dados.status)) {
  console.error(`LVX-SPEC-APROVAR: ${id} está em "${dados.status}"; só proposta ou já aprovada.`)
  process.exit(1)
}

const hoje = new Date().toISOString().slice(0, 10)
const novo = {
  ...dados,
  status: dados.status === 'proposta' ? 'aprovada' : dados.status,
  aprovada_em: hoje,
  aprovacao: hashCorpo(corpo),
}
writeFileSync(path, escreverFrontmatter(novo, corpo))
console.log(`${id}: ${novo.status} em ${hoje}, aprovação ${novo.aprovacao}`)
