// A coreografia da abertura, em quatro tempos:
// 1. a cortina enviesada desliza em duas passadas e revela o LVX, que
//    assenta com elastico (so transform: nada repinta por frame);
// 2. o LVX arma pra direita comprimindo, chicoteia pra esquerda com
//    skew de velocidade e ESTOURA no logotipo LEOVOX, que abre com
//    elastico, assenta com peso e sacode o palco no impacto;
// 3. o progresso real e acompanhado por dentro, com suavizacao
//    independente de framerate (sem HUD: decisao do PO);
// 4. no 100% a tela oficial sobe como folha de cantos arredondados ja
//    com o hero se formando dentro dela, assenta, zera os cantos e
//    libera o scroll. A folha so vira camada composta na subida,
//    recortada na altura da janela (ver global.css).
// Tudo em tempo real: nada aqui e scrubado por scroll.

import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { startLenis } from '../../lib/lenis'
import { dispatchReveal } from '../../lib/reveal'

const DANCE_CAP = 0.93 // a saida espera a coreografia terminar

interface Refs {
  rootRef: RefObject<HTMLDivElement | null>
  lvxRef: RefObject<HTMLDivElement | null>
  coverRef: RefObject<HTMLSpanElement | null>
  leoRef: RefObject<HTMLDivElement | null>
  siteRef: RefObject<HTMLDivElement | null>
  progressRef: RefObject<number>
  onDone: () => void
}

export function useLoaderChoreography({
  rootRef,
  lvxRef,
  coverRef,
  leoRef,
  siteRef,
  progressRef,
  onDone,
}: Refs): void {
  useEffect(() => {
    const root = rootRef.current
    const lvx = lvxRef.current
    const cover = coverRef.current
    const leo = leoRef.current
    const site = siteRef.current
    const stage = root?.querySelector<HTMLElement>('.ld-stage') ?? null
    if (!root || !lvx || !cover || !leo || !site || !stage) return

    const finish = () => {
      site.classList.remove('is-riding')
      document.documentElement.classList.remove('is-loading')
      ScrollTrigger.refresh()
      startLenis()
      onDone()
    }

    // reduced-motion: logotipo estatico, revelacao direta
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      site.classList.add('site-waiting')
      const id = window.setInterval(() => {
        if ((progressRef.current ?? 0) >= 1) {
          window.clearInterval(id)
          site.classList.remove('site-waiting')
          dispatchReveal()
          finish()
        }
      }, 120)
      return () => window.clearInterval(id)
    }

    // a folha espera invisivel e sem custo; so vira camada na subida
    site.classList.add('site-waiting')

    let danceDone = false
    let exiting = false
    let displayed = 0

    // tempo 1 e 2: cortina em duas passadas, assentamento, pendulo e expansao
    const dance = gsap.timeline({
      onComplete: () => {
        danceDone = true
      },
    })
    dance
      .to(cover, { xPercent: 62, duration: 0.34, ease: 'power3.in' }, 0.15)
      .to(cover, { xPercent: 145, duration: 0.4, ease: 'power3.out' }, '+=0.08')
      .fromTo(
        lvx,
        { scale: 1.06, rotation: -2 },
        { scale: 1, rotation: 0, duration: 0.55, ease: 'elastic.out(1, 0.6)' },
        '-=0.22',
      )
      // arma: inclina e comprime, juntando energia
      .to(
        lvx,
        { rotation: 6.5, x: 22, scale: 0.96, duration: 0.38, ease: 'power2.inOut' },
        '+=0.25',
      )
      // chicote: dispara pra esquerda com skew de velocidade e some
      .to(lvx, {
        rotation: -14,
        x: -70,
        skewX: 12,
        scaleX: 1.45,
        autoAlpha: 0,
        duration: 0.26,
        ease: 'power4.in',
        transformOrigin: '50% 75%',
      })
      // estouro: o LEOVOX abre de dentro do chicote com elastico
      .fromTo(
        leo,
        { autoAlpha: 0, scaleX: 0.55, scaleY: 0.9, rotation: -8, skewX: -10 },
        {
          autoAlpha: 1,
          scaleX: 1,
          scaleY: 1,
          rotation: 0,
          skewX: 0,
          duration: 1.05,
          ease: 'elastic.out(1.05, 0.42)',
          transformOrigin: '50% 72%',
        },
        '-=0.13',
      )
      // peso: o logotipo cai os ultimos pixels e quica seco
      .fromTo(leo, { y: -14 }, { y: 0, duration: 0.65, ease: 'bounce.out' }, '<0.06')
      // impacto: o palco inteiro sacode com o estouro
      .fromTo(stage, { x: -11 }, { x: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' }, '<')

    // tempo 4: o loader vira a lamina verde e a folha sobe por cima ja
    // com o hero se formando dentro dela: o reveal dispara no comeco da
    // subida (a entrada do hero e CSS puro, nao depende de medidas), e
    // quando a folha assenta o hero ja esta inteiro. O refresh dos pins
    // so acontece depois do clearProps, com o layout em repouso.
    const exit = () => {
      exiting = true
      site.classList.remove('site-waiting')
      site.classList.add('is-riding')
      gsap.set(site, { y: '100vh', borderTopLeftRadius: 26, borderTopRightRadius: 26 })
      const tl = gsap.timeline()
      tl.to(leo, { autoAlpha: 0, scale: 1.05, duration: 0.4, ease: 'power2.in' }, 0)
      tl.to(site, { y: 0, duration: 1.15, ease: 'power4.inOut' }, 0.18)
      tl.call(dispatchReveal, [], 0.06)
      tl.to(
        site,
        { borderTopLeftRadius: 0, borderTopRightRadius: 0, duration: 0.25, ease: 'power2.out' },
        '-=0.15',
      )
      tl.call(() => {
        gsap.set(site, { clearProps: 'transform,borderTopLeftRadius,borderTopRightRadius' })
        finish()
      })
    }

    // tempo 3: arco com suavizacao por tempo real (independe do framerate)
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (exiting) return
      const dt = Math.min((now - last) / 1000, 0.12)
      last = now
      const target = Math.min(progressRef.current ?? 0, danceDone ? 1 : DANCE_CAP)
      displayed += (target - displayed) * (1 - Math.exp(-4.2 * dt))
      if (displayed > 0.995) exit()
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      dance.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
