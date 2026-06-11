// Testes de marca: garantem que as regras da identidade Leovox
// continuam valendo no código conforme o site cresce.
// Regra de cor atualizada em 10/06/2026: branco puro faz parte da
// paleta; a paleta orienta, não aprisiona.

import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const TOKENS = readFileSync('src/styles/tokens.css', 'utf8').toLowerCase()

describe('cores da marca', () => {
  it('tokens.css declara a paleta oficial completa', () => {
    const officialColors = ['#19bc00', '#fbfbfb', '#ffffff', '#000000', '#222222', '#c5f49d']
    for (const color of officialColors) {
      expect(TOKENS, `cor oficial ${color} ausente dos tokens`).toContain(color)
    }
  })
})

describe('estrutura das cenas', () => {
  it('as 8 cenas da home existem em src/scenes', () => {
    const scenes = readdirSync('src/scenes')
    const expected = [
      'Hero',
      'Manifesto',
      'Pilares',
      'SelectedProjects',
      'CaseIndex',
      'Sobre',
      'Contato',
      'Footer',
    ]
    for (const scene of expected) {
      expect(scenes, `cena ${scene} ausente`).toContain(scene)
    }
  })
})
