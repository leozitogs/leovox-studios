// Smoke de browser: sobe o build em preview, roda o filme inteiro
// (abertura, hero, os 4 atos do manifesto, a tira dos pilares,
// reversao) e FALHA se aparecer console.error, excecao, rejeicao de
// promise ou 404 de asset. E a lei da casa (bug se prova em browser)
// como portao de CI.
//
// Uso: npm run build && npm run smoke

/* global document, window, getComputedStyle, DOMMatrixReadOnly */
// (os globals acima vivem dentro dos page.evaluate, executados no browser)

import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORTA = 4317
// SMOKE_QUICK=1 encurta esperas (util em maquina lenta); o CI roda cheio
const RAPIDO = process.env.SMOKE_QUICK === '1'
const PAUSA_ATO = RAPIDO ? 1000 : 1800
const ESPERA_LOADER = RAPIDO ? 12 : 16
const problemas = []

function registra(tipo, texto) {
  problemas.push(`[${tipo}] ${texto}`)
}

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORTA), '--strictPort'], {
  stdio: 'ignore',
  detached: false,
  shell: true,
})

async function esperaServidor() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://localhost:${PORTA}/`)
      if (r.ok) return
    } catch {
      // ainda subindo
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('preview nao subiu')
}

try {
  await esperaServidor()
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })

  page.on('console', (msg) => {
    if (msg.type() === 'error') registra('console.error', msg.text().slice(0, 300))
  })
  page.on('pageerror', (err) => registra('excecao', String(err.message).slice(0, 300)))
  page.on('response', (res) => {
    if (res.status() >= 400 && res.url().startsWith(`http://localhost:${PORTA}`)) {
      registra('http', `${res.status()} ${res.url()}`)
    }
  })

  await page.goto(`http://localhost:${PORTA}/`)

  // abertura completa (failsafe do loader e 9s; margem de 16s)
  let abriu = false
  for (let t = 0; t < ESPERA_LOADER; t++) {
    await page.waitForTimeout(1000)
    if (await page.evaluate(() => !document.querySelector('.loader'))) {
      abriu = true
      break
    }
  }
  if (!abriu) registra('fluxo', 'o loader nunca liberou a tela')

  const heroPronto = await page.evaluate(() =>
    document.querySelector('.hero')?.classList.contains('is-ready'),
  )
  if (!heroPronto) registra('fluxo', 'o hero nao ficou pronto apos o reveal')

  // viagem completa pelo manifesto (pagina longa de scroll natural,
  // sem pin), ida e volta: cada ato liga quando entra em quadro e a
  // reversao desliga o que ficou pra tras
  const mf = await page.evaluate(() => {
    const el = document.querySelector('.manifesto')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight }
  })
  if (!mf || mf.height < mf.vh * 2) {
    registra('fluxo', 'manifesto nao montou como pagina longa')
  } else {
    let ligadosNoFundo = 0
    for (const p of [0.15, 0.45, 0.75, 1, 0.45, 0]) {
      await page.evaluate(
        ({ mf, p }) => window.scrollTo(0, mf.top + p * (mf.height - window.innerHeight)),
        { mf, p },
      )
      await page.waitForTimeout(PAUSA_ATO)

      const ligados = await page.evaluate(() => document.querySelectorAll('.mf-ato.is-on').length)
      if (p > 0.1 && ligados === 0) registra('fluxo', `nenhum ato ligado em ${p} da cena`)
      if (p === 1) ligadosNoFundo = ligados
    }
    if (ligadosNoFundo < 4) {
      registra('fluxo', `no fundo da cena os 4 atos deveriam estar ligados (${ligadosNoFundo})`)
    }
    const estado = await page.evaluate(() =>
      [...document.querySelectorAll('.mf-ato')].map((a) => a.classList.contains('is-on')),
    )
    if (!estado[0] || estado[3])
      registra('fluxo', `reversao suja: atos ligados [${estado.join(', ')}]`)
  }

  // Cena 3 (Pilares): a chegada apaga a luz do palco, o cartaz
  // assembla, a travessia desliza o trilho um painel por vez e a
  // reversao devolve o cartaz limpo
  const pl = await page.evaluate(() => {
    const el = document.querySelector('.pilares')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: r.top + window.scrollY, vh: window.innerHeight }
  })
  if (!pl) {
    registra('fluxo', 'a cena pilares nao montou')
  } else {
    const vaiPra = async (fator) => {
      await page.evaluate(({ pl, fator }) => window.scrollTo(0, pl.top + fator * pl.vh), {
        pl,
        fator,
      })
      await page.waitForTimeout(PAUSA_ATO)
    }

    // t = 2.5 da duracao virtual: beat do cartaz, luz ja caida
    await vaiPra(1.0)
    const cartaz = await page.evaluate(() => ({
      bg: getComputedStyle(document.querySelector('.story-paper-bg')).backgroundColor,
      on: !!document.querySelector('.pl-abertura.is-on'),
      quadros: document.querySelectorAll('.pl-quadro').length,
      capitulos: document.querySelectorAll('.pl-nav-btn').length,
    }))
    if (cartaz.bg !== 'rgb(34, 34, 34)') {
      registra('fluxo', `a luz dos pilares nao caiu pro cinza da tira: ${cartaz.bg}`)
    }
    if (!cartaz.on) registra('fluxo', 'o cartaz dos pilares nao assemblou')
    if (cartaz.quadros !== 3 || cartaz.capitulos !== 3) {
      registra(
        'fluxo',
        `pilares deveria ter 3 quadros e 3 capitulos (${cartaz.quadros}/${cartaz.capitulos})`,
      )
    }

    // t = 4.0: cruza o limiar e a travessia leva ao quadro 01
    await vaiPra(1.6)
    await page.waitForTimeout(1200)
    const q1 = await page.evaluate(() => {
      const track = document.querySelector('.pl-track')
      const m = new DOMMatrixReadOnly(getComputedStyle(track).transform)
      return { x: m.e, alvo: -window.innerWidth, on: !!document.querySelector('.pl-quadro.is-on') }
    })
    if (Math.abs(q1.x - q1.alvo) > 40) {
      registra('fluxo', `a travessia nao chegou no quadro 01: x=${Math.round(q1.x)}`)
    }
    if (!q1.on) registra('fluxo', 'o quadro 01 nao ligou na chegada')

    // de volta ao cartaz: a travessia reverte e o estado fica limpo
    await vaiPra(1.0)
    await page.waitForTimeout(1200)
    const volta = await page.evaluate(() => {
      const track = document.querySelector('.pl-track')
      const m = new DOMMatrixReadOnly(getComputedStyle(track).transform)
      return {
        x: m.e,
        cartaz: !!document.querySelector('.pl-abertura.is-on'),
        sujo: !!document.querySelector('.pl-quadro.is-on'),
      }
    })
    if (Math.abs(volta.x) > 40) {
      registra('fluxo', `a reversao nao devolveu o cartaz: x=${Math.round(volta.x)}`)
    }
    if (!volta.cartaz || volta.sujo) registra('fluxo', 'reversao suja nos pilares')
  }

  // a cena 404 tambem precisa de console limpo
  await page.goto(`http://localhost:${PORTA}/404.html`)
  await page.waitForTimeout(RAPIDO ? 1500 : 2500)
  const tem404 = await page.evaluate(() => !!document.querySelector('.nf-404'))
  if (!tem404) registra('fluxo', 'a cena 404 nao montou')

  await browser.close()
} catch (erro) {
  registra('smoke', String(erro?.message ?? erro))
} finally {
  preview.kill()
}

if (problemas.length > 0) {
  console.error(`SMOKE FALHOU com ${problemas.length} problema(s):`)
  for (const p of problemas) console.error('  ' + p)
  process.exit(1)
}
console.log('SMOKE OK: console limpo, fluxo integro, assets respondendo.')
