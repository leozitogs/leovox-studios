// O funcionamento da nav pill: destino de cada link, seção corrente e o
// marcador verde que corre entre os links. O nascimento, o some-e-volta
// e o fio de progresso continuam no useHeroScroll, que já dirige a pill.

import { type MouseEvent, useCallback, useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import { irPara, registrarDestino } from '../../lib/navegar'

export type SecaoId = 'projetos' | 'sobre' | 'servicos'

type Item = { readonly id: SecaoId; readonly rotulo: string; readonly alvo: string }

// Projetos abre no primeiro trabalho da tira; Serviços, na capa da
// primeira frente; Sobre, no primeiro ato do manifesto (a recusa é a
// história da Leovox até a Cena 7 existir).
export const NAV_ITENS: readonly Item[] = [
  { id: 'projetos', rotulo: 'Projetos', alvo: 'pilares:identidade-01' },
  { id: 'sobre', rotulo: 'Sobre', alvo: 'manifesto' },
  { id: 'servicos', rotulo: 'Serviços', alvo: 'pilares:capa-identidade' },
]

/** Qual link representa o lugar da página que está no meio da tela. */
function secaoCorrente(): SecaoId | null {
  const meio = window.innerHeight / 2
  const pilares = document.querySelector<HTMLElement>('.pilares')
  if (pilares) {
    const r = pilares.getBoundingClientRect()
    if (r.top <= meio && r.bottom > meio) {
      const kind = pilares.dataset.kind
      if (kind === 'trabalho') return 'projetos'
      if (kind === 'capa' || kind === 'fecho') return 'servicos'
      // o cartaz ainda é a chegada: o manifesto acabou de sair
      return 'servicos'
    }
  }
  const manifesto = document.querySelector<HTMLElement>('.manifesto')
  if (manifesto) {
    const r = manifesto.getBoundingClientRect()
    if (r.top <= meio && r.bottom > meio) return 'sobre'
  }
  return null
}

export function useNav() {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const lista = header.querySelector<HTMLElement>('.nav-links')
    const marca = header.querySelector<HTMLElement>('.nav-marca')
    const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('.nav-link'))
    if (!lista || !marca) return

    const tiraTopo = registrarDestino('topo', () => 0)

    let corrente: SecaoId | null = null
    let pintado = false
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur = reduzido ? 0 : 0.6
    const xTo = gsap.quickTo(marca, 'x', { duration: dur, ease: 'power3.inOut' })
    const wTo = gsap.quickTo(marca, 'width', { duration: dur, ease: 'power3.inOut' })

    // o marcador mede o texto, não a área de toque do link. offsetLeft
    // ignora as transformações da pill (nascimento e some-e-volta) e é
    // relativo à .nav-links, o primeiro ancestral posicionado
    const medir = (link: HTMLAnchorElement) => {
      const texto = link.querySelector<HTMLElement>('.nav-txt') ?? link
      return { x: texto.offsetLeft, w: texto.offsetWidth }
    }

    const pintar = () => {
      const alvo = links.find((l) => l.dataset.secao === corrente) ?? null
      marca.classList.toggle('is-visivel', alvo !== null)
      if (!alvo) return
      const { x, w } = medir(alvo)
      // a primeira vez assenta direto, sem viajar do canto
      if (!pintado) {
        gsap.set(marca, { x, width: w })
        pintado = true
        return
      }
      xTo(x)
      wTo(w)
    }

    const atualizar = () => {
      const agora = secaoCorrente()
      if (agora === corrente) return
      corrente = agora
      links.forEach((l) => {
        if (l.dataset.secao === corrente) l.setAttribute('aria-current', 'location')
        else l.removeAttribute('aria-current')
      })
      pintar()
    }

    // a seção muda com o scroll; um quadro por evento basta
    let pendente = 0
    const agendar = () => {
      if (pendente) return
      pendente = requestAnimationFrame(() => {
        pendente = 0
        atualizar()
      })
    }
    const lenis = getLenis()
    lenis?.on('scroll', agendar)
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', pintar)

    atualizar()

    return () => {
      tiraTopo()
      cancelAnimationFrame(pendente)
      lenis?.off('scroll', agendar)
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', pintar)
    }
  }, [])

  const aoClicar = useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
    // sempre por dentro do Lenis: a âncora nativa pularia por fora dele
    // e atropelaria as timelines pinadas
    ev.preventDefault()
    const alvo = ev.currentTarget.dataset.alvo
    if (alvo) void irPara(alvo)
  }, [])

  return { headerRef, aoClicar }
}
