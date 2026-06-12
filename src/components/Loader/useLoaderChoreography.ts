// A coreografia da abertura, em quatro tempos:
// 1. o LVX e revelado por duas passadas de mascara diagonal e assenta;
// 2. pendula pra direita, puxa pra esquerda e no puxao se expande no
//    logotipo LEOVOX (elastic, residuo de pendulo);
// 3. HUD de porcentagem e anel no cursor seguem o progresso real com
//    lerp (o numero nunca salta; o anel trava em 93% ate a danca acabar);
// 4. no 100% a tela oficial sobe como folha de cantos arredondados,
//    assenta, zera os cantos e dispara o reveal (hero entra, Lenis abre).
// Tudo em tempo real: nada aqui e scrubado por scroll.

import { useEffect, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { startLenis } from '../../lib/lenis'
import { dispatchReveal } from '../../lib/reveal'

const RING_CIRC = 150.8 // 2 * PI * 24
const DANCE_CAP = 0.93 // o numero espera a coreografia terminar

interface Refs {
  rootRef: RefObject<HTMLDivElement | null>
  lvxRef: RefObject<HTMLDivElement | null>
  leoRef: RefObject<HTMLDivElement | null>
  hudRef: RefObject<HTMLParagraphElement | null>
  ringRef: RefObject<HTMLDivElement | null>
  arcRef: RefObject<SVGCircleElement | null>
  siteRef: RefObject<HTMLDivElement | null>
  progressRef: RefObject<number>
  onDone: () => void
}

export function useLoaderChoreography({
  rootRef,
  lvxRef,
  leoRef,
  hudRef,
  ringRef,
  arcRef,
  siteRef,
  progressRef,
  onDone,
}: Refs): void {
  useEffect(() => {
    const root = rootRef.current
    const lvx = lvxRef.current
    const leo = leoRef.current
    const hud = hudRef.current
    const ring = ringRef.current
    const arc = arcRef.current
    const site = siteRef.current
    if (!root || !lvx || !leo || !hud || !ring || !arc || !site) return

    const finish = () => {
      site.classList.remove('is-riding')
      document.documentElement.classList.remove('is-loading')
      ScrollTrigger.refresh()
      dispatchReveal()
      startLenis()
      onDone()
    }

    // reduced-motion: logotipo estatico, numero real, revelacao direta
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = window.setInterval(() => {
        const p = progressRef.current ?? 0
        hud.textContent = `${Math.round(p * 100)}%`
        if (p >= 1) {
          window.clearInterval(id)
          finish()
        }
      }, 120)
      return () => window.clearInterval(id)
    }

    // a tela oficial espera fora de quadro, com os cantos ja redondos
    site.classList.add('is-riding')
    gsap.set(site, { y: '100vh', borderTopLeftRadius: 26, borderTopRightRadius: 26 })

    let danceDone = false
    let exiting = false
    let displayed = 0

    // tempo 1 e 2: revelacao em duas passadas, assentamento, pendulo e expansao
    const dance = gsap.timeline({
      onComplete: () => {
        danceDone = true
      },
    })
    dance
      .to(lvx, { '--mw': '58%', duration: 0.34, ease: 'power3.in' }, 0.15)
      .to(lvx, { '--mw': '135%', duration: 0.4, ease: 'power3.out' }, '+=0.08')
      .fromTo(
        lvx,
        { scale: 1.06, rotation: -2 },
        { scale: 1, rotation: 0, duration: 0.55, ease: 'elastic.out(1, 0.6)' },
        '-=0.22',
      )
      .to(lvx, { rotation: 7, x: 18, duration: 0.32, ease: 'power2.in' }, '+=0.3')
      .to(lvx, {
        rotation: -9,
        x: -30,
        scaleX: 1.3,
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power3.in',
        transformOrigin: '50% 78%',
      })
      .fromTo(
        leo,
        { autoAlpha: 0, scaleX: 0.72, rotation: -7, transformOrigin: '50% 70%' },
        { autoAlpha: 1, scaleX: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.45)' },
        '-=0.16',
      )

    // tempo 4: a folha sobe, assenta e o site assume
    const exit = () => {
      exiting = true
      const tl = gsap.timeline()
      tl.to(ring, { scale: 1.6, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0)
      tl.to(hud, { autoAlpha: 0, duration: 0.3 }, 0)
      tl.to(leo, { scale: 0.95, autoAlpha: 0.55, duration: 0.9, ease: 'power2.inOut' }, 0.05)
      tl.to(site, { y: 0, duration: 1.15, ease: 'power4.inOut' }, 0.1)
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

    // tempo 3: numero e anel com suavizacao por tempo real (independe
    // do framerate: maquina fraca nao pode atrasar a abertura)
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (exiting) return
      const dt = Math.min((now - last) / 1000, 0.12)
      last = now
      const target = Math.min(progressRef.current ?? 0, danceDone ? 1 : DANCE_CAP)
      displayed += (target - displayed) * (1 - Math.exp(-4.2 * dt))
      hud.textContent = `${Math.round(displayed * 100)}%`
      arc.style.strokeDashoffset = String(RING_CIRC * (1 - displayed))
      if (displayed > 0.995) exit()
    }
    raf = requestAnimationFrame(tick)

    // o anel acompanha o cursor com inercia
    gsap.set(ring, { x: window.innerWidth * 0.62, y: window.innerHeight * 0.56 })
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const onMove = (event: MouseEvent) => {
      xTo(event.clientX)
      yTo(event.clientY)
    }
    window.addEventListener('mousemove', onMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      dance.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
