// A matematica do manifesto: limiares com banda morta e gravidade.
// Sao as regras que o PO sente no dedo; aqui elas viram contrato.

import { describe, expect, it } from 'vitest'
import {
  ACT_BG,
  ACT_LINE,
  D,
  DEADBAND,
  REST_BY_ACT,
  SWAPS,
  desiredAct,
  restFor,
} from '../src/scenes/Manifesto/actMath'

describe('desiredAct', () => {
  it('nao treme dentro da banda morta do limiar', () => {
    expect(desiredAct(0, SWAPS[0] + DEADBAND - 0.01)).toBe(0)
    expect(desiredAct(1, SWAPS[0] - DEADBAND + 0.01)).toBe(1)
  })

  it('cruza o limiar com folga e troca de ato', () => {
    expect(desiredAct(0, SWAPS[0] + DEADBAND + 0.01)).toBe(1)
    expect(desiredAct(1, SWAPS[0] - DEADBAND - 0.01)).toBe(0)
  })

  it('atravessa mais de um ato num salto', () => {
    expect(desiredAct(0, SWAPS[2] + DEADBAND + 0.01)).toBe(3)
    expect(desiredAct(3, 0)).toBe(0)
  })

  it('nunca sai do intervalo de atos', () => {
    expect(desiredAct(0, D * 2)).toBe(3)
    expect(desiredAct(3, -5)).toBe(0)
  })
})

describe('restFor', () => {
  it('ato 1 tem dois pousos: topo e miolo', () => {
    expect(restFor(0, 0.3)).toBe(0)
    expect(restFor(0, 1.2)).toBe(REST_BY_ACT[0])
  })

  it('os demais atos assentam no proprio descanso', () => {
    expect(restFor(1, 6.8)).toBe(REST_BY_ACT[1])
    expect(restFor(2, 7.5)).toBe(REST_BY_ACT[2])
    expect(restFor(3, 12)).toBe(REST_BY_ACT[3])
  })

  it('os descansos vivem dentro das zonas dos seus atos', () => {
    expect(REST_BY_ACT[0]).toBeLessThan(SWAPS[0])
    expect(REST_BY_ACT[1]).toBeGreaterThan(SWAPS[0])
    expect(REST_BY_ACT[1]).toBeLessThan(SWAPS[1])
    expect(REST_BY_ACT[2]).toBeGreaterThan(SWAPS[1])
    expect(REST_BY_ACT[2]).toBeLessThan(SWAPS[2])
    expect(REST_BY_ACT[3]).toBeGreaterThan(SWAPS[2])
    expect(REST_BY_ACT[3]).toBeLessThanOrEqual(D)
  })
})

describe('tabelas de luz', () => {
  it('todo ato tem fundo e linha', () => {
    expect(ACT_BG).toHaveLength(4)
    expect(ACT_LINE).toHaveLength(4)
  })
})
