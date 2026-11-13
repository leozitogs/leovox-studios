import { expect, test } from './fixtures'

// Cena 7 · Sobre (decisões 78 e 79): a folha sobe por cima do fecho dos
// Pilares com as fitas na borda, a folha de contato se revela e a mão
// circula o take de cada tira.
const ESTATICO = (nome: string) => nome.includes('reduced-motion') || nome.includes('mobile')

test('a folha sobe por cima do fecho, que fica parado atrás', async ({ app }) => {
  test.skip(ESTATICO(test.info().project.name), 'Sem pin, a folha entra no fluxo')
  const ir = (p: number) =>
    app.evaluate((v) => window.__LEOVOX_HARNESS__!.setProgress('sobre', v), p)
  const topoPilares = () =>
    app.evaluate(() => document.querySelector('.pilares')!.getBoundingClientRect().top)

  await ir(0.06)
  // o fecho continua no quadro enquanto a folha cobre
  await expect.poll(topoPilares, { timeout: 4000 }).toBeLessThan(2)
  expect(await topoPilares()).toBeGreaterThan(-2)
  const cobre = await app.evaluate(() =>
    Number(getComputedStyle(document.querySelector('.pilares')!).getPropertyValue('--cobre')),
  )
  expect(cobre).toBeGreaterThan(0)
  expect(cobre).toBeLessThan(1)

  // a folha tem os cantos de cima arredondados e as duas fitas
  const raio = await app
    .locator('.sobre')
    .evaluate((el) => Number.parseFloat(getComputedStyle(el).borderTopLeftRadius))
  expect(raio).toBeGreaterThanOrEqual(18)
  await expect(app.locator('.sv-fita')).toHaveCount(2)
  await expect(app.locator('.sv-fita--set')).toBeInViewport()
})

test('as fitas correm sozinhas e em sentidos opostos', async ({ app }) => {
  test.skip(ESTATICO(test.info().project.name), 'Sem pin, as fitas ficam paradas')
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('sobre', 0.08))
  // o salto do harness é uma rolagem enorme: espera a fita voltar à base
  await app.waitForTimeout(1500)
  // posição e largura de um jogo, pra desfazer a volta do trilho
  const x = () =>
    app.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.sv-fita-trilho')].map((t) => ({
        x: new DOMMatrix(getComputedStyle(t).transform).m41,
        w: (t.firstElementChild as HTMLElement).getBoundingClientRect().width,
      })),
    )
  const antes = await x()
  await app.waitForTimeout(250)
  const depois = await x()
  const passo = depois.map(({ x: v, w }, i) => {
    const d = v - antes[i].x
    return d - Math.round(d / w) * w
  })
  // as duas andam, devagar, uma pra cada lado
  expect(Math.abs(passo[0])).toBeGreaterThan(0.5)
  expect(Math.abs(passo[1])).toBeGreaterThan(0.5)
  expect(Math.sign(passo[0])).toBe(-Math.sign(passo[1]))
})

test('cada tira se revela e a mão circula o take, e desfaz na volta', async ({ app }) => {
  test.skip(ESTATICO(test.info().project.name), 'Sem pin, tudo já vem circulado')
  const primeira = app.locator('.sv-tira').first()
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('sobre', 0.04))
  await expect(primeira).not.toHaveClass(/is-circulada/)
  expect(
    Number(await primeira.evaluate((el) => el.style.getPropertyValue('--revela'))),
  ).toBeLessThan(0.5)

  await primeira.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await expect(primeira).toHaveClass(/is-circulada/, { timeout: 4000 })
  await expect
    .poll(() => primeira.evaluate((el) => Number(el.style.getPropertyValue('--revela'))))
    .toBeGreaterThan(0.95)

  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('sobre', 0.02))
  await expect(primeira).not.toHaveClass(/is-circulada/, { timeout: 4000 })
})

test('a folha de contato é uma lista em ordem e só declara placeholders', async ({ app }) => {
  await expect(app.locator('ol.sv-tiras > li')).toHaveCount(3)
  const anos = await app.locator('.sv-tira').evaluateAll((els) => els.map((e) => e.dataset.ano))
  expect(anos).toEqual(['2020', '2023', '2025'])
  await expect(app.locator('.sv-take.is-escolhido')).toHaveCount(3)
  // sem foto real, todo take e toda prova se declaram placeholder
  const semDeclarar = await app.evaluate(
    () =>
      document.querySelectorAll(
        '.sv-take:not([data-placeholder]), .sv-prova:not([data-placeholder])',
      ).length,
  )
  expect(semDeclarar).toBe(0)
  // o elenco são provas no varal, não crachás
  await expect(app.locator('.sv-varal .sv-prova')).toHaveCount(3)
})

test('sem pin, a cena já vem revelada, circulada e assinada', async ({ app }) => {
  test.skip(!ESTATICO(test.info().project.name), 'Só reduced motion e telas estreitas')
  await expect(app.locator('.sobre')).toHaveClass(/is-estatica/)
  await expect(app.locator('.sv-tira.is-circulada')).toHaveCount(3)
  await expect(app.locator('.sv-tese')).toHaveClass(/is-assinada/)
})
