// Todo caminho de public/ citado no codigo precisa existir no disco.
// Renomeou asset e esqueceu o codigo? Este teste derruba o build.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = join(__dirname, '..', 'src')
const PUBLIC = join(__dirname, '..', 'public')
const PASTAS = [
  'animation',
  'background',
  'branding',
  'commons',
  'components',
  'fonts',
  'models',
  'textures',
]

function arquivosDe(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome)
    return statSync(caminho).isDirectory() ? arquivosDe(caminho) : [caminho]
  })
}

function referencias(): string[] {
  const fontes = arquivosDe(SRC).filter((f) => /\.(tsx?|css)$/.test(f))
  const achadas = new Set<string>()
  const padrao = new RegExp(`['"(]\\/(${PASTAS.join('|')})\\/([^'")]+)['")]`, 'g')
  for (const arquivo of fontes) {
    const texto = readFileSync(arquivo, 'utf-8')
    for (const m of texto.matchAll(padrao)) {
      achadas.add(`/${m[1]}/${m[2]}`)
    }
  }
  return [...achadas]
}

describe('assets referenciados', () => {
  it('todo caminho de public/ citado no src existe no disco', () => {
    const faltando = referencias().filter((ref) => !existsSync(join(PUBLIC, ref)))
    expect(faltando, `assets citados e inexistentes: ${faltando.join(', ')}`).toEqual([])
  })

  it('o src referencia pelo menos os assets vitais', () => {
    const refs = referencias()
    expect(refs.some((r) => r.includes('mascote-hero.webm'))).toBe(true)
    expect(refs.some((r) => r.includes('bg-buildings'))).toBe(true)
  })
})
