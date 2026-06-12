// Cena 1 · Hero · A primeira tomada.
// Estado A: cena em movimento com microinterações.
// Estados B e C: sequência de scroll em useHeroScroll.ts.

import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { onReveal } from '../../lib/reveal'
import { ContourField } from '../../components/ContourField'
import { GlobeHub } from './GlobeHub'
import { HeadlineGhost } from './HeadlineGhost'
import { useHeroScroll } from './useHeroScroll'
import './hero.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const claimRef = useRef<HTMLDivElement>(null)
  const grafismRef = useRef<HTMLImageElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mascoteStaticRef = useRef<HTMLImageElement>(null)

  // O React não aplica o atributo muted no primeiro render (bug conhecido),
  // e sem muted o browser bloqueia o autoplay. Forçamos via DOM. O play
  // só acontece no reveal: decodificar VP8 por software durante a
  // abertura roubava CPU da dança do loader.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true

    const tryPlay = () => {
      video.play().catch(() => {
        // autoplay bloqueado: o poster segura a cena
      })
    }

    const off = onReveal(() => {
      if (video.readyState >= 2) {
        tryPlay()
      } else {
        video.addEventListener('canplay', tryPlay, { once: true })
      }
    })

    return () => {
      off()
      video.removeEventListener('canplay', tryPlay)
    }
  }, [])

  // Brilho suave que segue o cursor sobre o claim (mesma mecânica da
  // headline, com mais inércia e queda mais longa). Só aparece quando
  // o claim está visível, então o handler pode viver sempre ligado.
  useEffect(() => {
    const claim = claimRef.current
    if (!claim) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const moveX = gsap.quickTo(claim, '--cmx', { duration: 0.6, ease: 'power3.out' })
    const moveY = gsap.quickTo(claim, '--cmy', { duration: 0.6, ease: 'power3.out' })
    let inside = false

    const onMove = (event: MouseEvent) => {
      const rect = claim.getBoundingClientRect()
      moveX(event.clientX - rect.left)
      moveY(event.clientY - rect.top)

      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (isInside !== inside) {
        inside = isInside
        gsap.to(claim, {
          '--creveal': isInside ? 1 : 0,
          duration: isInside ? 0.6 : 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('mousemove', onMove)

    // varredura de luz automática sobre o claim, como na abertura
    const sweep = gsap.timeline({ repeat: -1, repeatDelay: 5, delay: 2 })
    sweep.fromTo(
      claim,
      { '--csweep': '-30%' },
      { '--csweep': '130%', duration: 0.7, ease: 'power2.inOut' },
    )

    return () => {
      window.removeEventListener('mousemove', onMove)
      sweep.kill()
    }
  }, [])

  // Entrada da cena, em dois modos (decisão do PO): na primeira carga
  // o hero entra FORMADO dentro da folha do loader (is-instant pula os
  // keyframes; a subida da folha já é a animação). A entrada cinemática
  // fica reservada pro retorno depois de repouso: saiu da aba por mais
  // de 20s e voltou com o hero em quadro, a abertura roda de novo.
  // Tudo CSS puro (ver hero.css), sem estilo inline pro scrub capturar.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const show = (instant: boolean) => {
      section.classList.remove('is-entering', 'is-ready', 'is-instant')
      // reflow descarta o estado anterior e deixa os keyframes reiniciarem
      void section.offsetWidth
      if (instant) section.classList.add('is-instant')
      section.classList.add('is-ready')
    }

    const offReveal = onReveal(() => show(true))

    let hiddenAt = 0
    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt = Date.now()
        return
      }
      const away = hiddenAt ? Date.now() - hiddenAt : 0
      const heroEmQuadro = window.scrollY < window.innerHeight * 0.5
      if (away > 20000 && heroEmQuadro && section.classList.contains('is-ready')) {
        show(false)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      offReveal()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useHeroScroll(sectionRef, frameRef, headlineRef, claimRef, grafismRef, videoRef, mascoteStaticRef)

  return (
    <section
      ref={sectionRef}
      className="hero is-entering"
      aria-label="Leovox Studios. Desenvolva seus sonhos."
    >
      {/* Palco: aparece quando o frame encolhe pro card */}
      <div className="hero-stage" role="presentation">
        <ContourField />
      </div>

      {/* Frame: a cena inteira, que vira card no beat 3 */}
      <div ref={frameRef} className="hero-frame">
        <div className="hero-bg" role="presentation" />
        <HeadlineGhost rootRef={headlineRef} />
        <img
          ref={grafismRef}
          className="hero-grafism"
          src="/branding/typography/leovox-grafism.png"
          alt=""
          draggable={false}
        />
        <div className="hero-paper" role="presentation" />
        <video
          ref={videoRef}
          className="hero-mascote"
          src="/animation/mascote-hero.webm"
          poster="/branding/mascot/mascot-full-body/mascot-hero-fallback.png"
          preload="auto"
          muted
          loop
          playsInline
        />
        <img
          ref={mascoteStaticRef}
          className="hero-mascote hero-mascote-static"
          src="/branding/mascot/mascot-full-body/mascot-hero-fallback.png"
          alt=""
          draggable={false}
        />
        <div ref={claimRef} className="hero-claim" aria-hidden="true">
          <span className="claim-desenvolva">
            <span className="claim-text">DESENVOLVA</span>
            <span className="claim-shine">DESENVOLVA</span>
            <span className="claim-sweep">DESENVOLVA</span>
          </span>
          <span className="claim-sonhos">seus sonhos.</span>
        </div>
        <GlobeHub />
      </div>
    </section>
  )
}
