// Cena 3 · Pilares · A tira horizontal.
// Duas naturezas de movimento convivem aqui, cada uma na sua lei: a
// CHEGADA e camera scrubada (a luz caindo do off-white do manifesto
// pro #222222 da tira, como funcao pura do progresso, lei 2); a
// TRAVESSIA entre quadros e gesto por gatilho (padrao das decisoes 35
// e 47, rotacionado pra horizontal pelo briefing): cruzou o limiar, o
// slide dispara em tempo real e sempre conclui. O scroll nunca
// descansa no meio de uma travessia; parou, a gravidade assenta no
// descanso do beat corrente. Entradas de conteudo sao CSS puro por
// classe (lei 3), e todo tween e fromTo com valores explicitos (lei 5).

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import {
  BEATS,
  D,
  REST_BY_BEAT,
  TITULO_ON,
  desiredBeat,
  restFor,
  trackXPercent,
} from './pilaresMath'

export function usePilaresScroll(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('is-static')
      return
    }

    const track = section.querySelector<HTMLElement>('.pl-track')
    const textura = section.querySelector<HTMLElement>('.pl-textura')
    const abertura = section.querySelector<HTMLElement>('.pl-abertura')
    const quadros = Array.from(section.querySelectorAll<HTMLElement>('.pl-quadro'))
    const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('.pl-nav-btn'))
    if (!track || !textura || !abertura) return

    const paineis = [abertura, ...quadros]
    const paper = section.closest<HTMLElement>('.story-paper')
    const signature = paper?.querySelector<HTMLElement>('.mf-ato-4')
    const header = document.querySelector<HTMLElement>('.nav-pill')
    const corLuz = gsap.utils.interpolate('#fbfbfb', '#222222')
    let arrivalProgress = 0
    const ramp = (p: number, start: number, end: number) => {
      const x = Math.max(0, Math.min(1, (p - start) / (end - start)))
      return x * x * (3 - 2 * x)
    }
    paper?.classList.add('has-paper-transition')
    const updateMenu = () => {
      const alpha = current === 0 ? 1 - ramp(arrivalProgress, 0.12, 0.55) : 1
      header?.style.setProperty('--paper-menu', String(alpha))
      if (header) header.inert = alpha < 0.01
    }

    let current = 0
    let lastT = 0
    let tl: gsap.core.Timeline | null = null
    let tlFrom = 0
    let tlTo = 0
    let idle = 0

    const applyBeat = (k: number) => {
      current = k
      section.dataset.beat = String(k)
      updateMenu()
      paineis.forEach((el, i) => {
        // o cartaz so conta como ligado com a luz ja caida; os quadros
        // ligam quando sao o beat corrente (entrada reexecuta por visita)
        el.classList.toggle('is-on', i === k && (i > 0 || lastT >= TITULO_ON))
        // fora de quadro nada recebe foco nem leitura
        if (i === k) el.removeAttribute('inert')
        else el.setAttribute('inert', '')
      })
      navBtns.forEach((btn, i) => {
        btn.classList.toggle('is-ativo', i + 1 === k)
        if (i + 1 === k) btn.setAttribute('aria-current', 'true')
        else btn.removeAttribute('aria-current')
      })
    }

    const settle = () => {
      if (tl || current === 0 || !st.isActive) return
      const restT = restFor(current, lastT)
      if (Math.abs(lastT - restT) < 0.05) return
      const pos = st.start + (restT / D) * (st.end - st.start)
      getLenis()?.scrollTo(pos, {
        duration: 0.6,
        easing: (x: number) => 1 - Math.pow(1 - x, 3),
      })
    }

    const playSlide = (from: number, to: number) => {
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
        track,
        { xPercent: trackXPercent(from) },
        { xPercent: trackXPercent(to), duration: 0.9, ease: 'power3.inOut' },
      )
      // a troca de estado acontece no meio da travessia, com os dois
      // quadros em cena; o call dispara nos dois sentidos (na volta,
      // restaura a origem)
      tl.call(() => applyBeat(tl && tl.reversed() ? tlFrom : tlTo), [], 0.45)
    }

    // A chegada pertence ao papel compartilhado, antes do pin.
    const luz = (t: number) => {
      section.classList.toggle('is-aceso', t >= TITULO_ON)
      if (current === 0) abertura.classList.add('is-on')
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=440%',
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const t = self.progress * D
        const jumped = Math.abs(t - lastT) > 2.2
        lastT = t
        luz(t)
        window.clearTimeout(idle)
        idle = window.setTimeout(settle, 150)
        const want = desiredBeat(current, t)

        if (tl) {
          // reverteu no meio da travessia: o slide volta, sem nunca parar
          if (want === tlFrom && !tl.reversed()) tl.reversed(true)
          else if (want === tlTo && tl.reversed()) tl.reversed(false)
          return
        }
        if (want === current) return

        // so o salto instantaneo real (ancora, drag da barra) corta seco
        if (jumped) {
          gsap.set(track, { xPercent: trackXPercent(want) })
          applyBeat(want)
          return
        }
        playSlide(current, want)
      },
      onRefresh: (self) => luz(self.progress * D),
    })

    // Restaurar a posicao tambem quando a pagina abre no meio da tira.
    lastT = st.progress * D
    const initialBeat = desiredBeat(0, lastT)
    gsap.set(track, { xPercent: trackXPercent(initialBeat) })
    applyBeat(initialBeat)
    luz(lastT)

    const paintArrival = (p: number) => {
      arrivalProgress = p
      paper?.style.setProperty('--paper-color', corLuz(ramp(p, 0.2, 0.86)))
      paper?.style.setProperty('--paper-texture', String(ramp(p, 0.02, 0.88)))
      paper?.style.setProperty('--paper-lines', String(1 - ramp(p, 0.05, 0.5)))
      section.style.setProperty('--pl-personagem-motion', String(1 - ramp(p, 0.35, 0.98)))
      section.style.setProperty('--pl-title-motion', String(1 - ramp(p, 0.39, 0.84)))
      section.style.setProperty('--pl-title-layer', p < 0.64 ? '0' : '2')
      section.style.setProperty('--pl-green-motion', String(1 - ramp(p, 0.3, 0.87)))
      section.style.setProperty('--pl-arrow-motion', String(1 - ramp(p, 0.4, 0.94)))
      section.style.setProperty('--pl-white-motion', String(1 - ramp(p, 0.49, 1)))
      section.style.setProperty('--pl-paper-reveal', String(ramp(p, 0.4, 1)))
      updateMenu()
    }
    const arrival = signature
      ? ScrollTrigger.create({
          trigger: signature,
          start: 'top top',
          end: () => st.start + window.innerHeight * 0.25,
          onUpdate: (self) => paintArrival(self.progress),
          onRefresh: (self) => paintArrival(self.progress),
        })
      : null
    paintArrival(arrival?.progress ?? 1)

    // navegacao deliberada (nav e teclado): rola ate o descanso do
    // beat alvo; a travessia em si continua sendo o gatilho de limiar
    const goTo = (beat: number) => {
      const alvo = Math.max(0, Math.min(BEATS - 1, beat))
      const pos = st.start + (REST_BY_BEAT[alvo] / D) * (st.end - st.start)
      getLenis()?.scrollTo(pos, {
        duration: 0.9,
        easing: (x: number) => 1 - Math.pow(1 - x, 3),
      })
    }
    const onKey = (ev: KeyboardEvent) => {
      if (!st.isActive) return
      if (ev.key === 'ArrowRight') {
        ev.preventDefault()
        goTo(current + 1)
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault()
        goTo(current - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    const navHandlers = navBtns.map((btn, i) => {
      const handler = () => goTo(i + 1)
      btn.addEventListener('click', handler)
      return handler
    })

    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('keydown', onKey)
      navBtns.forEach((btn, i) => btn.removeEventListener('click', navHandlers[i]))
      tl?.kill()
      st.kill()
      arrival?.kill()
      paper?.classList.remove('has-paper-transition')
      for (const name of ['--paper-color', '--paper-texture', '--paper-lines'])
        paper?.style.removeProperty(name)
      for (const name of [
        '--pl-personagem-motion',
        '--pl-title-motion',
        '--pl-title-layer',
        '--pl-green-motion',
        '--pl-arrow-motion',
        '--pl-white-motion',
        '--pl-paper-reveal',
      ])
        section.style.removeProperty(name)
      header?.style.removeProperty('--paper-menu')
      if (header) header.inert = false
    }
  }, [sectionRef])
}
