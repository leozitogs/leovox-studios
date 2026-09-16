// A matematica da cena Pilares: a rampa de luz da chegada e o motor de
// travessia por gatilho (limiar com banda morta e gravidade de
// descanso, o padrao das decisoes 35 e 47 rotacionado pra horizontal).
// O que precisa ficar provado: (a) a luz e funcao pura e monotona do
// progresso e termina antes da primeira travessia, (b) a banda morta
// segura tremor de fronteira e a gravidade nunca dispara troca de
// beat sozinha, (c) o deslocamento do trilho e funcao exata do beat.

import { describe, expect, it } from 'vitest'
import {
  BEATS,
  D,
  DEADBAND,
  LUZ_FIM,
  REST_BY_BEAT,
  SWAPS,
  TITULO_ON,
  desiredBeat,
  luzAt,
  restFor,
  trackXPercent,
} from '../src/scenes/Pilares/pilaresMath'

describe('a rampa de luz', () => {
  it('e funcao pura, presa em [0, 1] e monotona', () => {
    expect(luzAt(-5)).toBe(0)
    expect(luzAt(0)).toBe(0)
    expect(luzAt(LUZ_FIM)).toBe(1)
    expect(luzAt(D)).toBe(1)
    let prev = -1
    for (let t = -1; t <= D; t += 0.05) {
      const v = luzAt(t)
      expect(v).toBeGreaterThanOrEqual(prev)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
      prev = v
    }
  })

  it('termina antes do cartaz assemblar e da primeira travessia', () => {
    // o lockup branco so entra com o palco ja escuro o bastante, e a
    // luz nunca esta caindo no meio de um slide
    expect(TITULO_ON).toBeGreaterThan(LUZ_FIM * 0.6)
    expect(LUZ_FIM).toBeLessThan(SWAPS[0] - DEADBAND)
    expect(TITULO_ON).toBeLessThan(SWAPS[0] - DEADBAND)
  })
})

describe('desiredBeat', () => {
  it('os limiares crescem e cabem na duracao virtual', () => {
    expect(SWAPS.length).toBe(BEATS - 1)
    for (let i = 1; i < SWAPS.length; i += 1) {
      expect(SWAPS[i]).toBeGreaterThan(SWAPS[i - 1] + DEADBAND * 2)
    }
    expect(SWAPS[SWAPS.length - 1] + DEADBAND).toBeLessThan(D)
  })

  it('avanca e volta cruzando o limiar', () => {
    expect(desiredBeat(0, SWAPS[0] + DEADBAND + 0.01)).toBe(1)
    expect(desiredBeat(1, SWAPS[0] - DEADBAND - 0.01)).toBe(0)
    expect(desiredBeat(2, SWAPS[2] + DEADBAND + 0.01)).toBe(3)
    expect(desiredBeat(3, SWAPS[2] - DEADBAND - 0.01)).toBe(2)
  })

  it('dentro da banda morta nada muda, em nenhuma direcao', () => {
    for (let i = 0; i < SWAPS.length; i += 1) {
      const s = SWAPS[i]
      for (const t of [s - DEADBAND + 0.01, s, s + DEADBAND - 0.01]) {
        expect(desiredBeat(i, t)).toBe(i)
        expect(desiredBeat(i + 1, t)).toBe(i + 1)
      }
    }
  })

  it('um teleporte atravessa varios limiares de uma vez', () => {
    expect(desiredBeat(0, D)).toBe(BEATS - 1)
    expect(desiredBeat(BEATS - 1, 0)).toBe(0)
  })
})

describe('a gravidade de descanso', () => {
  it('cada beat descansa no proprio territorio: pousar nunca troca de beat', () => {
    expect(REST_BY_BEAT.length).toBe(BEATS)
    for (let k = 0; k < BEATS; k += 1) {
      expect(desiredBeat(k, REST_BY_BEAT[k])).toBe(k)
    }
  })

  it('os descansos crescem com os beats', () => {
    for (let i = 1; i < REST_BY_BEAT.length; i += 1) {
      expect(REST_BY_BEAT[i]).toBeGreaterThan(REST_BY_BEAT[i - 1])
    }
  })

  it('na rampa de luz o pouso e o comeco; depois, o descanso do cartaz', () => {
    expect(restFor(0, 0.3)).toBe(0)
    expect(restFor(0, 2)).toBe(REST_BY_BEAT[0])
    for (let k = 1; k < BEATS; k += 1) {
      expect(restFor(k, REST_BY_BEAT[k] + 0.5)).toBe(REST_BY_BEAT[k])
    }
  })
})

describe('trackXPercent', () => {
  it('desloca o trilho um painel por beat, em percentual do trilho', () => {
    expect(trackXPercent(0)).toBe(0)
    expect(trackXPercent(1)).toBe(-25)
    expect(trackXPercent(3)).toBe(-75)
  })

  it('e funcao pura do beat', () => {
    for (let k = 0; k < BEATS; k += 1) {
      expect(trackXPercent(k)).toBe(trackXPercent(k))
      expect(trackXPercent(k)).toBe(0 - k * (100 / BEATS))
    }
  })
})
