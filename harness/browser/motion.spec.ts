import { expect, test } from './fixtures'

const DESKTOP = ['chromium-desktop', 'chromium-compact', 'firefox-desktop']

// distância do painel ativo ao centro da tela, em telas
const desvioDoAtivo = () => {
  const cena = document.querySelector<HTMLElement>('[data-harness-scene="pilares"]')!
  const ids = [...cena.querySelectorAll<HTMLElement>('.pl-track > *')]
  const ativo = ids.find((el) => el.dataset.panelId === cena.dataset.panel)
  return Math.abs(Number.parseFloat(ativo?.style.getPropertyValue('--d') || 'NaN'))
}

test('[PIL-04] parado no meio da travessia, a tira assenta num painel', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'A tira pina em laptop e desktop')
  for (const progresso of [0.23, 0.48, 0.71]) {
    await app.evaluate((p) => window.__LEOVOX_HARNESS__!.setProgress('pilares', p), progresso)
    await app.waitForTimeout(150)
    await app.evaluate(() => window.__LEOVOX_HARNESS__!.settle(3000))
    expect(await app.evaluate(desvioDoAtivo)).toBeLessThan(0.02)
  }
})

test('[PIL-05] o trilho e o teclado navegam pela tira', async ({ app }) => {
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

test('[PIL-09] as folhas soltas balançam com o cursor e voltam ao prumo', async ({ app }) => {
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

test('[PIL-11] a ficha do trabalho sai quando a tira assenta e não cobre a peça', async ({
  app,
}) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'A ficha recolhe com a tira pinada')
  const cena = app.locator('[data-harness-scene="pilares"]')
  // procura um trabalho assentado
  for (const p of [0.3, 0.55, 0.8]) {
    await app.evaluate((v) => window.__LEOVOX_HARNESS__!.setProgress('pilares', v), p)
    await app.evaluate(() => window.__LEOVOX_HARNESS__!.settle(3000))
    if ((await cena.getAttribute('data-kind')) === 'trabalho') break
  }
  await expect(cena).toHaveAttribute('data-kind', 'trabalho')
  await expect(cena).not.toHaveClass(/is-andando/, { timeout: 4000 })
  const painel = (await cena.getAttribute('data-panel')) ?? ''
  const midia = app.locator(`[data-panel-id="${painel}"] .tr-midia`)
  const ficha = app.locator(`[data-panel-id="${painel}"] .tr-ficha`)

  // o cartão balança pela inércia do assentamento; girado, a caixa da
  // mídia cresce e infla a medida. Mede com ele parado no prumo.
  const cartao = app.locator(`[data-panel-id="${painel}"] .tr-cartao`)
  await expect
    .poll(
      () =>
        cartao.evaluate((el) =>
          Math.abs(Number.parseFloat(el.style.getPropertyValue('--f-ang') || '0')),
        ),
      { timeout: 6000 },
    )
    .toBeLessThan(0.3)

  // à mostra: a ficha desce abaixo do cartão, presa só pela beirada
  await expect
    .poll(async () => {
      const m = (await midia.boundingBox())!
      const f = (await ficha.boundingBox())!
      return f.y + f.height - (m.y + m.height)
    })
    .toBeGreaterThan(80)
  const m = (await midia.boundingBox())!
  const f = (await ficha.boundingBox())!
  // invade no máximo a dobra de 1,4rem por baixo do cartão (mais o giro)
  expect(m.y + m.height - f.y).toBeLessThanOrEqual(52)
  // e não encosta no trilho
  const trilho = (await app.locator('.tr-trilho').boundingBox())!
  expect(f.y + f.height).toBeLessThan(trilho.y)

  // a câmera andando recolhe a ficha
  await app.mouse.move(m.x + m.width / 2, m.y + m.height / 2)
  await app.mouse.wheel(0, 260)
  await expect(cena).toHaveClass(/is-andando/)
})

test('[PIL-08] sem pin, a tira inteira fica no fluxo vertical', async ({ app }) => {
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
