// Cena 7 · Sobre · o motor da cena. Três naturezas de movimento, cada uma
// na sua lei (como a tira dos Pilares):
// 1. CÂMERA, função pura do scroll: a folha sobe por cima do fecho verde
//    dos Pilares, que fica parado e cresce um pouco enquanto é coberto (a
//    subida do "Sobre" do Eduardo, decisão 79); e cada tira da folha de
//    contato se revela do papel ao halftone conforme chega ao centro.
// 2. GESTOS em tempo real, com histerese: o círculo e a seta da mão em
//    volta do take escolhido, o sublinhado da tese e as setas do retrato.
// 3. FÍSICA: as fitas da borda correm com a velocidade e o sentido da
//    rolagem; as provas do varal balançam (folhaFisica, material próprio)
//    com a inércia da rolagem e com o cursor, e a mão pode pegar e soltar.
// Sem pin (reduced motion e telas estreitas), tudo vem pronto e parado.

import { type RefObject, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { registrarDestino } from '../../lib/navegar'
import {
  type Folha,
  type Material,
  anguloDaMao,
  emRepouso,
  novaFolha,
  passo,
  proximidade,
} from '../Pilares/folhaFisica'
import { STATIC_QUERY } from '../Pilares/useTira'

/** Prova fotográfica no varal: papel leve, preso por pregador no topo. */
const PROVA: Material = {
  gravidade: 19,
  ar: 2.2,
  vento: 0.14,
  inercia: 0.0045,
  limite: 12,
}

// histerese dos gestos, em telas de distância do centro
const CIRCULA = 0.08
const DESCIRCULA = 0.3
const ASSINA = 0.12
const DESASSINA = 0.35

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Quanto a tira já se revelou: papel branco longe, foto no centro e depois. */
export function revelacao(d: number): number {
  return d <= 0 ? 1 : clamp(1 - (d - 0.05) * 2.2)
}

/** O fio cede no meio: a flecha (px) cresce com a rolagem e volta ao repouso. */
export function flechaDoFio(velocidade: number): number {
  return 12 + clamp(velocidade * 0.004, -6, 14)
}

export function useSobre(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const offDestino = registrarDestino(
      'sobre',
      () => window.scrollY + section.getBoundingClientRect().top,
    )
    const tiras = Array.from(section.querySelectorAll<HTMLElement>('.sv-tira'))
    const tese = section.querySelector<HTMLElement>('.sv-tese')

    if (window.matchMedia(STATIC_QUERY).matches) {
      section.classList.add('is-estatica')
      tiras.forEach((t) => t.classList.add('is-circulada'))
      tese?.classList.add('is-assinada')
      return () => {
        offDestino()
        section.classList.remove('is-estatica')
      }
    }

    // ---------- 1. A subida por cima do fecho ----------
    // Quando o pin dos Pilares solta, a seção deles voltaria a rolar pra
    // cima; o translate devolve o que o scroll levou, então o fecho fica
    // parado enquanto esta folha sobe. --cobre (0 a 1) deixa o CSS do fecho
    // crescer e subir um pouco. O translate sai antes de cada refresh do
    // ScrollTrigger, pra não entrar na medida do pin.
    const pilares = document.querySelector<HTMLElement>('.pilares')
    let cobreAtual = -1
    const cobrir = (p: number) => {
      if (!pilares || Math.abs(p - cobreAtual) < 0.0005) return
      cobreAtual = p
      pilares.style.translate = p > 0 ? `0 ${(p * window.innerHeight).toFixed(1)}px` : ''
      pilares.style.setProperty('--cobre', p.toFixed(4))
    }
    const antesDoRefresh = () => {
      cobreAtual = -1
      if (pilares) pilares.style.translate = ''
    }
    ScrollTrigger.addEventListener('refreshInit', antesDoRefresh)

    // ---------- 3a. As fitas ----------
    const fitas = Array.from(section.querySelectorAll<HTMLElement>('.sv-fita')).map((el) => {
      const trilho = el.querySelector<HTMLElement>('.sv-fita-trilho')
      const jogo = trilho?.firstElementChild as HTMLElement | null
      return { trilho, jogo, dir: Number(el.dataset.dir) || 1, x: 0, w: 1 }
    })
    const medirFitas = () => {
      for (const f of fitas) {
        if (!f.trilho || !f.jogo) continue
        while (f.trilho.children.length > 1) f.trilho.lastElementChild?.remove()
        f.w = f.jogo.getBoundingClientRect().width || 1
        const copias = Math.ceil((window.innerWidth * 1.4) / f.w) + 1
        for (let i = 0; i < copias; i += 1) f.trilho.append(f.jogo.cloneNode(true))
        f.x = -f.w * (f.dir > 0 ? 0.37 : 0.61)
      }
    }
    medirFitas()

    // ---------- 3b. O varal ----------
    const varal = section.querySelector<HTMLElement>('.sv-varal')
    const fio = section.querySelector<SVGPathElement>('.sv-fio-linha')
    const fioSvg = section.querySelector<SVGSVGElement>('.sv-fio')
    const cursorFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const provas = Array.from(section.querySelectorAll<HTMLElement>('.sv-prova')).map((el, i) => ({
      el,
      estado: novaFolha() as Folha,
      material: { ...PROVA, gravidade: PROVA.gravidade * (0.86 + 0.12 * i) },
    }))
    let px = -1e5
    let py = -1e5
    let fx = px
    let fy = py
    let vx = 0
    let vy = 0
    let pega: { prova: (typeof provas)[number]; offset: number; pointerId: number } | null = null

    // ---------- o laço da cena ----------
    let ativa = false
    let velocidade = 0
    let velAnterior = 0
    let aceleracao = 0
    let sentido = 1
    let ultimo = performance.now()

    const tique = () => {
      if (!ativa && !pega) return
      const agora = performance.now()
      const dt = clamp((agora - ultimo) / 1000, 1 / 240, 0.05)
      ultimo = agora
      const vh = window.innerHeight

      // fitas: base lenta, mais rápidas quanto mais rápida a rolagem
      const porQuadro = velocidade / 60
      if (Math.abs(porQuadro) > 0.4) sentido = porQuadro > 0 ? 1 : -1
      const rapidez = 0.05 + Math.min(Math.abs(porQuadro), 80) * 0.028
      for (const f of fitas) {
        if (!f.trilho) continue
        f.x -= f.dir * sentido * rapidez * dt * 1000
        if (f.x <= -f.w) f.x += f.w
        if (f.x > 0) f.x -= f.w
        f.trilho.style.transform = `translate3d(${f.x.toFixed(2)}px, 0, 0)`
      }

      // tiras: revelação (câmera) e círculo (gesto com histerese)
      for (const t of tiras) {
        const r = t.getBoundingClientRect()
        const d = (r.top + r.height / 2 - vh * 0.5) / vh
        t.style.setProperty('--revela', revelacao(d).toFixed(3))
        const circulada = t.classList.contains('is-circulada')
        if (!circulada && d < CIRCULA) t.classList.add('is-circulada')
        else if (circulada && d > DESCIRCULA) t.classList.remove('is-circulada')
      }
      if (tese) {
        const r = tese.getBoundingClientRect()
        const d = (r.top + r.height / 2 - vh * 0.5) / vh
        const assinada = tese.classList.contains('is-assinada')
        if (!assinada && d < ASSINA) tese.classList.add('is-assinada')
        else if (assinada && d > DESASSINA) tese.classList.remove('is-assinada')
      }

      // varal: o fio cede, as provas balançam
      if (varal && fio && fioSvg) {
        const vr = varal.getBoundingClientRect()
        if (vr.bottom > -vh * 0.2 && vr.top < vh * 1.2) {
          const flecha = flechaDoFio(velocidade)
          fio.setAttribute('d', `M0 2 Q 50 ${(2 + flecha).toFixed(2)} 100 2`)
          const fr = fioSvg.getBoundingClientRect()
          if (fx < -1e4) {
            fx = px
            fy = py
          }
          vx += ((px - fx) / dt - vx) * 0.35
          vy += ((py - fy) / dt - vy) * 0.35
          fx = px
          fy = py
          for (const p of provas) {
            const box = p.el.getBoundingClientRect()
            const pivoX = box.left + box.width / 2
            const t = clamp((pivoX - fr.left) / Math.max(1, fr.width))
            p.el.style.setProperty('--sag', `${(4 * t * (1 - t) * flecha).toFixed(1)}px`)
            const perto = cursorFino ? proximidade(box, px, py) : 0
            const alvoMao =
              pega?.prova === p ? anguloDaMao(pivoX, box.top, px, py) - pega.offset : null
            p.estado = passo(
              p.estado,
              {
                prox: perto,
                alavanca: clamp((py - box.top) / box.height),
                lado: clamp((px - pivoX) / (box.width / 2), -1, 1),
                vx: perto > 0 ? vx : 0,
                vy: perto > 0 ? vy : 0,
                // a rolagem vertical sacode o varal de lado
                camAcc: aceleracao * 0.6,
                alvoMao,
              },
              p.material,
              dt,
            )
            const s = p.estado
            if (emRepouso(s) && !pega) {
              p.el.style.removeProperty('--f-ang')
              p.el.style.removeProperty('--f-rx')
              p.el.style.removeProperty('--f-ry')
              continue
            }
            p.el.style.setProperty('--f-ang', s.ang.toFixed(3))
            p.el.style.setProperty('--f-rx', s.rx.toFixed(3))
            p.el.style.setProperty('--f-ry', s.ry.toFixed(3))
          }
        }
      }

      // a rolagem parou: a velocidade cai sozinha entre um onUpdate e outro
      velocidade *= 0.9
      aceleracao *= 0.8
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onToggle: (self) => {
        ativa = self.isActive
        ultimo = performance.now()
      },
      onUpdate: (self) => {
        cobrir(clamp((self.scroll() - self.start) / window.innerHeight))
        const v = self.getVelocity()
        aceleracao += ((v - velAnterior) * 60 - aceleracao) * 0.25
        velAnterior = v
        velocidade = v
      },
      onRefresh: (self) => {
        medirFitas()
        cobrir(clamp((self.scroll() - self.start) / window.innerHeight))
      },
      onLeave: () => cobrir(1),
      onLeaveBack: () => cobrir(0),
    })
    ativa = st.isActive
    gsap.ticker.add(tique)

    // a mão no varal
    const onMove = (ev: PointerEvent) => {
      px = ev.clientX
      py = ev.clientY
    }
    const onDown = (ev: PointerEvent) => {
      if (!cursorFino || ev.button !== 0 || ev.pointerType === 'touch') return
      const prova = provas.find((p) => p.el === ev.currentTarget)
      if (!prova) return
      ev.preventDefault()
      const box = prova.el.getBoundingClientRect()
      const mao = anguloDaMao(box.left + box.width / 2, box.top, ev.clientX, ev.clientY)
      pega = { prova, offset: mao - prova.estado.ang, pointerId: ev.pointerId }
      prova.el.setPointerCapture?.(ev.pointerId)
      prova.el.classList.add('is-pega')
      px = ev.clientX
      py = ev.clientY
    }
    const onUp = (ev: PointerEvent) => {
      if (!pega || ev.pointerId !== pega.pointerId) return
      pega.prova.el.classList.remove('is-pega')
      pega.prova.el.releasePointerCapture?.(ev.pointerId)
      pega = null
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    provas.forEach((p) => p.el.addEventListener('pointerdown', onDown))

    return () => {
      gsap.ticker.remove(tique)
      st.kill()
      ScrollTrigger.removeEventListener('refreshInit', antesDoRefresh)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      provas.forEach((p) => {
        p.el.removeEventListener('pointerdown', onDown)
        p.el.classList.remove('is-pega')
      })
      if (pilares) {
        pilares.style.translate = ''
        pilares.style.removeProperty('--cobre')
      }
      offDestino()
    }
  }, [sectionRef])
}
