// O progresso da abertura: pesos fechados e suavizacao que nao depende
// do framerate da maquina.

import { describe, expect, it } from 'vitest'
import { WEIGHTS, approach, combineMarks } from '../src/components/Loader/progressMath'

describe('combineMarks', () => {
  it('os pesos somam 1', () => {
    const soma = WEIGHTS.fonts + WEIGHTS.video + WEIGHTS.images + WEIGHTS.page
    expect(soma).toBeCloseTo(1, 10)
  })

  it('tudo carregado da 1; nada carregado da 0', () => {
    expect(combineMarks({ fonts: 1, video: 1, images: 1, page: 1 })).toBe(1)
    expect(combineMarks({ fonts: 0, video: 0, images: 0, page: 0 })).toBe(0)
  })

  it('nunca estoura os limites', () => {
    expect(combineMarks({ fonts: 2, video: 2, images: 2, page: 2 })).toBe(1)
    expect(combineMarks({ fonts: -1, video: 0, images: 0, page: 0 })).toBe(0)
  })
})

describe('approach', () => {
  it('converge pro alvo', () => {
    let v = 0
    for (let i = 0; i < 120; i++) v = approach(v, 1, 1 / 60)
    expect(v).toBeGreaterThan(0.99)
  })

  it('e independente de framerate: 6fps e 144fps chegam juntos', () => {
    const segundos = 1.2
    let lento = 0
    for (let i = 0; i < 6 * segundos; i++) lento = approach(lento, 1, 1 / 6)
    let rapido = 0
    for (let i = 0; i < 144 * segundos; i++) rapido = approach(rapido, 1, 1 / 144)
    // o passo lento e truncado em 0.12s por seguranca, entao ele chega
    // um pouco atras, mas na mesma vizinhanca
    expect(Math.abs(lento - rapido)).toBeLessThan(0.12)
  })
})
