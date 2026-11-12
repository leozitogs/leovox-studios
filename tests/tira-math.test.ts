// A matemática da tira dos Pilares (briefing v4). O que precisa ficar
// provado: (a) a câmera é função pura do scroll, parada no cartaz e
// presa à travessia, (b) a gravidade sempre leva a um descanso de painel
// e nunca corrige quem já está descansando, (c) o eixo `d` e o que deriva
// dele são contínuos e limitados.

import { describe, expect, it } from 'vitest'
import {
  D_MAX,
  HOLD_VH,
  RATIO,
  SETTLE_TOLERANCE,
  type TiraLayout,
  cameraX,
  nearestPanel,
  nearness,
  panelOffset,
  pinLength,
  railFill,
  restScroll,
  reveal,
  settleTarget,
  travel,
  velocitySkew,
} from '../src/scenes/Pilares/tiraMath'

// Um laptop de 1440 x 900: cartaz, capa, dois trabalhos, fecho.
const vw = 1440
const vh = 900
const widths = [vw, 0.64 * vw, 0.78 * vw, 0.78 * vw, vw]
let left = 0
const panels = widths.map((width) => {
  const box = { left, width }
  left += width
  return box
})
const layout: TiraLayout = { vw, vh, trackWidth: left, panels }

describe('a câmera', () => {
  it('fica parada no cartaz durante o tempo de segurar', () => {
    expect(cameraX(0, layout)).toBe(0)
    expect(cameraX(HOLD_VH * vh, layout)).toBe(0)
    expect(cameraX(-50, layout)).toBe(0)
  })

  it('anda na proporção combinada e para no fim da travessia', () => {
    expect(cameraX(HOLD_VH * vh + 100, layout)).toBeCloseTo(-100 * RATIO)
    expect(cameraX(pinLength(layout), layout)).toBeCloseTo(-travel(layout))
    expect(cameraX(pinLength(layout) + 5000, layout)).toBeCloseTo(-travel(layout))
  })

  it('é monótona: mais scroll nunca volta a tira', () => {
    let prev = 1
    for (let s = 0; s <= pinLength(layout); s += 37) {
      const x = cameraX(s, layout)
      expect(x).toBeLessThanOrEqual(prev)
      prev = x
    }
  })
})

describe('o eixo de cada painel', () => {
  it('d é zero com o painel no centro e cresce uma unidade por tela', () => {
    const p = panels[2]
    const xCentro = -(p.left + p.width / 2 - vw / 2)
    expect(panelOffset(p, xCentro, vw)).toBeCloseTo(0)
    expect(panelOffset(p, xCentro + vw, vw)).toBeCloseTo(1)
    expect(panelOffset(p, xCentro - vw, vw)).toBeCloseTo(-1)
  })

  it('proximidade e revelação ficam presas em [0, 1]', () => {
    for (let d = -D_MAX * 2; d <= D_MAX * 2; d += 0.05) {
      for (const v of [nearness(d), reveal(d)]) {
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThanOrEqual(1)
      }
    }
    expect(nearness(0)).toBe(1)
    expect(reveal(0)).toBe(1)
    expect(reveal(-1)).toBe(1)
    expect(reveal(1.2)).toBe(0)
  })

  it('o painel mais próximo é o do centro', () => {
    expect(nearestPanel(0, layout)).toBe(0)
    expect(nearestPanel(cameraX(restScroll(3, layout), layout), layout)).toBe(3)
  })
})

describe('a gravidade', () => {
  it('cada descanso é um ponto fixo: descansar nunca dispara correção', () => {
    for (let i = 0; i < panels.length; i += 1) {
      expect(settleTarget(restScroll(i, layout), layout)).toBeNull()
    }
  })

  it('os descansos crescem com os painéis e cabem no pin', () => {
    for (let i = 1; i < panels.length; i += 1) {
      expect(restScroll(i, layout)).toBeGreaterThanOrEqual(restScroll(i - 1, layout))
    }
    expect(restScroll(panels.length - 1, layout)).toBeLessThanOrEqual(pinLength(layout) + 0.001)
  })

  it('parar entre dois painéis leva ao mais próximo', () => {
    const a = restScroll(2, layout)
    const b = restScroll(3, layout)
    expect(settleTarget(a + (b - a) * 0.3, layout)).toBeCloseTo(a)
    expect(settleTarget(a + (b - a) * 0.7, layout)).toBeCloseTo(b)
  })

  it('no cartaz parado e no fim do pin não há o que corrigir', () => {
    expect(settleTarget(0, layout)).toBeNull()
    expect(settleTarget(HOLD_VH * vh * 0.5, layout)).toBeNull()
    expect(settleTarget(pinLength(layout), layout)).toBeNull()
  })

  it('perto do descanso, dentro da tolerância, nada se mexe', () => {
    const r = restScroll(3, layout)
    expect(settleTarget(r + SETTLE_TOLERANCE * 0.5, layout)).toBeNull()
  })
})

describe('o trilho e a velocidade', () => {
  it('a marca enche conforme a câmera passa pelo painel', () => {
    const p = panels[2]
    expect(railFill(p, -(p.left - vw / 2) + 1, vw)).toBe(0)
    expect(railFill(p, -(p.left + p.width - vw / 2), vw)).toBe(1)
  })

  it('a inclinação é limitada a 2 graus e some parada', () => {
    expect(velocitySkew(0)).toBe(0)
    expect(Math.abs(velocitySkew(1e6))).toBe(2)
    expect(Math.abs(velocitySkew(-1e6))).toBe(2)
    expect(Math.sign(velocitySkew(900))).toBe(-1)
  })
})
