import { expect, test } from './fixtures'

test('expõe as cenas estruturais na ordem do filme', async ({ app }) => {
  const scenes = await app.evaluate(() => window.__LEOVOX_HARNESS__!.listScenes())
  expect(scenes).toEqual(['hero', 'manifesto', 'pilares', 'sobre'])
})

test('Pilares abre uma capa por frente oficial, na ordem', async ({ app }) => {
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.enterScene('pilares'))
  const capas = (await app.locator('.tr-capa-nome').allTextContents()).map((text) =>
    text.toLocaleUpperCase('pt-BR'),
  )
  expect(capas).toEqual(['IDENTIDADE & DESIGN', 'PRESENÇA DIGITAL', 'TECNOLOGIA & AUTOMAÇÃO'])
  await expect(app.locator('.pl-nav-btn')).toHaveCount(3)
})

test('a tira só declara placeholders, nunca cases falsos', async ({ app }) => {
  const trabalhos = app.locator('.tr-trabalho')
  expect(await trabalhos.count()).toBeGreaterThanOrEqual(3)
  const estado = await trabalhos.evaluateAll((items) =>
    items.map((item) => ({
      frente: item.getAttribute('data-frente'),
      placeholder: item.getAttribute('data-placeholder'),
      temMidia: Boolean(item.querySelector('.tr-midia img, .tr-midia video')),
      paragrafos: item.querySelectorAll('.tr-info p:not(.tr-ordem):not(.tr-tipo):not(.tr-anotacao)')
        .length,
    })),
  )
  for (const frente of ['identidade', 'digital', 'tecnologia']) {
    expect(estado.some((t) => t.frente === frente)).toBe(true)
  }
  for (const t of estado) {
    // placeholder não carrega mídia; trabalho com mídia não é placeholder
    expect(t.placeholder === 'true').toBe(!t.temMidia)
    expect(t.paragrafos).toBe(0)
  }
  const legendas = app.locator('.tr-trabalho[data-placeholder="true"] .tr-ph-legenda')
  await expect(legendas.first()).toContainText('Placeholder')
})

test('nenhum título de capa ou de trabalho estoura a coluna', async ({ app }) => {
  test.skip(
    !['chromium-desktop', 'chromium-compact'].includes(test.info().project.name),
    'Laptop e desktop primeiro; a responsividade fina vem depois',
  )
  const estouros = await app.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('.tr-titulo, .tr-capa-nome')]
      .filter((el) => el.scrollWidth > el.clientWidth + 1)
      .map((el) => el.textContent),
  )
  expect(estouros).toEqual([])
})

test('Manifesto e Pilares aceitam posicionamento determinístico', async ({ app }) => {
  const manifesto = await app.evaluate(() =>
    window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.5),
  )
  expect(manifesto.id).toBe('manifesto')
  expect(manifesto.rect.top + manifesto.rect.height).toBeGreaterThan(0)

  const pilares = await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.72))
  expect(pilares.id).toBe('pilares')
  const semPin = await app.locator('.pilares.is-static').count()
  if (semPin) expect(pilares.progress).toBeNull()
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
