import { describe, expect, it } from 'vitest'
import {
  CAPA,
  CARTAO,
  type Entrada,
  type Folha,
  anguloDaMao,
  emRepouso,
  novaFolha,
  passo,
  proximidade,
} from '../src/scenes/Pilares/folhaFisica'

const parado: Entrada = {
  prox: 0,
  alavanca: 0,
  lado: 0,
  vx: 0,
  vy: 0,
  camAcc: 0,
  alvoMao: null,
}

function simula(f: Folha, e: Entrada, segundos: number, m = CARTAO): Folha {
  let s = f
  for (let t = 0; t < segundos; t += 1 / 60) s = passo(s, e, m, 1 / 60)
  return s
}

describe('folha solta', () => {
  it('parada e sem vento, continua parada', () => {
    expect(emRepouso(simula(novaFolha(), parado, 2))).toBe(true)
  })

  it('solta torta, balança e a gravidade a devolve ao prumo', () => {
    const torta = { ...novaFolha(), ang: 12 }
    // meio período depois ela passou pro outro lado: balança, não trava
    const meio = simula(torta, parado, 0.62)
    expect(meio.ang).toBeLessThan(0)
    const depois = simula(torta, parado, 6)
    expect(Math.abs(depois.ang)).toBeLessThan(0.3)
  })

  it('o cursor arrastando pra direita perto da base empurra a base pra direita', () => {
    const vento = { ...parado, prox: 1, alavanca: 1, vx: 900 }
    const s = simula(novaFolha(), vento, 0.25)
    // base pra direita é giro negativo
    expect(s.ang).toBeLessThan(-1)
    // e a folha descola da parede
    expect(s.lift).toBeGreaterThan(0.8)
  })

  it('perto do pivô o mesmo vento empurra menos', () => {
    const base = simula(novaFolha(), { ...parado, prox: 1, alavanca: 1, vx: 900 }, 0.2)
    const topo = simula(novaFolha(), { ...parado, prox: 1, alavanca: 0, vx: 900 }, 0.2)
    expect(Math.abs(topo.ang)).toBeLessThan(Math.abs(base.ang))
  })

  it('a câmera acelerando pra esquerda deixa a base pra trás, à direita', () => {
    const s = simula(novaFolha(), { ...parado, camAcc: -9000 }, 0.3)
    expect(s.ang).toBeLessThan(-0.5)
  })

  it('a capa é mais pesada que o cartão', () => {
    const e = { ...parado, prox: 1, alavanca: 1, vx: 900 }
    const capa = simula(novaFolha(), e, 0.3, CAPA)
    const cartao = simula(novaFolha(), e, 0.3, CARTAO)
    expect(Math.abs(capa.ang)).toBeLessThan(Math.abs(cartao.ang))
  })

  it('pega pela mão, segue a mão; solta, volta ao prumo', () => {
    const pega = simula(novaFolha(), { ...parado, alvoMao: 15 }, 0.5)
    expect(pega.ang).toBeCloseTo(15, 0)
    // a mão leva além do limite solto
    expect(pega.ang).toBeGreaterThan(CARTAO.limite)
    const solta = simula(pega, parado, 7)
    expect(Math.abs(solta.ang)).toBeLessThan(0.3)
  })

  it('um quadro longo não explode a integração', () => {
    let s = { ...novaFolha(), ang: 20, vAng: 400 }
    for (let i = 0; i < 40; i += 1) s = passo(s, parado, CARTAO, 0.2)
    expect(Number.isFinite(s.ang)).toBe(true)
    expect(Math.abs(s.ang)).toBeLessThanOrEqual(CARTAO.limite)
  })

  it('nem um sopro violento passa do limite solto', () => {
    const s = simula(novaFolha(), { ...parado, prox: 1, alavanca: 1, vx: 9000 }, 0.6)
    expect(Math.abs(s.ang)).toBeLessThanOrEqual(CARTAO.limite)
  })

  it('a mão à direita do pivô pede giro negativo', () => {
    expect(anguloDaMao(100, 0, 200, 100)).toBeCloseTo(-45, 5)
    expect(anguloDaMao(100, 0, 100, 100)).toBeCloseTo(0, 5)
  })

  it('proximidade é 1 dentro da folha e some com a distância', () => {
    const box = { left: 0, top: 0, right: 100, bottom: 100 }
    expect(proximidade(box, 50, 50)).toBe(1)
    expect(proximidade(box, 170, 50, 140)).toBeCloseTo(0.5, 5)
    expect(proximidade(box, 400, 400)).toBe(0)
  })
})
