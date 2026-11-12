import { expect, test as base, type Page } from 'playwright/test'

type HarnessFixtures = {
  app: Page
}

export const test = base.extend<HarnessFixtures>({
  app: async ({ page }, provide) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`)
    })
    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
    page.on('requestfailed', (request) => {
      const reason = request.failure()?.errorText ?? ''
      // Vídeo é baixado em pedaços: o navegador cancela e retoma o pedido
      // de mídia quando quer (o WebKit faz isso sempre). Isso não é asset
      // quebrado; asset quebrado volta como resposta com status de erro.
      if (request.resourceType() === 'media' && /cancel|abort/i.test(reason)) return
      errors.push(`request: ${request.url()} ${reason}`)
    })
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(`response: ${response.status()} ${response.url()}`)
    })

    await page.goto('/?harness=1')
    await page.waitForFunction(() => Boolean(window.__LEOVOX_HARNESS__))
    await page.evaluate(() => window.__LEOVOX_HARNESS__!.ready())
    await provide(page)
    expect(errors, errors.join('\n')).toEqual([])
  },
})

export { expect } from 'playwright/test'
