// Cena 1 · Hero · Estados B e C.
// Um pin de 250vh com timeline única dirigindo os 3 beats aprovados.
//
// O header é exceção deliberada: a coreografia dele (medida da gravação
// do leoleo.studio) roda em TEMPO REAL, não scrubada. O scroll apenas
// dispara o play quando o encolhimento começa, e o reverse na volta.
// Depois do hero, a pill ganha comportamento de direção: some suave no
// scroll pra baixo, reaparece no scroll pra cima. A barra cinza interna
// (.nav-progress) acompanha o progresso total da página com inércia.
//
// Regras duras aprendidas aqui: nunca tweenar opacity inline da camada
// .headline-lit (mata o hover no scroll reverso); nunca dividir o canal
// --sweep com o efeito ocioso do HeadlineGhost (o scroll usa --sweep2);
// e alvos fora da seção do hero entram como referência de elemento,
// nunca como string (o contexto é escopado na seção).

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

const HEADER_TRIGGER = 0.66 // progresso do pin em que o encolhimento começa

export function useHeroScroll(
  sectionRef: RefObject<HTMLElement | null>,
  frameRef: RefObject<HTMLDivElement | null>,
  headlineRef: RefObject<HTMLDivElement | null>,
  claimRef: RefObject<HTMLDivElement | null>,
  grafismRef: RefObject<HTMLImageElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  mascoteStaticRef: RefObject<HTMLImageElement | null>,
): void {
  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const headline = headlineRef.current
    const claim = claimRef.current
    const grafism = grafismRef.current
    const video = videoRef.current
    const mascoteStatic = mascoteStaticRef.current
    if (!section || !frame || !headline || !claim || !grafism || !video || !mascoteStatic) {
      return
    }

    const navPill = document.querySelector<HTMLElement>('.nav-pill')
    const navCta = navPill?.querySelector<HTMLElement>('.nav-cta') ?? null
    const navProgress = navPill?.querySelector<HTMLElement>('.nav-progress') ?? null

    // Reduced-motion: direto no estado final, sem pin nem timelines.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      headline.classList.add('is-scrolling')
      gsap.set(headline, { autoAlpha: 0 })
      gsap.set(claim, { autoAlpha: 1 })
      gsap.set(frame, { scale: 0.88, borderRadius: 28 })
      gsap.set(video, { autoAlpha: 0 })
      gsap.set(mascoteStatic, { autoAlpha: 1 })
      if (navPill) {
        gsap.set(navPill, { autoAlpha: 1, maxWidth: 760, borderRadius: 16 })
        navPill.classList.add('is-open')
      }
      if (navCta) gsap.set(navCta, { autoAlpha: 1, scale: 1 })
      video.pause()

      // progresso da página sem inércia
      if (navProgress) {
        const st = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => gsap.set(navProgress, { scaleX: self.progress }),
        })
        return () => st.kill()
      }
      return
    }

    const ctx = gsap.context(() => {
      // ---------- Header em tempo real (coreografia do leoleo) ----------
      const headerTl = gsap.timeline({ paused: true })
      if (navPill) {
        // Um gesto só: a expansão nasce dentro do pouso da bola
        // (overlap em 0.38s), sem pausa entre os movimentos.
        headerTl.fromTo(
          navPill,
          { autoAlpha: 0, y: -44, scale: 0.6 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
          0,
        )
        // O circulo e so da bola: na largada da expansao o raio fecha
        // rapido pra 16px e a barra ja se forma retangular.
        headerTl.to(navPill, { borderRadius: 16, duration: 0.25, ease: 'power2.out' }, 0.45)
        headerTl.to(navPill, { maxWidth: 760, duration: 0.9, ease: 'power2.inOut' }, 0.45)
        headerTl.call(() => navPill.classList.add('is-open'), undefined, 0.7)
      }
      if (navCta) {
        headerTl.fromTo(
          navCta,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
          1.05,
        )
      }

      // ---------- Pill inteligente: some descendo, volta subindo ----------
      // Ativa só depois do hero. Histerese por distância: só reage a
      // 90px contínuos na mesma direção, imune aos micro vaivéns do
      // lerp do Lenis e do snap dos pins (que invertem a direção por
      // um tick e faziam a pill mergulhar e corrigir).
      let pastHero = false
      let pillHidden = false
      let pillAcc = 0
      let pillLastY = 0

      const hidePill = () => {
        if (!navPill || pillHidden) return
        pillHidden = true
        gsap.to(navPill, { y: -110, duration: 0.6, ease: 'power2.inOut', overwrite: 'auto' })
      }
      const showPill = () => {
        if (!navPill || !pillHidden) return
        pillHidden = false
        gsap.to(navPill, { y: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      }

      // ---------- Progresso da página na barra cinza ----------
      const progressTo = navProgress
        ? gsap.quickTo(navProgress, 'scaleX', { duration: 0.35, ease: 'power2.out' })
        : null

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          progressTo?.(self.progress)
          const y = self.scroll()
          const delta = y - pillLastY
          pillLastY = y
          if (!pastHero || delta === 0) return
          if (delta > 0 !== pillAcc > 0) pillAcc = 0
          pillAcc += delta
          if (pillAcc > 90) hidePill()
          else if (pillAcc < -90) showPill()
        },
      })

      // ---------- Timeline scrubada da cena ----------
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=250%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          onLeave: () => {
            pastHero = true
          },
          onEnterBack: () => {
            pastHero = false
            showPill()
          },
          onUpdate: (self) => {
            // O vídeo congela assim que a câmera começa a andar
            // e volta a rodar se o usuário retornar ao topo.
            if (self.progress > 0.01) {
              headline.classList.add('is-scrolling')
              headline.style.setProperty('--reveal', '0')
            } else {
              headline.classList.remove('is-scrolling')
            }

            // Opacidades como função PURA do progresso: tween de
            // autoAlpha em timeline scrubada não restaura confiável no
            // reverse (provado em reprodução com browser), então o
            // crossfade vídeo/png e o fade da headline são calculados
            // a cada tick. Determinístico em qualquer direção e ritmo.
            const p10 = self.progress * 10
            const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
            const fade = (el: HTMLElement, alpha: number) => {
              el.style.opacity = String(alpha)
              el.style.visibility = alpha <= 0.001 ? 'hidden' : 'visible'
            }
            fade(headline, 1 - clamp01((p10 - 2.4) / 0.4))
            fade(video, 1 - clamp01((p10 - 7.65) / 0.4))
            fade(mascoteStatic, clamp01((p10 - 7.6) / 0.4))

            // O vídeo roda a cena inteira e só congela quando o card
            // começa a encolher e o palco branco aparece.
            if (self.progress >= HEADER_TRIGGER) {
              if (!video.paused) video.pause()
            } else if (video.paused) {
              void video.play().catch(() => {})
            }

            // O header dispara em tempo próprio quando o encolhimento
            // começa, e desfaz na volta. O scroll é só o gatilho.
            if (self.progress >= HEADER_TRIGGER) {
              headerTl.play()
            } else {
              headerTl.reverse()
            }
          },
        },
      })

      // ---------- Beat 1 (0 a 2.6) ----------
      tl.fromTo('.headline-ghost', { opacity: 0.16 }, { opacity: 0.55, duration: 0.8 }, 0)
      tl.fromTo(headline, { '--sweep2': '-30%' }, { '--sweep2': '130%', duration: 1.1 }, 0.2)
      tl.fromTo(headline, { '--sweep2': '-30%' }, { '--sweep2': '130%', duration: 1.0 }, 1.5)
      tl.fromTo(
        headline,
        { y: 0, scale: 1 },
        { y: '52vh', scale: 0.72, duration: 2.4, ease: 'power1.in', immediateRender: false },
        0.3,
      )

      // ---------- Beat 2 (2.6 a 5.5) ----------
      tl.fromTo(
        claim,
        { autoAlpha: 0, y: 110, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.6, ease: 'expo.out' },
        2.6,
      )
      tl.fromTo(
        '.claim-sonhos',
        { autoAlpha: 0, y: -70, rotation: -11, scale: 1.18 },
        { autoAlpha: 1, y: 0, rotation: -4, scale: 1, duration: 1.5, ease: 'expo.out' },
        3.6,
      )
      tl.fromTo(
        grafism,
        { y: 0, scale: 1, rotation: 0 },
        {
          y: '-12vh',
          scale: 1.06,
          rotation: -1.5,
          duration: 5,
          ease: 'circ.inOut',
          immediateRender: false,
        },
        0.3,
      )
      tl.fromTo(
        '.hero-bg',
        { y: 0, scale: 1 },
        { y: '-5vh', scale: 1.08, duration: 5, ease: 'circ.inOut', immediateRender: false },
        0.3,
      )

      // ---------- Beat 3 (6.6 a 10): só o que é movimento de câmera ----------
      tl.fromTo(
        frame,
        { scale: 1, borderRadius: 0 },
        {
          scale: 0.88,
          borderRadius: 28,
          duration: 3.4,
          ease: 'power2.inOut',
          immediateRender: false,
        },
        6.6,
      )
    }, section)

    return () => ctx.revert()
  }, [sectionRef, frameRef, headlineRef, claimRef, grafismRef, videoRef, mascoteStaticRef])
}
