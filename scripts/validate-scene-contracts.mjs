import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { listarContratos, PADRAO_ID, VERIFICACOES } from '../harness/lib/specs.mjs'

const root = process.cwd()
const required = ['id', 'title', 'route', 'viewports', 'states', 'acceptance', 'forbidden']
const ids = new Set()
const criterios = new Set()
const contratos = listarContratos(root)

if (contratos.length === 0) throw new Error('LVX-CONTRACT-001: nenhum contrato de cena encontrado')

for (const { file, contrato } of contratos) {
  for (const field of required) {
    if (!(field in contrato)) {
      throw new Error(`LVX-CONTRACT-002: ${file} não declara ${field}`)
    }
  }
  if (!/^[a-z][a-z0-9-]+$/.test(contrato.id)) {
    throw new Error(`LVX-CONTRACT-003: id inválido em ${file}`)
  }
  if (ids.has(contrato.id)) throw new Error(`LVX-CONTRACT-004: id duplicado ${contrato.id}`)
  ids.add(contrato.id)

  for (const field of ['viewports', 'states', 'acceptance']) {
    if (!Array.isArray(contrato[field]) || contrato[field].length === 0) {
      throw new Error(`LVX-CONTRACT-005: ${file} precisa de ${field}`)
    }
  }
  for (const field of ['viewports', 'states']) {
    if (new Set(contrato[field]).size !== contrato[field].length) {
      throw new Error(`LVX-CONTRACT-006: ${file} repete valores em ${field}`)
    }
  }
  if (!contrato.route.startsWith('/')) {
    throw new Error(`LVX-CONTRACT-007: rota inválida em ${file}`)
  }

  for (const criterio of contrato.acceptance) {
    if (typeof criterio !== 'object' || !PADRAO_ID.test(criterio.id ?? '')) {
      throw new Error(`LVX-CONTRACT-008: ${file} tem critério sem ID no formato ABC-01`)
    }
    if (criterios.has(criterio.id)) {
      throw new Error(`LVX-CONTRACT-009: critério ${criterio.id} repetido entre contratos`)
    }
    criterios.add(criterio.id)
    if (typeof criterio.text !== 'string' || criterio.text.length < 8) {
      throw new Error(`LVX-CONTRACT-010: ${criterio.id} sem texto`)
    }
    if (!VERIFICACOES.includes(criterio.verify)) {
      throw new Error(`LVX-CONTRACT-011: ${criterio.id} com verify fora de ${VERIFICACOES}`)
    }
  }
  if (contrato.spec && !existsSync(resolve(root, contrato.spec))) {
    throw new Error(`LVX-CONTRACT-012: ${file} aponta spec inexistente ${contrato.spec}`)
  }
}

console.log(`Contratos válidos: ${contratos.length}, ${criterios.size} critérios`)
