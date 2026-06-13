// Cena 2 · Manifesto · A recusa em 4 atos.
// O pin e o snap dao o ritmo; a lamina e GESTO, nao camera: cruzou o
// limiar, a transicao dispara em tempo real e sempre conclui, em
// qualquer direcao e ritmo de scroll. O scroll nunca descansa no meio
// de uma fatiada (exigencia do PO). As entradas de conteudo sao CSS
// puro disparado por classe (lei da entrada de cena), e o estado da
// cena e funcao do ato corrente, trocado sob a cobertura da lamina.

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import { ACT_BG, ACT_LINE, D, desiredAct, restFor } from './actMath'

export function useManifestoScroll(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-static')
      return
    }

    const atos = Array.from(section.querySelectorAll<HTMLElement>('.mf-ato'))
    const bladeGreen = section.querySelector<HTMLElement>('.mf-blade-green')
    const bladeDark = section.querySelector<HTMLElement>('.mf-blade-dark')
    if (!bladeGreen || !bladeDark) return

    let current = 0
    let lastT = 0
    let tl: gsap.core.Timeline | null = null
    let tlFrom = 0
    let tlTo = 0
    let idle = 0

    const applyAct = (k: number) => {
      current = k
      section.style.backgroundColor = ACT_BG[k]
      section.style.setProperty('--mf-line', ACT_LINE[k])
      atos.forEach((el, i) => {
        el.style.visibility = i === k ? 'visible' : 'hidden'
        el.classList.toggle('is-on', i === k)
      })
    }

    // as laminas nascem com transform de posse do GSAP: o translateY(100%)
    // do CSS e decomposto em px (y: 900) e contaminaria a soma com o
    // yPercent das tweens (a saida -100% terminava em zero, coberta)
    gsap.set([bladeGreen, bladeDark], { y: 0, yPercent: 100 })

    // estado inicial sem disparar a entrada do ato 1 (quem dispara e o
    // gatilho de viewport, pra cena nunca chegar em branco)
    section.style.backgroundColor = ACT_BG[0]
    section.style.setProperty('--mf-line', ACT_LINE[0])
    atos.forEach((el, i) => {
      el.style.visibility = i === 0 ? 'visible' : 'hidden'
    })

    const playBlade = (from: number, to: number) => {
      // a lamina veste a cor do ato de destino: cobre, troca e se funde
      // com o novo fundo na saida (decisao do PO, transicao mais suave)
      const blade = bladeGreen
      blade.style.backgroundColor = ACT_BG[to]
      const dir = to > from ? 1 : -1
      tlFrom = from
      tlTo = to
      tl = gsap.timeline({
        onComplete: () => {
          tl = null
          window.clearTimeout(idle)
          idle = window.setTimeout(settle, 80)
        },
        onReverseComplete: () => {
          tl = null
          window.clearTimeout(idle)
          idle = window.setTimeout(settle, 80)
        },
      })
      tl.fromTo(
        blade,
        { yPercent: dir > 0 ? 100 : -100 },
        { yPercent: 0, duration: 0.42, ease: 'power3.in' },
      )
      // o call dispara nos dois sentidos: na ida aplica o destino, na
      // volta restaura a origem (troca sempre sob a lamina)
      tl.call(() => applyAct(tl && tl.reversed() ? tlFrom : tlTo))
      tl.to(blade, { yPercent: dir > 0 ? -100 : 100, duration: 0.55, ease: 'power3.out' })
    }

    // Gravidade de ato (no lugar do snap cego): quando o scroll para,
    // a tela assenta no descanso do ato CORRENTE. Mudar de ato e so por
    // travessia deliberada do limiar; inercia nunca pula ato sozinha.
    const settle = () => {
      if (tl) return
      const restT = restFor(current, lastT)
      if (Math.abs(lastT - restT) < 0.04) return
      const pos = st.start + (restT / D) * (st.end - st.start)
      getLenis()?.scrollTo(pos, {
        duration: 0.6,
        easing: (x: number) => 1 - Math.pow(1 - x, 3),
      })
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=400%',
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const t = self.progress * D
        const jumped = Math.abs(t - lastT) > 2.4
        lastT = t
        window.clearTimeout(idle)
        idle = window.setTimeout(settle, 150)
        const want = desiredAct(current, t)

        if (tl) {
          // reverteu no meio da fatiada: a lamina volta, sem nunca parar
          if (want === tlFrom && !tl.reversed()) tl.reversed(true)
          else if (want === tlTo && tl.reversed()) tl.reversed(false)
          return
        }
        if (want === current) return

        // so o salto instantaneo real (ancora, drag da barra) corta seco;
        // travessia rapida de mais de um ato tambem ganha lamina
        if (jumped) {
          gsap.set([bladeGreen, bladeDark], { y: 0, yPercent: 100 })
          applyAct(want)
          return
        }
        playBlade(current, want)
      },
    })

    // entrada do ato 1 quando a cena entra em quadro, antes do pin:
    // a tela nunca fica so com as linhas de fundo
    const intro = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      once: true,
      onEnter: () => {
        // num teleporte o ato corrente ja pode ser outro: nao suja
        if (current === 0) atos[0].classList.add('is-on')
      },
    })

    return () => {
      window.clearTimeout(idle)
      tl?.kill()
      st.kill()
      intro.kill()
    }
  }, [sectionRef])
}
