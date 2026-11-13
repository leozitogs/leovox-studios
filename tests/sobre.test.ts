import { describe, expect, it } from 'vitest'
import { flechaDoFio, revelacao } from '../src/scenes/Sobre/useSobre'
import { TIRAS } from '../src/scenes/Sobre/conteudo'

describe('Cena 7 · a revelação da folha de contato', () => {
  it('é papel branco longe do centro e foto inteira no centro e depois', () => {
    expect(revelacao(1)).toBe(0)
    expect(revelacao(0.05)).toBe(1)
    expect(revelacao(0)).toBe(1)
    expect(revelacao(-2)).toBe(1)
  })

  it('cresce sem saltar enquanto a tira se aproxima', () => {
    let anterior = -1
    for (let d = 0.6; d >= 0; d -= 0.05) {
      const r = revelacao(d)
      expect(r).toBeGreaterThanOrEqual(anterior)
      anterior = r
    }
  })
})

describe('Cena 7 · o fio do varal', () => {
  it('cede no repouso e fica dentro do limite em rolagem forte', () => {
    expect(flechaDoFio(0)).toBe(12)
    expect(flechaDoFio(1e6)).toBe(26)
    expect(flechaDoFio(-1e6)).toBe(6)
  })
})

describe('Cena 7 · o conteúdo', () => {
  it('tem três tiras em ordem, cada uma com um take escolhido e a nota da mão', () => {
    expect(TIRAS.map((t) => t.ano)).toEqual(['2020', '2023', '2025'])
    for (const t of TIRAS) {
      expect(t.fotogramas).toHaveLength(3)
      expect(t.nota.length).toBeGreaterThan(0)
      expect(t.escolhido).toBeGreaterThanOrEqual(0)
      expect(t.escolhido).toBeLessThanOrEqual(2)
    }
  })
})
