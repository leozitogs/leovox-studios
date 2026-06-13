// Smoke de browser: sobe o build em preview, roda o filme inteiro
// (abertura, hero, os 4 atos do manifesto, reversao) e FALHA se
// aparecer console.error, excecao, rejeicao de promise ou 404 de
// asset. E a lei da casa (bug se prova em browser) como portao de CI.
//
// Uso: npm run build && npm run smoke

/* global document, window, getComputedStyle */
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

  // viagem completa pelo manifesto, ida e volta
  const top = await page.evaluate(() => {
    const mf = document.querySelector('.manifesto')
    const sp = mf?.closest('.pin-spacer')
    return sp ? sp.offsetTop : 0
  })
  if (!top) {
    registra('fluxo', 'manifesto sem pin (refresh falhou?)')
  } else {
    const D = 13.2
    for (const t of [1.8, 5.4, 9.2, 13.2, 5.4, 0]) {
      await page.evaluate(({ top, t, D }) => window.scrollTo(0, top + (t / D) * 3600), {
        top,
        t,
        D,
      })
      await page.waitForTimeout(PAUSA_ATO)
    }
    const atoFinal = await page.evaluate(
      () =>
        [...document.querySelectorAll('.mf-ato')].findIndex(
          (a) => getComputedStyle(a).visibility === 'visible',
        ) + 1,
    )
    if (atoFinal !== 1) registra('fluxo', `reversao terminou no ato ${atoFinal}, esperado 1`)
  }

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
