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
