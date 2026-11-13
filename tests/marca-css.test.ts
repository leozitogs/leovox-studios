import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guarda determinística da marca no CSS. O leovox-brand-guard continua
// revisando o que regra não pega; isto aqui pega o que nunca pode passar.

const SRC = resolve(process.cwd(), 'src')

function arquivosCss(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = join(dir, entrada.name)
    if (entrada.isDirectory()) return arquivosCss(caminho)
    return entrada.name.endsWith('.css') ? [caminho] : []
  })
}

type Declaracao = { arquivo: string; propriedade: string; valor: string }

function declaracoes(): Declaracao[] {
  return arquivosCss(SRC).flatMap((arquivo) => {
    const css = readFileSync(arquivo, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const nome = arquivo.slice(SRC.length + 1).replaceAll('\\', '/')
    return [...css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)(?=[;}])/gi)].map(
      ([, propriedade, valor]) => ({
        arquivo: nome,
        propriedade: propriedade.toLowerCase(),
        valor: valor.replace(/\s+/g, ' ').trim(),
      }),
    )
  })
}

// Separa sombras por vírgula de nível zero (rgba(...) tem vírgulas dentro).
function camadas(valor: string): string[] {
  const saida: string[] = []
  let profundidade = 0
  let atual = ''
  for (const char of valor) {
    if (char === '(') profundidade += 1
    if (char === ')') profundidade -= 1
    if (char === ',' && profundidade === 0) {
      saida.push(atual.trim())
      atual = ''
    } else atual += char
  }
  if (atual.trim()) saida.push(atual.trim())
  return saida
}

const comprimento = /^-?(\d*\.)?\d+(px|em|rem|vw|vh|%)?$/
const verde = /#19bc00|#1fcc00|#00b800|rgba?\(\s*25\s*,\s*188\s*,\s*0|var\(--color-green\)/i

function desfoque(camada: string): number {
  const medidas = camada
    .replace(/rgba?\([^)]*\)|hsla?\([^)]*\)|var\([^)]*\)/g, ' ')
    .split(/\s+/)
    .filter((parte) => comprimento.test(parte))
  const blur = medidas[2] ?? '0'
  const numero = Number.parseFloat(blur)
  if (blur.endsWith('em') || blur.endsWith('rem')) return numero * 16
  return numero
}

const todas = declaracoes()

describe('marca no CSS', () => {
  it('texto não ganha sombra desfocada: sombra de serigrafia é dura', () => {
    const desfocadas = todas
      .filter((d) => d.propriedade === 'text-shadow' && d.valor !== 'none')
      .filter((d) => camadas(d.valor).some((camada) => desfoque(camada) > 0))
      .map((d) => `${d.arquivo}: ${d.valor}`)
    expect(desfocadas).toEqual([])
  })

  it('verde nunca vira halo: sem sombra verde desfocada', () => {
    const halos = todas
      .filter((d) => d.propriedade === 'box-shadow' || d.propriedade === 'filter')
      .flatMap((d) =>
        camadas(d.valor.replace(/^drop-shadow\((.*)\)$/, '$1'))
          .filter((camada) => verde.test(camada) && desfoque(camada) > 8)
          .map((camada) => `${d.arquivo}: ${camada}`),
      )
    expect(halos).toEqual([])
  })

  it('animação não se chama glow, neon, flicker nem glitch', () => {
    const nomes = arquivosCss(SRC).flatMap((arquivo) =>
      [...readFileSync(arquivo, 'utf8').matchAll(/@keyframes\s+([\w-]+)/g)]
        .map(([, nome]) => nome)
        .filter((nome) => /glow|neon|flicker|glitch|hologra|scanline/i.test(nome)),
    )
    expect(nomes).toEqual([])
  })

  it('nenhuma transição em "all"', () => {
    const genericas = todas
      .filter((d) => d.propriedade === 'transition' && /(^|,\s*)all\b/.test(d.valor))
      .map((d) => `${d.arquivo}: ${d.valor}`)
    expect(genericas).toEqual([])
  })

  it('fontes só do sistema Leovox', () => {
    const proibidas =
      /\b(Inter|Roboto|Geist|Manrope|IBM Plex|DM Sans|Space Grotesk|Helvetica Neue)\b/i
    const fora = todas
      .filter((d) => d.propriedade === 'font-family' || d.propriedade.startsWith('--font'))
      .filter((d) => proibidas.test(d.valor))
      .map((d) => `${d.arquivo}: ${d.valor}`)
    expect(fora).toEqual([])
  })
})
