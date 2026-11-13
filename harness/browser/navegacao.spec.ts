import { expect, test } from './fixtures'

const DESKTOP = ['chromium-desktop', 'chromium-compact', 'firefox-desktop']

test('sem gesto de quem lê (refresh, scroll restaurado), a pill já chega pronta', async ({
  app,
}) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'Navbar de laptop primeiro')
  const quadros = await app.evaluate(async () => {
    window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.3)
    const n = document.querySelector<HTMLElement>('.nav-pill')!
    const out: Array<{ op: number; clip: string }> = []
    for (let i = 0; i < 3; i += 1) {
      await new Promise((r) => requestAnimationFrame(r))
      const cs = getComputedStyle(n)
      out.push({ op: Number(cs.opacity), clip: cs.clipPath })
    }
    return out
  })
  // já no primeiro quadro: visível e com a forma aberta, sem coreografia
  for (const q of quadros) {
    expect(q.op).toBe(1)
    expect(q.clip).toContain('inset(0px')
    expect(q.clip).not.toMatch(/inset\(0px [1-9]/)
  }
})

test('com gesto de quem lê, a pill nasce da bola sem mexer na largura', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'Navbar de laptop primeiro')
  await app.mouse.move(720, 450)
  await app.mouse.wheel(0, 10)
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 0.6))
  await app.waitForTimeout(800)
  const larguras = await app.evaluate(async () => {
    const n = document.querySelector<HTMLElement>('.nav-pill')!
    window.__LEOVOX_HARNESS__!.setProgress('hero', 0.7)
    const ws = new Set<number>()
    const clips: string[] = []
    const t0 = performance.now()
    while (performance.now() - t0 < 1500) {
      ws.add(Math.round(n.getBoundingClientRect().width))
      clips.push(getComputedStyle(n).clipPath)
      await new Promise((r) => requestAnimationFrame(r))
    }
    return { ws: [...ws], primeiro: clips[0], ultimo: clips[clips.length - 1] }
  })
  // a forma abre por máscara: a caixa da pill nunca muda de largura
  expect(larguras.ws.length).toBe(1)
  expect(larguras.primeiro).toMatch(/round 32px/)
  expect(larguras.ultimo).toContain('round 16px')
})

test('o menu leva a cada cena e marca onde você está', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'Navbar de laptop primeiro')
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 1))
  const pill = app.locator('.nav-pill')
  await expect(pill).toHaveClass(/is-open/, { timeout: 6000 })
  const cena = app.locator('[data-harness-scene="pilares"]')
  const atual = app.locator('.nav-link[aria-current]')

  // Projetos: longe, salta pela lâmina até o primeiro trabalho, e a pill
  // continua à mostra depois do salto
  await app.locator('.nav-link[data-secao="projetos"]').click()
  await expect(cena).toHaveAttribute('data-panel', 'identidade-01', { timeout: 8000 })
  await expect(atual).toHaveAttribute('data-secao', 'projetos')
  await expect(app.locator('.lamina')).toBeHidden({ timeout: 4000 })

  // Serviços: a capa da primeira frente
  await app.mouse.move(720, 30)
  await app.locator('.nav-link[data-secao="servicos"]').click()
  await expect(cena).toHaveAttribute('data-panel', 'capa-identidade', { timeout: 8000 })
  await expect(atual).toHaveAttribute('data-secao', 'servicos')

  // Sobre: a Cena 7, a folha que sobe depois do fecho dos Pilares
  await app.mouse.move(720, 30)
  await app.locator('.nav-link[data-secao="sobre"]').click()
  await expect(atual).toHaveAttribute('data-secao', 'sobre', { timeout: 8000 })
  await expect(app.locator('#sobre-titulo')).toBeInViewport()
  await expect(app.locator('.lamina')).toBeHidden({ timeout: 4000 })

  // o logo volta ao início
  await app.mouse.move(720, 30)
  await app.locator('.nav-logo').click()
  await expect.poll(() => app.evaluate(() => window.scrollY), { timeout: 8000 }).toBeLessThan(5)
})

test('a pill escondida volta com o cursor no topo e com o Tab', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'Navbar de laptop primeiro')
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.3))
  await app.waitForTimeout(600)
  const pill = app.locator('.nav-pill')
  const topo = () => pill.evaluate((el) => el.getBoundingClientRect().top)

  await app.mouse.move(720, 600)
  for (let i = 0; i < 6; i += 1) await app.mouse.wheel(0, 140)
  await expect.poll(topo, { timeout: 4000 }).toBeLessThan(0)

  await app.mouse.move(720, 30)
  await expect.poll(topo, { timeout: 4000 }).toBeGreaterThan(0)

  await app.mouse.move(720, 600)
  for (let i = 0; i < 6; i += 1) await app.mouse.wheel(0, 140)
  await expect.poll(topo, { timeout: 4000 }).toBeLessThan(0)
  await app.locator('.nav-link').first().focus()
  await expect.poll(topo, { timeout: 4000 }).toBeGreaterThan(0)
})

test('os alvos do menu têm 44px de altura', async ({ app }) => {
  test.skip(!DESKTOP.includes(test.info().project.name), 'Navbar de laptop primeiro')
  // medidos com a pill aberta: no nascimento ela ainda está em escala 0,6
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 1))
  await expect(app.locator('.nav-pill')).toHaveClass(/is-open/, { timeout: 6000 })
  await app.waitForTimeout(1500)
  const alturas = await app
    .locator('.nav-link')
    .evaluateAll((links) => links.map((l) => l.getBoundingClientRect().height))
  for (const h of alturas) expect(h).toBeGreaterThanOrEqual(44)
})
