import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

// Smooth scroll com Lenis (sucessor oficial do @studio-freight/lenis),
// sincronizado com o ticker do GSAP para o ScrollTrigger não perder frame.

let lenis: Lenis | null = null

function onTick(time: number): void {
  lenis?.raf(time * 1000)
}

export function initLenis(): Lenis {
  if (lenis) return lenis

  lenis = new Lenis()
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add(onTick)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

// Trava e destrava o scroll (roda, touch e teclado via Lenis). O
// loader trava no boot e so destrava quando o hero esta fixado.
export function stopLenis(): void {
  lenis?.stop()
}

export function startLenis(): void {
  lenis?.start()
}

export function destroyLenis(): void {
  gsap.ticker.remove(onTick)
  lenis?.destroy()
  lenis = null
}
