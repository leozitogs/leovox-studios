// Cena 2 · Manifesto · Uma pagina unica de caderno, longa, lida no
// scroll natural (referencia getquoti.ai): nada de pin, nada de troca
// de tela. Cada ato revela quando entra em quadro (classe is-on,
// entradas em CSS puro, lei 3) e desfaz a revelacao quando sai por
// baixo, entao na volta a coreografia reexecuta.
//
// O fio verde que costurava a pagina saiu de cena por direcao do PO
// (2026-08-15); a geometria dele (actMath) saiu junto.

import { type RefObject, useEffect } from 'react'
import { ScrollTrigger } from '../../lib/gsap'

export function useManifestoScroll(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-static')
      return
    }

    const atos = Array.from(section.querySelectorAll<HTMLElement>('.mf-ato'))
    const reveals = atos.map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 62%',
        onEnter: () => el.classList.add('is-on'),
        onLeaveBack: () => el.classList.remove('is-on'),
      }),
    )

    return () => reveals.forEach((r) => r.kill())
  }, [sectionRef])
}
