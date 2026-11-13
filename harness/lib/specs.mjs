// Leitura de specs, contratos e testes para o portão de specs e o rastreio.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { lerFrontmatter, normalizar } from './frontmatter.mjs'

export const STATUS = ['rascunho', 'proposta', 'aprovada', 'em-build', 'entregue', 'substituida']
export const APROVADOS = new Set(['aprovada', 'em-build', 'entregue'])
export const TIPOS = ['cena', 'componente', 'infra', 'conteudo', 'harness']
export const VERIFICACOES = ['browser', 'unit', 'manual']
export const PADRAO_ID = /^[A-Z]{2,5}-\d{2}$/
const TAG = /\[([A-Z]{2,5}-\d{2})\]/g

const ler = (root, path) => normalizar(readFileSync(resolve(root, path), 'utf8'))

// A aprovação vale para um conteúdo exato: mudou o corpo, a aprovação caduca.
export function hashCorpo(corpo) {
  return createHash('sha256').update(normalizar(corpo).trim()).digest('hex').slice(0, 12)
}

export function listarSpecs(root = process.cwd()) {
  const dir = resolve(root, 'docs/specs')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md')
    .sort()
    .map((file) => {
      const path = `docs/specs/${file}`
      const { dados, corpo, temFrontmatter } = lerFrontmatter(ler(root, path))
      return { path, file, dados, corpo, temFrontmatter, criterios: criteriosDaSpec(corpo) }
    })
}

// Critérios com ID na seção "Critérios de aceite": "- [PIL-01] texto".
export function criteriosDaSpec(corpo) {
  const inicio = corpo.search(/^## Critérios de aceite/m)
  if (inicio < 0) return []
  const resto = corpo.slice(inicio).split('\n').slice(1)
  const fim = resto.findIndex((linha) => linha.startsWith('## '))
  return (fim < 0 ? resto : resto.slice(0, fim))
    .map((linha) => linha.match(/^\s*-\s*\[([A-Z]{2,5}-\d{2})\]/)?.[1])
    .filter(Boolean)
}

export function listarContratos(root = process.cwd()) {
  const dir = resolve(root, 'docs/scene-contracts')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((file) => file.endsWith('.contract.json'))
    .sort()
    .map((file) => {
      const path = `docs/scene-contracts/${file}`
      return { path, file, contrato: JSON.parse(ler(root, path)) }
    })
}

// Tags de critério nos títulos de test(), it() e describe().
export function coletarTags(root = process.cwd()) {
  const arquivos = []
  for (const dir of ['harness/browser', 'tests']) {
    const abs = resolve(root, dir)
    if (!existsSync(abs)) continue
    for (const file of readdirSync(abs, { recursive: true })) {
      const nome = String(file).replaceAll('\\', '/')
      if (/\.(spec|test)\.ts$/.test(nome)) arquivos.push(`${dir}/${nome}`)
    }
  }
  const tags = new Map()
  for (const path of arquivos.sort()) {
    ler(root, path)
      .split('\n')
      .forEach((linha, indice) => {
        if (!/\b(test|it|describe)(\.\w+)?\(\s*[`'"]/.test(linha)) return
        for (const [, id] of linha.matchAll(TAG)) {
          if (!tags.has(id)) tags.set(id, [])
          tags.get(id).push(`${path}:${indice + 1}`)
        }
      })
  }
  return tags
}
