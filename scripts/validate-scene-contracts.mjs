import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'docs/scene-contracts')
const files = (await readdir(root)).filter((file) => file.endsWith('.contract.json')).sort()
const required = ['id', 'title', 'route', 'viewports', 'states', 'acceptance', 'forbidden']
const ids = new Set()

if (files.length === 0) throw new Error('LVX-CONTRACT-001: nenhum contrato de cena encontrado')

for (const file of files) {
  const contract = JSON.parse(await readFile(resolve(root, file), 'utf8'))
  for (const field of required) {
    if (!(field in contract)) {
      throw new Error(`LVX-CONTRACT-002: ${file} não declara ${field}`)
    }
  }
  if (!/^[a-z][a-z0-9-]+$/.test(contract.id)) {
    throw new Error(`LVX-CONTRACT-003: id inválido em ${file}`)
  }
  if (ids.has(contract.id)) throw new Error(`LVX-CONTRACT-004: id duplicado ${contract.id}`)
  ids.add(contract.id)

  for (const field of ['viewports', 'states', 'acceptance']) {
    if (!Array.isArray(contract[field]) || contract[field].length === 0) {
      throw new Error(`LVX-CONTRACT-005: ${file} precisa de ${field}`)
    }
    if (new Set(contract[field]).size !== contract[field].length) {
      throw new Error(`LVX-CONTRACT-006: ${file} repete valores em ${field}`)
    }
  }
  if (!contract.route.startsWith('/')) {
    throw new Error(`LVX-CONTRACT-007: rota inválida em ${file}`)
  }
}

console.log(`Contratos válidos: ${files.length}`)
