// Cena 1 · Hero · A primeira tomada.
// Estado A: cena estática com microinterações locais.
// Estados B e C (scroll e encolhimento) entram no próximo entregável.

import { useEffect, useRef } from 'react'
import { GlobeHub } from './GlobeHub'
import { HeadlineGhost } from './HeadlineGhost'
import './hero.css'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // O React não aplica o atributo muted no primeiro render (bug conhecido),
  // e sem muted o browser bloqueia o autoplay. Forçamos via DOM e damos o play.
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

    if (video.readyState >= 2) {
      tryPlay()
    } else {
      video.addEventListener('canplay', tryPlay, { once: true })
    }

    return () => video.removeEventListener('canplay', tryPlay)
  }, [])

  return (
    <section className="hero" aria-label="Leovox Studios. Desenvolva seus sonhos.">
      <div className="hero-bg" role="presentation" />
      <HeadlineGhost />
      <img
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
        autoPlay
        muted
        loop
        playsInline
      />
      <GlobeHub />
    </section>
  )
}
