// Testes de marca: garantem que as regras inegociáveis da identidade
// Leovox continuam valendo no código conforme o site cresce.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const TOKENS = readFileSync('src/styles/tokens.css', 'utf8').toLowerCase()

function collectFiles(dir: string, extensions: string[], acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      collectFiles(fullPath, extensions, acc)
    } else if (extensions.some((ext) => fullPath.endsWith(ext))) {
      acc.push(fullPath)
    }
  }
  return acc
}

describe('cores da marca', () => {
  it('tokens.css declara as 5 cores oficiais', () => {
    const officialColors = ['#19bc00', '#fbfbfb', '#000000', '#222222', '#c5f49d']
    for (const color of officialColors) {
      expect(TOKENS, `cor oficial ${color} ausente dos tokens`).toContain(color)
    }
  })

  it('nenhum arquivo de src usa branco puro #FFFFFF (off-white é #FBFBFB)', () => {
    const files = collectFiles('src', ['.css', '.ts', '.tsx'])
    const pureWhite = /#(?:fff|ffffff)\b/i
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      expect(pureWhite.test(content), `${file} usa branco puro`).toBe(false)
    }
  })
})

describe('estrutura do plano-sequência', () => {
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
