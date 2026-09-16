import { expect, test } from './fixtures'

const VIEWPORTS = [
  { name: 'tablet-retrato', width: 768, height: 1024, root: 16 },
  { name: 'tablet-paisagem', width: 1024, height: 768, root: 16 },
  { name: 'full-hd', width: 1920, height: 1080, root: 16 },
  { name: '2k', width: 2560, height: 1440, root: 21.333 },
  { name: '2.5k', width: 2560, height: 1600, root: 21.333 },
  { name: 'ultrawide', width: 3440, height: 1440, root: 21.333 },
  { name: '4k', width: 3840, height: 2160, root: 32 },
] as const

for (const viewport of VIEWPORTS) {
  test(`${viewport.name} preserva a geometria responsiva`, async ({ app }) => {
    await app.setViewportSize({ width: viewport.width, height: viewport.height })
    await app.evaluate(() => window.__LEOVOX_HARNESS__!.ready())

    const rootSize = await app.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
    )
    expect(rootSize).toBeCloseTo(viewport.root, 1)

    const overflow = await app.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('manifesto', 0.82))
    const manifesto = app.locator('.mf-ato-4')
    await expect(manifesto).toBeInViewport()
    const manifestoBox = await manifesto.boundingBox()
    expect(manifestoBox?.width).toBeLessThanOrEqual(viewport.width)

    await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.12))
    const lockup = await app.locator('.pl-lockup').boundingBox()
    const personagem = await app.locator('.pl-personagem').boundingBox()
    expect(lockup).not.toBeNull()
    expect(personagem).not.toBeNull()
    expect(
      Math.min(lockup!.x + lockup!.width, viewport.width) - Math.max(lockup!.x, 0),
    ).toBeGreaterThan(viewport.width * 0.18)
    expect(
      Math.min(personagem!.x + personagem!.width, viewport.width) - Math.max(personagem!.x, 0),
    ).toBeGreaterThan(viewport.width * 0.5)

    await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('pilares', 0.4))
    const navBoxes = await app.locator('.pl-nav-btn').evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      }),
    )
    for (const box of navBoxes) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  })
}
