// Cena 1 · Hero · A primeira tomada.
// Estado A: cena em movimento com microinterações.
// Estados B e C: sequência de scroll em useHeroScroll.ts. No disparo, a
// frase cai e a assinatura (o pixo verde) se desfaz no mesmo ritmo; quando
// a frase assenta, a mão reescreve a assinatura por cima de DESENVOLVA e a
// última palavra passa a trocar no lugar (decisão 77).

import { useEffect, useRef } from 'react'
import { onReveal } from '../../lib/reveal'
import { ContourField } from '../../components/ContourField'
import { GlobeHub } from './GlobeHub'
import { HeadlineGhost } from './HeadlineGhost'
import { PIXO_ALTURA, PIXO_CAMINHOS, PIXO_LARGURA, PIXO_TRACO } from './pixo'
import { useHeroScroll } from './useHeroScroll'
import './hero.css'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const grafismRef = useRef<SVGSVGElement>(null)
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

  useHeroScroll(sectionRef, frameRef, headlineRef, grafismRef, videoRef, mascoteStaticRef)

  return (
    <section
      ref={sectionRef}
      className="hero is-entering"
      data-harness-scene="hero"
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
        {/* a assinatura: a arte é revelada por uma máscara de traços que a
            mão percorre (pixo.ts); a imagem cheia fecha os últimos pontos */}
        <svg
          ref={grafismRef}
          className="hero-grafism"
          viewBox={`0 0 ${PIXO_LARGURA} ${PIXO_ALTURA}`}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <mask
              id="hero-pixo-mao"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={PIXO_LARGURA}
              height={PIXO_ALTURA}
            >
              <g
                fill="none"
                stroke="#fff"
                strokeWidth={PIXO_TRACO}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {PIXO_CAMINHOS.map((d) => (
                  <path key={d} className="pixo-traco" d={d} pathLength={1} />
                ))}
              </g>
            </mask>
          </defs>
          <image
            href="/branding/typography/leovox-grafism.png"
            width={PIXO_LARGURA}
            height={PIXO_ALTURA}
            mask="url(#hero-pixo-mao)"
          />
          <image
            className="pixo-cheio"
            href="/branding/typography/leovox-grafism.png"
            width={PIXO_LARGURA}
            height={PIXO_ALTURA}
          />
        </svg>
        <div className="hero-paper" role="presentation" />
        {/* os prédios da frente: tudo que está pintado no muro fica atrás deles */}
        <div className="hero-predios" role="presentation" />
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
        <GlobeHub />
      </div>
    </section>
  )
}
