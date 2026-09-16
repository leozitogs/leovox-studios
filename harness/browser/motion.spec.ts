import { expect, test } from './fixtures'

test('a navegação da tira conclui a ida e a volta', async ({ app }) => {
  test.skip(
    !['chromium-desktop', 'chromium-compact'].includes(test.info().project.name),
    'Invariante do pin pertence aos projetos desktop com movimento',
  )

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.4))
  const scene = app.locator('[data-harness-scene="pilares"]')
  const nav = app.locator('.pl-nav-btn')
  await expect(scene).toHaveAttribute('data-beat', '1')

  await nav.nth(2).click()
  await expect(scene).toHaveAttribute('data-beat', '3', { timeout: 6000 })

  await nav.nth(0).click()
  await expect(scene).toHaveAttribute('data-beat', '1', { timeout: 6000 })
})

test('reduced motion mantém todas as frentes no fluxo', async ({ app }) => {
  test.skip(
    test.info().project.name !== 'chromium-reduced-motion',
    'Contrato específico de reduced motion',
  )
  await expect(app.locator('[data-harness-scene="pilares"]')).toHaveClass(/is-static/)
  await expect(app.locator('.pl-quadro')).toHaveCount(3)
})

test('coleta baseline de frames em ambiente fixo', async ({ app, browserName }) => {
  test.skip(
    browserName !== 'chromium' || test.info().project.name !== 'chromium-desktop',
    'Baseline de frame usa um único ambiente fixo',
  )
  const metrics = await app.evaluate(() => window.__LEOVOX_HARNESS__!.collectFrameMetrics(350))
  expect(metrics.frameCount).toBeGreaterThan(5)
  expect(Number.isFinite(metrics.p95FrameMs)).toBe(true)
})
