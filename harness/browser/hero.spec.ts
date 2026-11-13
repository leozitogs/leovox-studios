import { expect, test } from './fixtures'

// O disparo do hero (decisão 77): a frase cai em duas partes e a
// assinatura (o pixo verde) se desfaz no mesmo ritmo; quando a frase
// assenta, a mão reescreve a assinatura e a última palavra passa a trocar
// no lugar, sempre em branco e na mesma fonte.
const PALAVRAS = ['SONHOS.', 'PROJETOS.', 'PLANOS.', 'NEGÓCIOS.', 'PRODUTOS.']

const tinta = () => {
  const tracos = [...document.querySelectorAll<SVGPathElement>('.hero-grafism .pixo-traco')]
  const visiveis = tracos.filter((t) => getComputedStyle(t).visibility !== 'hidden').length
  const cheio = document.querySelector<SVGImageElement>('.hero-grafism .pixo-cheio')
  return {
    total: tracos.length,
    visiveis,
    cheio: Number(cheio ? getComputedStyle(cheio).opacity : 0),
  }
}
const palavra = () =>
  document.querySelector<HTMLElement>('.headline-ghost .hl-troca')?.textContent ?? ''
const escalaA = () =>
  new DOMMatrix(getComputedStyle(document.querySelector('.headline-ghost .hl-a')!).transform).a

test('a frase cai, a assinatura se desfaz e volta escrita por cima', async ({ app }) => {
  test.skip(
    test.info().project.name.includes('reduced-motion'),
    'Sem movimento, o hero já nasce no estado final',
  )
  const hero = app.locator('[data-harness-scene="hero"]')
  const ir = (p: number) =>
    app.evaluate((v) => window.__LEOVOX_HARNESS__!.setProgress('hero', v), p)

  await ir(0)
  await expect.poll(() => app.evaluate(tinta)).toMatchObject({ total: 25, visiveis: 25, cheio: 1 })
  await expect(hero).not.toHaveClass(/is-assentado/)

  // a frase assentou e a mão está sem tinta
  await ir(0.3)
  await expect.poll(() => app.evaluate(tinta), { timeout: 4000 }).toMatchObject({ visiveis: 0 })
  await expect(hero).toHaveClass(/is-assentado/)
  await expect.poll(() => app.evaluate(escalaA)).toBeGreaterThan(1.5)

  // a mão reescreveu a assinatura inteira
  await ir(0.62)
  await expect
    .poll(() => app.evaluate(tinta), { timeout: 4000 })
    .toMatchObject({ visiveis: 25, cheio: 1 })

  // a volta desfaz na ordem: a palavra volta a ser SONHOS. e a frase sobe
  await ir(0.1)
  await expect(hero).not.toHaveClass(/is-assentado/, { timeout: 4000 })
  expect(await app.evaluate(palavra)).toBe('SONHOS.')
  await ir(0)
  await expect.poll(() => app.evaluate(escalaA), { timeout: 4000 }).toBeLessThan(1.01)
  await expect.poll(() => app.evaluate(tinta)).toMatchObject({ visiveis: 25, cheio: 1 })
})

test('a palavra troca no lugar, em branco, sem empurrar a frase', async ({ app }) => {
  test.skip(
    test.info().project.name.includes('reduced-motion'),
    'Sem movimento, a palavra não troca',
  )
  await app.evaluate(() => window.__LEOVOX_HARNESS__!.setProgress('hero', 0.45))
  await expect(app.locator('[data-harness-scene="hero"]')).toHaveClass(/is-assentado/, {
    timeout: 4000,
  })
  const antes = await app.locator('.headline-ghost .hl-b').boundingBox()
  await expect
    .poll(() => app.evaluate(palavra), { timeout: 6000, intervals: [100] })
    .not.toBe('SONHOS.')
  await expect.poll(() => app.evaluate(palavra), { timeout: 2000 }).toMatch(/^[A-ZÓ.]+$/)
  expect(PALAVRAS).toContain(await app.evaluate(palavra))

  const troca = app.locator('.headline-ghost .hl-troca')
  expect(await troca.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(251, 251, 251)')
  expect(await troca.evaluate((el) => getComputedStyle(el).fontFamily)).toContain('Extenda')
  // a medida segura a linha: a troca não mexe na caixa de SEUS
  expect(await app.locator('.headline-ghost .hl-b').boundingBox()).toEqual(antes)
  // o leitor de tela lê sempre a frase original
  await expect(app.locator('.headline-ghost .hl-medida')).toHaveText('SONHOS.')
})

test('com reduced motion, a frase já está assentada e assinada', async ({ app }) => {
  test.skip(
    !test.info().project.name.includes('reduced-motion'),
    'Só o projeto de movimento reduzido',
  )
  await expect(app.locator('[data-harness-scene="hero"]')).toHaveClass(/is-assentado/)
  expect(await app.evaluate(tinta)).toMatchObject({ visiveis: 25, cheio: 1 })
  await app.waitForTimeout(3000)
  expect(await app.evaluate(palavra)).toBe('SONHOS.')
})
