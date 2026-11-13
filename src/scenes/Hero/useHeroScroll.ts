// Cena 1 · Hero · Estados B e C.
// Um pin de 250vh com timeline única dirigindo os 3 beats aprovados.
//
// O header é exceção deliberada: a coreografia dele (medida da gravação
// do leoleo.studio) roda em TEMPO REAL, não scrubada. O scroll apenas
// dispara o play quando o encolhimento começa, e o reverse na volta.
// Depois do hero, a pill ganha comportamento de direção: some suave no
// scroll pra baixo, reaparece no scroll pra cima, com o cursor no topo,
// com o foco do teclado e depois de um salto pelo menu. O fio na base
// (.nav-progress) acompanha o progresso total da página com inércia.
//
// Regras duras aprendidas aqui: nunca tweenar opacity inline da camada
// .headline-lit (mata o hover no scroll reverso); nunca dividir o canal
// --sweep com o efeito ocioso do HeadlineGhost (o scroll usa --sweep2);
// e alvos fora da seção do hero entram como referência de elemento,
// nunca como string (o contexto é escopado na seção).

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { NAVEGOU_EVENT } from '../../lib/navegar'
import { pixoEscrito } from './pixo'

const HEADER_TRIGGER = 0.66 // progresso do pin em que o encolhimento começa
const MANIFESTO_NAV_TRIGGER = 0.92 // card quase no enquadramento final da referência
const MANIFESTO_PREVIEW_EVENT = 'leovox:manifesto-preview'

// A última palavra da frase troca no lugar depois que ela assenta, com a
// varredura de glifos do hero do Eduardo: cada letra vira um glifo
// sorteado e assenta na palavra nova, da esquerda pra direita. Só a
// palavra muda; fonte e cor ficam (decisão 77). Todas concordam com "SEUS".
const PALAVRAS = ['SONHOS.', 'PROJETOS.', 'PLANOS.', 'NEGÓCIOS.', 'PRODUTOS.']
const GLIFOS = '!<>-_/[]{}=+*^?#01'
const TROCA_MS = 720
const TROCA_INTERVALO_MS = 2600

export function useHeroScroll(
  sectionRef: RefObject<HTMLElement | null>,
  frameRef: RefObject<HTMLDivElement | null>,
  headlineRef: RefObject<HTMLDivElement | null>,
  grafismRef: RefObject<SVGSVGElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  mascoteStaticRef: RefObject<HTMLImageElement | null>,
): void {
  useEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const headline = headlineRef.current
    const grafism = grafismRef.current
    const video = videoRef.current
    const mascoteStatic = mascoteStaticRef.current
    if (!section || !frame || !headline || !grafism || !video || !mascoteStatic) {
      return
    }

    const navPill = document.querySelector<HTMLElement>('.nav-pill')
    const navCta = navPill?.querySelector<HTMLElement>('.nav-cta') ?? null
    const navProgress = navPill?.querySelector<HTMLElement>('.nav-progress') ?? null
    const navLogo = navPill?.querySelector<HTMLElement>('.nav-logo') ?? null
    const navLetras = navPill ? Array.from(navPill.querySelectorAll<HTMLElement>('.nav-ch')) : []
    // ---------- A assinatura: escrita e desfeita pela mão ----------
    const tracos = Array.from(grafism.querySelectorAll<SVGPathElement>('.pixo-traco'))
    const pixoCheio = grafism.querySelector<SVGImageElement>('.pixo-cheio')
    const desenharPixo = (d: number) => {
      pixoEscrito(d).forEach((v, i) => {
        const traco = tracos[i]
        if (!traco) return
        traco.style.strokeDashoffset = String(1 - v)
        // sem tinta, o traço some: a ponta redonda deixaria um pingo
        traco.style.visibility = v > 0 ? 'visible' : 'hidden'
      })
      pixoCheio?.style.setProperty('opacity', String(Math.min(1, Math.max(0, (d - 0.96) / 0.04))))
    }
    desenharPixo(1)

    // ---------- A frase em duas partes ----------
    // DESENVOLVA cresce até 82% da largura, na altura do rosto; SEUS
    // SONHOS. assenta numa linha só, colada embaixo, à direita do ombro.
    // Medidas de layout (offset), que transform nenhum altera, no espaço
    // do frame. Recalculadas a cada refresh do ScrollTrigger.
    const stack = headline.querySelector<HTMLElement>('.headline-stack')
    const parteA = headline.querySelector<HTMLElement>('.headline-ghost .hl-a')
    const parteB = headline.querySelector<HTMLElement>('.headline-ghost .hl-b')
    const trocas = Array.from(headline.querySelectorAll<HTMLElement>('.hl-troca'))
    const predios = frame.querySelector<HTMLElement>('.hero-predios')
    const regua = document.createElement('canvas').getContext('2d')
    const alvos = () => {
      if (!stack || !parteA || !parteB) {
        return { a: { x: 0, y: 0, s: 1 }, b: { x: 0, y: 0, s: 1 } }
      }
      const W = frame.offsetWidth
      const H = frame.offsetHeight
      const css = getComputedStyle(stack)
      const fs = parseFloat(css.fontSize)
      const baseX = headline.offsetLeft + stack.offsetLeft
      const baseY = headline.offsetTop + stack.offsetTop
      const k1 = (W * 0.82) / parteA.offsetWidth
      const topoA = H * 0.15
      // a linha de baixo cabe com a palavra mais longa da troca
      let maior = parteB.offsetWidth
      if (regua) {
        regua.font = css.font
        const espaco = parseFloat(css.letterSpacing) || 0
        maior = Math.max(
          ...PALAVRAS.map((w) => regua.measureText(`SEUS ${w}`).width + espaco * (w.length + 5)),
        )
      }
      const kb = (H * 0.12) / fs
      return {
        a: {
          x: (W - parteA.offsetWidth * k1) / 2 - (baseX + parteA.offsetLeft),
          y: topoA - (baseY + parteA.offsetTop),
          s: k1,
        },
        b: {
          x: Math.min(W * 0.675, W * 0.96 - maior * kb) - (baseX + parteB.offsetLeft),
          y: topoA + fs * k1 * 0.84 - (baseY + parteB.offsetTop),
          s: kb,
        },
      }
    }

    // ---------- A palavra que troca ----------
    let trocaId = 0
    let indicePalavra = 0
    let cicloTroca = 0
    let heroForaDeQuadro = false
    const escrever = (texto: string) => trocas.forEach((el) => (el.textContent = texto))
    const embaralhar = (para: string) => {
      const id = ++trocaId
      const de = trocas[0]?.textContent ?? ''
      const n = Math.max(de.length, para.length)
      const t0 = performance.now()
      const passo = (agora: number) => {
        if (id !== trocaId) return
        const p = Math.min(1, (agora - t0) / TROCA_MS)
        let saida = ''
        for (let i = 0; i < n; i += 1) {
          const assenta = 0.3 + ((i + 1) / n) * 0.7
          if (p >= assenta) saida += para[i] ?? ''
          else if (p >= assenta - 0.3) saida += GLIFOS[Math.floor(Math.random() * GLIFOS.length)]
          else saida += de[i] ?? ''
        }
        escrever(saida)
        if (p < 1) requestAnimationFrame(passo)
      }
      requestAnimationFrame(passo)
    }
    const iniciarTroca = () => {
      window.clearInterval(cicloTroca)
      cicloTroca = window.setInterval(() => {
        if (document.hidden || heroForaDeQuadro) return
        indicePalavra = (indicePalavra + 1) % PALAVRAS.length
        embaralhar(PALAVRAS[indicePalavra])
      }, TROCA_INTERVALO_MS)
    }
    const pararTroca = () => {
      window.clearInterval(cicloTroca)
      trocaId += 1
      indicePalavra = 0
      escrever(PALAVRAS[0])
    }

    let manifestoPreviewVisible = false
    const setManifestoPreview = (visible: boolean) => {
      if (manifestoPreviewVisible === visible) return
      manifestoPreviewVisible = visible
      document.documentElement.dataset.manifestoNavReady = String(visible)
      window.dispatchEvent(new CustomEvent(MANIFESTO_PREVIEW_EVENT, { detail: { visible } }))
    }

    // Reduced-motion: direto no estado final, sem pin nem timelines.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      headline.classList.add('is-scrolling')
      // a frase assentada e assinada, sem troca de palavra
      const assentar = () => {
        const fim = alvos()
        gsap.set(headline.querySelectorAll('.hl-a'), { x: fim.a.x, y: fim.a.y, scale: fim.a.s })
        gsap.set(headline.querySelectorAll('.hl-b'), { x: fim.b.x, y: fim.b.y, scale: fim.b.s })
      }
      assentar()
      // a medida depende da Extenda carregada
      void document.fonts?.ready.then(assentar)
      gsap.set(headline.querySelectorAll('.headline-ghost'), { opacity: 1 })
      if (predios) predios.style.opacity = '0.22'
      section.classList.add('is-assentado')
      gsap.set(frame, { scale: 0.88, borderRadius: 28 })
      gsap.set(video, { autoAlpha: 0 })
      gsap.set(mascoteStatic, { autoAlpha: 1 })
      if (navPill) {
        gsap.set(navPill, { autoAlpha: 1, clipPath: 'none' })
        navPill.classList.add('is-open')
      }
      if (navCta) gsap.set(navCta, { autoAlpha: 1, scale: 1 })
      video.pause()

      // progresso da página sem inércia
      if (navProgress) {
        const st = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => gsap.set(navProgress, { '--p': self.progress }),
        })
        return () => st.kill()
      }
      return
    }

    let soltarPill = () => {}

    const ctx = gsap.context(() => {
      // ---------- Header em tempo real (coreografia do leoleo) ----------
      // A pill já existe na largura final. A bola é uma máscara redonda
      // no centro dela; a forma abre até a barra inteira enquanto a logo
      // desliza do centro pro canto, e só depois as letras dos links
      // sobem uma a uma. Só máscara e transform: nada de max-width nem
      // border-radius animados, que recalculavam o layout a cada quadro.
      const headerTl = gsap.timeline({ paused: true })
      const forma = () => {
        const w = navPill?.offsetWidth ?? 0
        const h = navPill?.offsetHeight ?? 0
        const lado = Math.max(0, (w - h) / 2)
        const logoCentro = navLogo ? navLogo.offsetLeft + navLogo.offsetWidth / 2 : w / 2
        return {
          bola: `inset(0px ${lado}px 0px ${lado}px round ${h / 2}px)`,
          logoNoCentro: w / 2 - logoCentro,
        }
      }
      if (navPill) {
        // a bola cai do topo
        headerTl.fromTo(
          navPill,
          { autoAlpha: 0, y: -56 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0,
        )
        // ainda no pouso, a forma abre (um gesto só, sem pausa)
        headerTl.fromTo(
          navPill,
          { clipPath: () => forma().bola },
          {
            clipPath: 'inset(0px 0px 0px 0px round 16px)',
            duration: 0.95,
            ease: 'power3.inOut',
          },
          0.4,
        )
        if (navLogo) {
          headerTl.fromTo(
            navLogo,
            { x: () => forma().logoNoCentro },
            { x: 0, duration: 0.95, ease: 'power3.inOut' },
            0.4,
          )
        }
        if (navLetras.length) {
          headerTl.fromTo(
            navLetras,
            { yPercent: 115 },
            { yPercent: 0, duration: 0.6, ease: 'power3.out', stagger: 0.016 },
            0.8,
          )
        }
        headerTl.call(() => navPill.classList.add('is-open'), undefined, 0.9)
      }
      if (navCta) {
        headerTl.fromTo(
          navCta,
          { autoAlpha: 0, scale: 0.7 },
          { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
          1.0,
        )
      }

      // as medidas da forma dependem da largura da pill: refaz no resize
      // sem perder o ponto da timeline
      let resizeCall: gsap.core.Tween | null = null
      const onResize = () => {
        resizeCall?.kill()
        resizeCall = gsap.delayedCall(0.15, () => {
          const p = headerTl.progress()
          headerTl.invalidate()
          headerTl.progress(p)
        })
      }
      window.addEventListener('resize', onResize)

      // Antes da primeira interação (roda, toque, tecla, clique), toda
      // mudança de scroll é da página: restauração no refresh, refresh dos
      // pins, salto do harness. Nesses casos a pill vai direto pro estado
      // certo, sem coreografia: ela só nasce quando quem rola é a pessoa.
      let pessoaRolou = false
      const marcarPessoa = () => {
        pessoaRolou = true
      }
      const gestos = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      gestos.forEach((g) => window.addEventListener(g, marcarPessoa, { passive: true }))

      // põe a bola e a logo na medida atual da pill antes de nascer
      const prepararForma = () => {
        headerTl.invalidate()
        const f = forma()
        if (navPill) gsap.set(navPill, { clipPath: f.bola })
        if (navLogo) gsap.set(navLogo, { x: f.logoNoCentro })
      }

      const sincronizarHeader = (progress: number) => {
        const nascer = progress >= HEADER_TRIGGER
        if (!pessoaRolou && !headerTl.isActive()) {
          headerTl.pause().progress(nascer ? 1 : 0)
          return
        }
        if (nascer) {
          // mede a pill de novo antes de nascer: a largura muda quando as
          // fontes chegam, e a bola medida na criação saltava 23px no meio
          if (headerTl.progress() === 0) prepararForma()
          headerTl.play()
        } else headerTl.reverse()
      }
      void document.fonts?.ready.then(() => {
        if (headerTl.progress() === 0) prepararForma()
      })

      // ---------- Pill inteligente: some descendo, volta subindo ----------
      // Ativa só depois do hero. Histerese por distância: só reage a
      // 90px contínuos na mesma direção, imune aos micro vaivéns do
      // lerp do Lenis e do snap dos pins (que invertem a direção por
      // um tick e faziam a pill mergulhar e corrigir).
      let pastHero = false
      let pillHidden = false
      let pillAcc = 0
      let pillLastY = 0

      // o cursor no topo da tela ou o foco dentro da pill seguram ela:
      // a inércia do scroll não esconde o menu que está sendo usado
      let cursorNoTopo = false
      const segurando = () => cursorNoTopo || (navPill?.contains(document.activeElement) ?? false)

      // O some-e-volta usa yPercent, propriedade só dele: o nascimento
      // usa y, e os dois nunca brigam pelo mesmo canal.
      const hidePill = () => {
        if (!navPill || pillHidden || segurando()) return
        pillHidden = true
        gsap.to(navPill, {
          yPercent: -180,
          duration: 0.55,
          ease: 'power3.inOut',
          overwrite: 'auto',
        })
      }
      const showPill = () => {
        if (!navPill || !pillHidden) return
        pillHidden = false
        gsap.to(navPill, { yPercent: 0, duration: 0.65, ease: 'power3.out', overwrite: 'auto' })
      }

      // Volta quando é preciso, não só no scroll pra cima: cursor no topo
      // da tela, foco do teclado dentro da pill (Tab nunca cai num link
      // fora de quadro) e logo depois de um salto pelo próprio menu, que
      // não deve sumir com a pill que acabou de ser usada.
      let ignorarAte = 0
      const onPointer = (ev: PointerEvent) => {
        cursorNoTopo = ev.clientY <= 96
        if (!pastHero || !pillHidden || !cursorNoTopo) return
        pillAcc = 0
        showPill()
      }
      const onFoco = () => {
        pillAcc = 0
        showPill()
      }
      const onNavegou = () => {
        pillAcc = 0
        ignorarAte = performance.now() + 1600
        showPill()
      }
      // o refresh dos pins mexe no scroll sem ninguém rolar: esse salto
      // não é direção de leitura e não pode esconder a pill
      const onRefreshInit = () => {
        ignorarAte = performance.now() + 600
      }
      const onRefreshFim = () => {
        pillLastY = window.scrollY
        pillAcc = 0
      }
      ScrollTrigger.addEventListener('refreshInit', onRefreshInit)
      ScrollTrigger.addEventListener('refresh', onRefreshFim)

      window.addEventListener('pointermove', onPointer, { passive: true })
      navPill?.addEventListener('focusin', onFoco)
      window.addEventListener(NAVEGOU_EVENT, onNavegou)
      soltarPill = () => {
        window.removeEventListener('pointermove', onPointer)
        navPill?.removeEventListener('focusin', onFoco)
        window.removeEventListener(NAVEGOU_EVENT, onNavegou)
        window.removeEventListener('resize', onResize)
        resizeCall?.kill()
        gestos.forEach((g) => window.removeEventListener(g, marcarPessoa))
        ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
        ScrollTrigger.removeEventListener('refresh', onRefreshFim)
      }

      // ---------- Progresso da página no fio da pill ----------
      const progressTo = navProgress
        ? gsap.quickTo(navProgress, '--p', { duration: 0.35, ease: 'power2.out' })
        : null

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          progressTo?.(self.progress)
          const y = self.scroll()
          const delta = y - pillLastY
          pillLastY = y
          if (!pastHero || delta === 0 || performance.now() < ignorarAte) return
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
          invalidateOnRefresh: true,
          onLeave: () => {
            pastHero = true
            heroForaDeQuadro = true
            setManifestoPreview(true)
          },
          onEnterBack: () => {
            pastHero = false
            heroForaDeQuadro = false
            showPill()
            setManifestoPreview(true)
          },
          // refresh (e o primeiro cálculo, com o scroll restaurado) põe a
          // pill no estado certo sem tocar a coreografia
          onRefresh: (self) => sincronizarHeader(self.progress),
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
            // Antes do reveal os fades nao escrevem inline: a opacidade
            // inline venceria o CSS do is-entering e vazava a headline e
            // o poster do mascote durante a subida da folha da abertura.
            if (!section.classList.contains('is-entering')) {
              // os prédios da frente recuam enquanto a frase vem pra frente
              const queda = clamp01((p10 - 0.3) / 2.3)
              if (predios) {
                predios.style.opacity = String(0.5 - 0.28 * queda * queda * (3 - 2 * queda))
              }
              fade(video, 1 - clamp01((p10 - 7.65) / 0.4))
              fade(mascoteStatic, clamp01((p10 - 7.6) / 0.4))
            }

            // A frase assentou: a palavra começa a trocar no lugar. Gesto
            // com histerese, pra não piscar na borda do gatilho.
            const assentado = section.classList.contains('is-assentado')
            if (!assentado && p10 >= 2.7) {
              section.classList.add('is-assentado')
              iniciarTroca()
            } else if (assentado && p10 < 2.2) {
              section.classList.remove('is-assentado')
              pararTroca()
            }

            // O vídeo roda a cena inteira e só congela quando o card
            // começa a encolher e o palco branco aparece.
            setManifestoPreview(self.progress >= MANIFESTO_NAV_TRIGGER)
            if (self.progress >= HEADER_TRIGGER) {
              if (!video.paused) video.pause()
            } else if (video.paused) {
              void video.play().catch(() => {})
            }

            // O header dispara em tempo próprio quando o encolhimento
            // começa, e desfaz na volta. O scroll é só o gatilho.
            sincronizarHeader(self.progress)
          },
        },
      })

      // ---------- Beat 1 (0.3 a 2.6): a frase cai, a mão desfaz ----------
      // A frase acende e cai em duas partes; no mesmo ritmo, a assinatura
      // se desfaz de trás pra frente, como a mão voltando pelo traço.
      tl.fromTo('.headline-ghost', { opacity: 0.16 }, { opacity: 1, duration: 1.7 }, 0.3)
      tl.fromTo(headline, { '--sweep2': '-30%' }, { '--sweep2': '130%', duration: 1.1 }, 0.2)
      tl.fromTo(headline, { '--sweep2': '-30%' }, { '--sweep2': '130%', duration: 1.0 }, 1.5)
      tl.fromTo(
        '.hl-a',
        { x: 0, y: 0, scale: 1 },
        {
          x: () => alvos().a.x,
          y: () => alvos().a.y,
          scale: () => alvos().a.s,
          duration: 2.3,
          ease: 'power3.out',
          immediateRender: false,
        },
        0.3,
      )
      tl.fromTo(
        '.hl-b',
        { x: 0, y: 0, scale: 1 },
        {
          x: () => alvos().b.x,
          y: () => alvos().b.y,
          scale: () => alvos().b.s,
          duration: 2.3,
          ease: 'power3.out',
          immediateRender: false,
        },
        0.3,
      )
      // A mão é função pura do tempo da timeline (já suavizado pelo
      // scrub): desfaz de 0.3 a 2.4, fica sem tinta enquanto a frase
      // assenta e reescreve de 3.3 a 6.0. Duas tweens no mesmo valor se
      // atropelavam no refresh e apagavam a assinatura no topo.
      const maoNoTempo = (t: number) => {
        if (t <= 0.3) return 1
        if (t < 2.4) {
          const u = (t - 0.3) / 2.1
          return 1 - u * u * (3 - 2 * u)
        }
        if (t <= 3.3) return 0
        return Math.min(1, (t - 3.3) / 2.7)
      }
      tl.eventCallback('onUpdate', () => desenharPixo(maoNoTempo(tl.time())))

      tl.fromTo(
        ['.hero-bg', '.hero-predios'],
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

    return () => {
      pararTroca()
      soltarPill()
      setManifestoPreview(false)
      delete document.documentElement.dataset.manifestoNavReady
      ctx.revert()
    }
  }, [sectionRef, frameRef, headlineRef, grafismRef, videoRef, mascoteStaticRef])
}
