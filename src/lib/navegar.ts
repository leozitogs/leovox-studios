// Navegação deliberada (menu, e depois o CTA e o footer): cada cena
// registra onde ficam os seus destinos, e o menu só pede "ir pra X".
// A cena sabe a posição certa (os Pilares, por exemplo, sabem o descanso
// de cada painel dentro do pin); o menu não precisa saber.
//
// Como se vai: perto, rolagem suave pelo Lenis. Longe, a lâmina de verde
// chapado (a transição-assinatura da marca, a mesma da abertura) cobre a
// tela, o scroll salta por baixo dela e ela sai pelo lado oposto: o
// usuário não assiste o filme inteiro passar em fast-forward.
// Com reduced motion, salto direto.

import { gsap, ScrollTrigger } from './gsap'
import { getLenis } from './lenis'

type Resolver = () => number | null

const destinos = new Map<string, Resolver>()
let emSalto = false
let rolandoAte = 0

/**
 * Há uma navegação deliberada em curso (menu, trilho, teclado)? A
 * gravidade dos pins não pode puxar a página de volta no meio dela.
 */
export function navegando(): boolean {
  return emSalto || performance.now() < rolandoAte
}

/** Marca uma rolagem deliberada de `segundos` (o trilho dos Pilares usa). */
export function marcarRolagem(segundos: number): void {
  rolandoAte = Math.max(rolandoAte, performance.now() + segundos * 1000 + 120)
}

export const NAVEGOU_EVENT = 'leovox:navegou'

/** A cena registra um destino; devolve a função que o remove. */
export function registrarDestino(id: string, resolver: Resolver): () => void {
  destinos.set(id, resolver)
  return () => {
    if (destinos.get(id) === resolver) destinos.delete(id)
  }
}

export function destinoY(id: string): number | null {
  return destinos.get(id)?.() ?? null
}

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

// Longe é mais que 1,6 tela: a partir daí a rolagem suave atravessaria
// pins inteiros e a lâmina é mais honesta que um fast-forward.
const LONGE_EM_TELAS = 1.6

function avisar(id: string): void {
  window.dispatchEvent(new CustomEvent(NAVEGOU_EVENT, { detail: { id } }))
}

export async function irPara(id: string): Promise<boolean> {
  const y = destinoY(id)
  if (y === null || emSalto) return false
  const lenis = getLenis()
  const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const distancia = Math.abs(y - window.scrollY)

  if (!lenis || reduzido) {
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
    avisar(id)
    return true
  }

  if (distancia < window.innerHeight * LONGE_EM_TELAS) {
    avisar(id)
    marcarRolagem(1.1)
    lenis.scrollTo(y, { duration: 1.1, easing: easeInOutCubic, force: true })
    return true
  }

  const lamina = document.querySelector<HTMLElement>('.lamina')
  if (!lamina) {
    lenis.scrollTo(y, { immediate: true, force: true })
    avisar(id)
    return true
  }

  // descendo, a lâmina sobe de baixo e sai por cima; subindo, o contrário
  const descendo = y > window.scrollY
  const entra = descendo ? 100 : -100
  emSalto = true
  avisar(id)
  try {
    gsap.set(lamina, { yPercent: entra, visibility: 'visible' })
    await gsap.to(lamina, { yPercent: 0, duration: 0.45, ease: 'power3.in' })
    lenis.scrollTo(y, { immediate: true, force: true })
    ScrollTrigger.update()
    // dois quadros pra os pins assentarem por baixo da lâmina
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
    await gsap.to(lamina, { yPercent: -entra, duration: 0.65, ease: 'power4.out' })
  } finally {
    gsap.set(lamina, { yPercent: 100, visibility: 'hidden' })
    emSalto = false
  }
  return true
}
