import { expect, test } from './fixtures'

test('expõe as cenas estruturais na ordem do filme', async ({ app }) => {
  const scenes = await app.evaluate(() => window.__LEOVOX_HARNESS__!.listScenes())
  expect(scenes).toEqual(['hero', 'manifesto', 'pilares'])
})

test('Pilares contém exatamente três frentes oficiais', async ({ app }) => {
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.enterScene('pilares'))
  const headings = (await app.locator('.pl-q-frente').allTextContents()).map((text) =>
    text.toLocaleUpperCase('pt-BR'),
  )
  expect(headings).toHaveLength(3)
  expect(headings).toEqual(['IDENTIDADE & DESIGN', 'PRESENÇA DIGITAL', 'TECNOLOGIA & AUTOMAÇÃO'])
  await expect(app.locator('.pl-nav-btn')).toHaveCount(3)
})

test('Pilares prepara três trabalhos reais sem fingir assets publicados', async ({ app }) => {
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.4))

  const projects = app.locator('.pl-project')
  await expect(projects).toHaveCount(3)
  expect(
    await projects.evaluateAll((items) =>
      items.map((item) => item.getAttribute('data-project-placeholder')),
    ),
  ).toEqual(['true', 'true', 'true'])
  await expect(app.locator('.pl-asset[data-asset-request]')).toHaveCount(10)
  await expect(app.locator('.pl-asset.is-placeholder figcaption').first()).toContainText(
    'ASSET SOLICITADO',
  )

  if (test.info().project.name === 'chromium-mobile') return

  const identityToggle = app.locator('.pl-view-switch')
  await identityToggle.click()
  await expect(identityToggle).toHaveAttribute('aria-pressed', 'true')

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.63))
  const landscapeFormat = app.locator('.pl-format-controls button').nth(2)
  await landscapeFormat.click()
  await expect(landscapeFormat).toHaveAttribute('aria-pressed', 'true')

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.84))
  const runFlow = app.locator('.pl-run-flow')
  await runFlow.click()
  await expect(runFlow).toHaveAttribute('aria-pressed', 'true')
})

test('Manifesto e Pilares aceitam posicionamento determinístico', async ({ app }) => {
  const manifesto = await app.evaluate(() =>
    window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.5),
  )
  expect(manifesto.id).toBe('manifesto')
  expect(manifesto.rect.top + manifesto.rect.height).toBeGreaterThan(0)

  const pilares = await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.72))
  expect(pilares.id).toBe('pilares')
  if (test.info().project.name === 'chromium-reduced-motion') expect(pilares.progress).toBeNull()
  else expect(pilares.progress).toBeGreaterThan(0.65)
})

test('índice do Manifesto acompanha e navega entre os quatro atos', async ({ app }) => {
  test.skip(
    !['chromium-desktop', 'chromium-compact'].includes(test.info().project.name),
    'O índice visual desta rodada começa em tablet e desktop',
  )

  const nav = app.locator('.mf-act-nav')
  const buttons = nav.locator('.mf-act-nav-btn')
  await expect(buttons).toHaveCount(4)

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 0.1))
  await expect(nav).not.toHaveClass(/is-visible/)

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 0.82))
  await expect(nav).not.toHaveClass(/is-visible/)

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 0.94))
  await expect(nav).toHaveClass(/is-visible/)
  await expect(buttons.first()).toHaveAttribute('aria-current', 'step')

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.5))
  await expect(nav).toHaveClass(/is-visible/)
  await expect(buttons.nth(2)).toHaveAttribute('aria-current', 'step')

  await buttons.first().evaluate((button) => (button as HTMLButtonElement).click())
  await expect(buttons.first()).toHaveAttribute('aria-current', 'step', { timeout: 4000 })

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.enterScene('pilares'))
  await expect(nav).not.toHaveClass(/is-visible/)
})
