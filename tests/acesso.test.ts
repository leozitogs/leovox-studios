import { describe, expect, it } from 'vitest'
import { autorizado, credenciais } from '../worker/acesso'

const basic = (usuario: string, senha: string) => {
  const bytes = new TextEncoder().encode(`${usuario}:${senha}`)
  return `Basic ${btoa(String.fromCharCode(...bytes))}`
}

describe('portão do site fechado', () => {
  it('lê usuário e senha, inclusive com dois-pontos e acento na senha', () => {
    expect(credenciais(basic('leovox', 'ação:123'))).toEqual({
      usuario: 'leovox',
      senha: 'ação:123',
    })
  })

  it('recusa cabeçalho ausente, de outro esquema ou malformado', () => {
    expect(credenciais(null)).toBeNull()
    expect(credenciais('Bearer abc')).toBeNull()
    expect(credenciais('Basic %%%')).toBeNull()
    expect(credenciais(`Basic ${btoa('semdoispontos')}`)).toBeNull()
  })

  it('deixa passar só usuário e senha certos', async () => {
    expect(await autorizado(basic('leovox', 'certa'), 'leovox', 'certa')).toBe(true)
    expect(await autorizado(basic('leovox', 'errada'), 'leovox', 'certa')).toBe(false)
    expect(await autorizado(basic('outro', 'certa'), 'leovox', 'certa')).toBe(false)
    expect(await autorizado(null, 'leovox', 'certa')).toBe(false)
  })

  it('sem senha configurada, ninguém passa', async () => {
    expect(await autorizado(basic('leovox', ''), 'leovox', undefined)).toBe(false)
    expect(await autorizado(basic('leovox', ''), 'leovox', '')).toBe(false)
  })
})
