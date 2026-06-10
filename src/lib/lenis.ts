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

export function destroyLenis(): void {
  gsap.ticker.remove(onTick)
  lenis?.destroy()
  lenis = null
}
