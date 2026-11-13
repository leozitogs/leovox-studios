import { expect, test } from 'playwright/test'

// Sem WebGL (GPU bloqueada, driver na lista negra, CI sem GPU) o filme
// precisa abrir inteiro, sem erro de console, e sem o canvas persistente.
test('abre sem erro quando o navegador não oferece WebGL', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null
      return (original as (...args: unknown[]) => unknown).call(this, type, ...rest)
    } as typeof HTMLCanvasElement.prototype.getContext
  })

  await page.goto('/?harness=1')
  await page.waitForFunction(() => Boolean(window.__LEOVOX_HARNESS__))
  await page.evaluate(() => window.__LEOVOX_HARNESS__!.ready())

  await expect(page.locator('.persistent-canvas')).toHaveAttribute('data-webgl', 'off')
  await expect(page.locator('.persistent-canvas canvas')).toHaveCount(0)
  const scenes = await page.evaluate(() => window.__LEOVOX_HARNESS__!.listScenes())
  expect(scenes).toEqual(['hero', 'manifesto', 'pilares', 'sobre'])
  expect(errors, errors.join('\n')).toEqual([])
})
