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
import { getLenis } from '../../lib/lenis'
import { registrarDestino } from '../../lib/navegar'

const MANIFESTO_PREVIEW_EVENT = 'leovox:manifesto-preview'

export function useManifestoScroll(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const atos = Array.from(section.querySelectorAll<HTMLElement>('.mf-ato'))
    const nav = section.querySelector<HTMLElement>('.mf-act-nav')
    const navButtons = Array.from(section.querySelectorAll<HTMLButtonElement>('.mf-act-nav-btn'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let heroPreviewVisible = document.documentElement.dataset.manifestoNavReady === 'true'
    let manifestoVisible = false
    let manifestoPassed = false

    if (reducedMotion) section.classList.add('is-static')

    // destino do menu (Sobre): o primeiro ato
    const tiraDestino = registrarDestino('manifesto', () => {
      const ato = atos[0]
      return ato ? window.scrollY + ato.getBoundingClientRect().top : null
    })

    const setVisible = (visible: boolean) => {
      if (!nav) return
      nav.classList.toggle('is-visible', visible)
      nav.inert = !visible
      nav.setAttribute('aria-hidden', String(!visible))
    }

    // O índice nasce como prévia quando o card do hero assenta (92% do
    // pin) e vive até o fim do manifesto. Antes, a regra escrita era
    // "prévia E manifesto ativo", e só funcionava porque o isActive vinha
    // undefined no refresh: toggle(classe, undefined) INVERTE a classe, o
    // que acendia o índice na prévia e o deixava aceso por cima dos
    // Pilares depois de um salto. Agora a regra é explícita.
    const syncVisibility = () =>
      setVisible(reducedMotion ? manifestoVisible : heroPreviewVisible && !manifestoPassed)

    const readTrigger = (self: ScrollTrigger) => {
      manifestoVisible = self.progress > 0 && self.progress < 1
      manifestoPassed = self.progress >= 1
    }

    const onHeroPreview = (event: Event) => {
      heroPreviewVisible = (event as CustomEvent<{ visible: boolean }>).detail.visible
      syncVisibility()
    }
    window.addEventListener(MANIFESTO_PREVIEW_EVENT, onHeroPreview)

    const setActive = (index: number) => {
      navButtons.forEach((button, buttonIndex) => {
        button.classList.toggle('is-active', buttonIndex === index)
        if (buttonIndex === index) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
      })
    }

    const updateActive = () => {
      const marker = window.innerHeight * 0.55
      const containing = atos.findIndex((ato) => {
        const rect = ato.getBoundingClientRect()
        return rect.top <= marker && rect.bottom > marker
      })
      if (containing >= 0) setActive(containing)
    }

    const navTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        readTrigger(self)
        syncVisibility()
        if (self.isActive) updateActive()
      },
      // um salto direto do topo pros Pilares atravessa o gatilho inteiro
      // sem ligá-lo, e o onToggle não dispara; o onUpdate sim
      onUpdate: (self) => {
        readTrigger(self)
        syncVisibility()
        updateActive()
      },
      onRefresh: (self) => {
        readTrigger(self)
        syncVisibility()
        updateActive()
      },
    })

    const reveals = reducedMotion
      ? []
      : atos.map((el) =>
          ScrollTrigger.create({
            trigger: el,
            // liga quando o texto do ato pisa na tela, não depois: com
            // 'top 62%' o texto já estava em quadro e ainda invisível
            start: 'top 85%',
            onEnter: () => el.classList.add('is-on'),
            onLeaveBack: () => el.classList.remove('is-on'),
          }),
        )

    const navHandlers = navButtons.map((button, index) => {
      const handler = () => {
        const target = atos[index]
        if (!target) return
        const top = window.scrollY + target.getBoundingClientRect().top
        const lenis = getLenis()
        if (lenis) {
          lenis.scrollTo(
            top,
            reducedMotion
              ? { immediate: true }
              : { duration: 0.8, easing: (x: number) => 1 - Math.pow(1 - x, 3) },
          )
        } else window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' })
      }
      button.addEventListener('click', handler)
      return handler
    })

    return () => {
      tiraDestino()
      navTrigger.kill()
      window.removeEventListener(MANIFESTO_PREVIEW_EVENT, onHeroPreview)
      reveals.forEach((reveal) => reveal.kill())
      navButtons.forEach((button, index) => button.removeEventListener('click', navHandlers[index]))
    }
  }, [sectionRef])
}
