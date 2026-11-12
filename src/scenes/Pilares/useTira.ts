// Cena 3 · Pilares · o motor da tira (briefing v4).
// Três naturezas de movimento, cada uma na sua lei:
// 1. CHEGADA: a luz cai do off-white do manifesto pro #222222 da tira,
//    função pura do progresso (inalterada desde a decisão 59).
// 2. CÂMERA: a posição da tira é função pura do scroll dentro do pin.
//    Cada painel recebe `--d` (distância ao centro, em telas) e o CSS
//    deriva dele parallax, revelação e inclinação. Parou o scroll, a
//    gravidade assenta no painel mais próximo: a tela nunca descansa
//    entre dois (decisões 35 e 47).
// 3. GESTOS: carimbos, troca de nome no trilho e vídeo do painel ativo
//    disparam em tempo real quando um painel liga, com histerese.

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import { TIRA } from './frentes'
import {
  D_MAX,
  TITULO_ON_VH,
  type TiraLayout,
  cameraX,
  clamp,
  nearestPanel,
  nearness,
  panelOffset,
  pinLength,
  railFill,
  restScroll,
  reveal,
  settleTarget,
  velocitySkew,
} from './tiraMath'

// Laptop primeiro: abaixo disso (e com reduced motion) a tira não pina.
export const STATIC_QUERY = '(prefers-reduced-motion: reduce), (max-width: 899px)'

// Histerese do liga e desliga de cada painel, em telas de distância.
const LIGA = 0.38
const DESLIGA = 0.5

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

function rotuloDe(i: number): string {
  const painel = TIRA[i]
  if (!painel) return ''
  switch (painel.kind) {
    case 'trabalho':
      return painel.trabalho.titulo
    case 'capa':
      return painel.frente.nome
    case 'fecho':
      return 'Um ecossistema'
    default:
      return ''
  }
}

function frenteDe(i: number): string | null {
  const painel = TIRA[i]
  if (!painel) return null
  if (painel.kind === 'capa' || painel.kind === 'trabalho') return painel.frente.id
  return null
}

export function useTira(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const track = section.querySelector<HTMLElement>('.pl-track')
    const abertura = section.querySelector<HTMLElement>('.pl-abertura')
    if (!track || !abertura) return
    const paineis = Array.from(track.children) as HTMLElement[]

    if (window.matchMedia(STATIC_QUERY).matches) {
      section.classList.add('is-static')
      paineis.forEach((el) => el.classList.add('is-on'))
      return () => section.classList.remove('is-static')
    }

    const ids = TIRA.map((p) => p.id)
    const paper = section.closest<HTMLElement>('.story-paper')
    const signature = paper?.querySelector<HTMLElement>('.mf-ato-4')
    const header = document.querySelector<HTMLElement>('.nav-pill')
    const capituloNome = section.querySelector<HTMLElement>('.tr-capitulo-nome')
    const contadorN = section.querySelector<HTMLElement>('.tr-contador-n')
    const nome = section.querySelector<HTMLElement>('.tr-nome')
    const ticks = Array.from(section.querySelectorAll<HTMLButtonElement>('.tr-tick'))
    const navBtns = Array.from(section.querySelectorAll<HTMLButtonElement>('.pl-nav-btn'))
    const tickPanel = ticks.map((t) => ids.indexOf(t.dataset.goto ?? ''))
    const corLuz = gsap.utils.interpolate('#fbfbfb', '#222222')

    // A largura da tira sai da borda do último painel, nunca do
    // scrollWidth: texto fantasma e elementos transformados transbordam
    // os painéis e inflariam a travessia (bug provado em browser).
    const measure = (): TiraLayout => {
      const panels = paineis.map((el) => ({ left: el.offsetLeft, width: el.offsetWidth }))
      const last = panels[panels.length - 1]
      return {
        vw: window.innerWidth,
        vh: window.innerHeight,
        trackWidth: last ? last.left + last.width : 0,
        panels,
      }
    }

    let layout = measure()
    let s = 0
    let current = -1
    let arrivalProgress = 0
    let idle = 0
    const ligado = paineis.map(() => false)
    const ultimoD = paineis.map(() => Number.NaN)

    const ramp = (p: number, start: number, end: number) => {
      const t = clamp((p - start) / (end - start))
      return t * t * (3 - 2 * t)
    }

    paper?.classList.add('has-paper-transition')

    // O menu some enquanto o cartaz ocupa a tela e continua fora durante
    // a tira: a pílula caía por cima do topo das capas. Ele volta quando o
    // cursor sobe pro topo da tela e no fecho.
    let cursorNoTopo = false
    const updateMenu = () => {
      const naTira = current > 0 && TIRA[current]?.kind !== 'fecho'
      const alpha =
        current <= 0 ? 1 - ramp(arrivalProgress, 0.12, 0.55) : naTira && !cursorNoTopo ? 0 : 1
      header?.style.setProperty('--paper-menu', String(alpha))
      if (header) header.inert = alpha < 0.01
    }
    const onPointer = (ev: PointerEvent) => {
      const noTopo = ev.clientY < 110
      if (noTopo === cursorNoTopo) return
      cursorNoTopo = noTopo
      updateMenu()
    }

    const tocarMidia = (el: HTMLElement, on: boolean) => {
      el.querySelectorAll<HTMLVideoElement>('video').forEach((video) => {
        if (on) void video.play().catch(() => {})
        else video.pause()
      })
    }

    const carimbar = (el: HTMLElement | null) => {
      if (!el) return
      el.classList.remove('is-stamp')
      // força o reflow pra animação reexecutar a cada troca
      void el.offsetWidth
      el.classList.add('is-stamp')
    }

    const atualizarTrilho = (i: number) => {
      section.dataset.panel = ids[i]
      section.dataset.kind = TIRA[i]?.kind ?? ''
      section.classList.toggle('has-trilho', i > 0)
      const frente = frenteDe(i)
      navBtns.forEach((btn) => {
        const ativo = frente !== null && btn.dataset.goto === `capa-${frente}`
        btn.classList.toggle('is-ativo', ativo)
        if (ativo) btn.setAttribute('aria-current', 'true')
        else btn.removeAttribute('aria-current')
      })
      if (capituloNome) {
        const painel = TIRA[i]
        capituloNome.textContent =
          painel && (painel.kind === 'capa' || painel.kind === 'trabalho') ? painel.frente.nome : ''
      }
      // na capa, o contador já aponta o primeiro trabalho daquela frente
      const proximo = TIRA.slice(i).find((p) => p.kind === 'trabalho')
      if (contadorN && proximo?.kind === 'trabalho') {
        contadorN.textContent = String(proximo.indice + 1).padStart(2, '0')
      }
      if (nome) {
        nome.textContent = rotuloDe(i)
        carimbar(nome)
      }
      ticks.forEach((tick, j) => tick.classList.toggle('is-atual', tickPanel[j] === i))
    }

    const render = (scroll: number) => {
      s = scroll
      const x = cameraX(s, layout)
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`
      const aceso = s >= TITULO_ON_VH * layout.vh
      section.classList.toggle('is-aceso', aceso)

      paineis.forEach((el, i) => {
        const box = layout.panels[i]
        if (!box) return
        const d = clamp(panelOffset(box, x, layout.vw), -D_MAX, D_MAX)
        if (d !== ultimoD[i]) {
          ultimoD[i] = d
          el.style.setProperty('--d', d.toFixed(4))
          el.style.setProperty('--near', nearness(d).toFixed(4))
          el.style.setProperty('--reveal', reveal(d).toFixed(4))
        }
        const ad = Math.abs(d)
        let on = ligado[i] ? ad <= DESLIGA : ad < LIGA
        if (i === 0) on = on && aceso
        if (on !== ligado[i]) {
          ligado[i] = on
          el.classList.toggle('is-on', on)
          tocarMidia(el, on)
        }
        // fora de quadro nada recebe foco nem leitura
        const fora = ad > 0.75
        if (fora !== el.hasAttribute('inert')) el.toggleAttribute('inert', fora)
        if (i === paineis.length - 1) section.classList.toggle('is-fecho-perto', ad < 0.95)
      })

      const perto = nearestPanel(x, layout)
      if (perto !== current) {
        current = perto
        atualizarTrilho(perto)
      }
      ticks.forEach((tick, j) => {
        const box = layout.panels[tickPanel[j]]
        if (box) tick.style.setProperty('--fill', railFill(box, x, layout.vw).toFixed(3))
      })
      updateMenu()
    }

    // Assentou: a câmera parou num descanso (ou fora do pin). Só então
    // as fichas dos trabalhos saem de trás dos cartões (is-andando).
    // Se a rolagem de assentamento for interrompida e a câmera não andar
    // mais, o settle tenta de novo; depois de duas tentativas sem
    // movimento, as fichas saem assim mesmo (nunca ficam presas).
    let tentativas = 0
    const settle = () => {
      section.style.setProperty('--skew', '0')
      const target = st.isActive ? settleTarget(s, layout) : null
      if (target === null || tentativas >= 2) {
        section.classList.remove('is-andando')
        return
      }
      tentativas += 1
      getLenis()?.scrollTo(st.start + target, { duration: 0.6, easing: easeOutCubic })
      window.clearTimeout(idle)
      idle = window.setTimeout(settle, 900)
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: () => `+=${pinLength(layout)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefreshInit: () => {
        layout = measure()
      },
      onUpdate: (self) => {
        section.classList.add('is-andando')
        render(self.scroll() - self.start)
        section.style.setProperty('--skew', velocitySkew(self.getVelocity()).toFixed(3))
        tentativas = 0
        window.clearTimeout(idle)
        idle = window.setTimeout(settle, 150)
      },
      onRefresh: (self) => render(self.scroll() - self.start),
    })

    layout = measure()
    render(st.scroll() - st.start)

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

    // Navegação deliberada (trilho e teclado): rola até o descanso do painel.
    const goTo = (i: number) => {
      const alvo = Math.max(0, Math.min(paineis.length - 1, i))
      getLenis()?.scrollTo(st.start + restScroll(alvo, layout), {
        duration: 0.9,
        easing: easeOutCubic,
      })
    }
    const onKey = (ev: KeyboardEvent) => {
      if (!st.isActive || ev.altKey || ev.ctrlKey || ev.metaKey) return
      if (ev.key === 'ArrowRight') {
        ev.preventDefault()
        goTo(current + 1)
      } else if (ev.key === 'ArrowLeft') {
        ev.preventDefault()
        goTo(current - 1)
      }
    }
    const onClick = (ev: MouseEvent) => {
      const alvo = (ev.target as HTMLElement | null)?.closest<HTMLElement>('[data-goto]')
      if (!alvo || !section.contains(alvo)) return
      const i = ids.indexOf(alvo.dataset.goto ?? '')
      if (i >= 0) goTo(i)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointermove', onPointer, { passive: true })
    section.addEventListener('click', onClick)

    return () => {
      window.clearTimeout(idle)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointermove', onPointer)
      section.removeEventListener('click', onClick)
      st.kill()
      arrival?.kill()
      track.style.removeProperty('transform')
      paineis.forEach((el) => {
        for (const name of ['--d', '--near', '--reveal']) el.style.removeProperty(name)
        el.classList.remove('is-on')
        el.removeAttribute('inert')
        tocarMidia(el, false)
      })
      paper?.classList.remove('has-paper-transition')
      for (const name of ['--paper-color', '--paper-texture', '--paper-lines'])
        paper?.style.removeProperty(name)
      for (const name of [
        '--skew',
        '--pl-personagem-motion',
        '--pl-title-motion',
        '--pl-title-layer',
        '--pl-green-motion',
        '--pl-arrow-motion',
        '--pl-white-motion',
        '--pl-paper-reveal',
      ])
        section.style.removeProperty(name)
      section.classList.remove('is-aceso', 'has-trilho', 'is-andando', 'is-fecho-perto')
      header?.style.removeProperty('--paper-menu')
      if (header) header.inert = false
    }
  }, [sectionRef])
}
