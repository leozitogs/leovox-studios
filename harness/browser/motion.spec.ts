import { expect, test } from './fixtures'

const DESKTOP = ['chromium-desktop', 'chromium-compact', 'firefox-desktop']

// distância do painel ativo ao centro da tela, em telas
const desvioDoAtivo = () => {
  const cena = document.querySelector<HTMLElement>('[data-harness-scene="pilares"]')!
  const ids = [...cena.querySelectorAll<HTMLElement>('.pl-track > *')]
  const ativo = ids.find((el) => el.dataset.panelId === cena.dataset.panel)
  return Math.abs(Number.parseFloat(ativo?.style.getPropertyValue('--d') || 'NaN'))
}

test('parado no meio da travessia, a tira assenta num painel', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'A tira pina em laptop e desktop')
  for (const progresso of [0.23, 0.48, 0.71]) {
    await app.evaluate((p) => window.__LEOVOX_HARNESS__!.setProgress('pilares', p), progresso)
    await app.waitForTimeout(150)
    await app.evaluate(() => window.__LEOVOX_HARNESS__!.settle(3000))
    expect(await app.evaluate(desvioDoAtivo)).toBeLessThan(0.02)
  }
})

test('o trilho e o teclado navegam pela tira', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'A tira pina em laptop e desktop')
  const cena = app.locator('[data-harness-scene="pilares"]')
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.2))
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.settle(3000))

  await app.locator('.tr-tick').nth(3).click()
  await expect(cena).toHaveAttribute('data-panel', 'digital-02', { timeout: 6000 })

  await app.locator('.pl-nav-btn').nth(2).click()
  await expect(cena).toHaveAttribute('data-panel', 'capa-tecnologia', { timeout: 6000 })
  await expect(app.locator('.pl-nav-btn').nth(2)).toHaveAttribute('aria-current', 'true')

  await app.keyboard.press('ArrowRight')
  await expect(cena).toHaveAttribute('data-panel', 'tecnologia-01', { timeout: 6000 })
  await app.keyboard.press('ArrowLeft')
  await expect(cena).toHaveAttribute('data-panel', 'capa-tecnologia', { timeout: 6000 })
})

test('as folhas soltas balançam com o cursor e voltam ao prumo', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'A física roda com a tira pinada')
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.3))
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.settle(3000))
  const cena = app.locator('[data-harness-scene="pilares"]')
  const painel = (await cena.getAttribute('data-panel')) ?? ''
  const folha = app.locator(`[data-panel-id="${painel}"] [data-folha]`)
  const box = (await folha.boundingBox())!
  const ler = () =>
    folha.evaluate((el) => ({
      ang: Number.parseFloat(el.style.getPropertyValue('--f-ang') || '0'),
      lift: Number.parseFloat(el.style.getPropertyValue('--f-lift') || '0'),
    }))

  // um sopro rápido da esquerda pra direita na base da folha
  const y = box.y + box.height * 0.85
  await app.mouse.move(box.x + 10, y)
  await app.mouse.move(box.x + box.width - 10, y, { steps: 6 })
  const soprada = await ler()
  expect(soprada.ang).toBeLessThan(-0.5)
  expect(soprada.lift).toBeGreaterThan(0.3)

  // pega e puxa: segue a mão; solta: volta ao prumo
  await app.mouse.move(box.x + box.width / 2, y)
  await app.mouse.down()
  await app.mouse.move(box.x + box.width * 0.8, y, { steps: 8 })
  await expect(folha).toHaveClass(/is-pega/)
  expect((await ler()).ang).toBeLessThan(-5)
  await app.mouse.up()
  await expect(folha).not.toHaveClass(/is-pega/)

  await app.mouse.move(5, 5)
  await expect.poll(async () => Math.abs((await ler()).ang), { timeout: 8000 }).toBeLessThan(0.3)
})

test('sem pin, a tira inteira fica no fluxo vertical', async ({ app }) => {
  test.skip(DESKTOP.includes(test.info().project.name), 'Reduced motion e telas estreitas')
  await expect(app.locator('[data-harness-scene="pilares"]')).toHaveClass(/is-static/)
  await expect(app.locator('.tr-capa')).toHaveCount(3)
  expect(await app.locator('.tr-trabalho').count()).toBeGreaterThanOrEqual(3)
})

test('coleta baseline de frames na travessia', async ({ app, browserName }) => {
  test.skip(
    browserName !== 'chromium' || test.info().project.name !== 'chromium-desktop',
    'Baseline de frame usa um único ambiente fixo',
  )
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.1))
  const metrics = await app.evaluate(async () => {
    const h = window.__LEOVOX_HARNESS__!
    const inicio = window.scrollY
    const varrer = (async () => {
      for (let i = 0; i < 90; i += 1) {
        window.scrollTo(0, inicio + i * 40)
        await new Promise((r) => requestAnimationFrame(r))
      }
    })()
    const m = await h.collectFrameMetrics(1200)
    await varrer
    return m
  })
  expect(metrics.frameCount).toBeGreaterThan(5)
  expect(Number.isFinite(metrics.p95FrameMs)).toBe(true)
  test.info().annotations.push({ type: 'p95FrameMs', description: metrics.p95FrameMs.toFixed(1) })
})
