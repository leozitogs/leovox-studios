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
    page.on('requestfailed', (request) =>
      errors.push(`request: ${request.url()} ${request.failure()?.errorText ?? ''}`),
    )

    await page.goto('/?harness=1')
    await page.waitForFunction(() => Boolean(window.__LEOVOX_HARNESS__))
    await page.evaluate(() => window.__LEOVOX_HARNESS__!.ready())
    await provide(page)
    expect(errors, errors.join('\n')).toEqual([])
  },
})

export { expect } from 'playwright/test'
