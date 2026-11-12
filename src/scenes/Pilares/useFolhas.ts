// Cena 3 · Pilares · as folhas soltas. Capas e cartões são papel
// pendurado: o cursor que passa perto sopra a folha, a câmera que
// acelera a deixa pra trás, e a mão pode pegar, puxar e soltar. A
// física (folhaFisica) roda em tempo real num rAF próprio, que dorme
// quando tudo está em repouso, e escreve só variáveis CSS por folha
// (--f-ang, --f-rx, --f-ry, --f-lift); o CSS compõe com o `d` da câmera.
// É gesto de elemento em tempo real, nunca scrubado (lei de animação 1).
// Sem pin (reduced motion e telas estreitas) não há física.

import { type RefObject, useEffect } from 'react'
import {
  CAPA,
  CARTAO,
  type Folha,
  type Material,
  anguloDaMao,
  emRepouso,
  novaFolha,
  passo,
  proximidade,
} from './folhaFisica'
import { STATIC_QUERY } from './useTira'

const PROPS = ['--f-ang', '--f-rx', '--f-ry', '--f-lift'] as const

type Viva = {
  readonly el: HTMLElement
  readonly painel: HTMLElement | null
  readonly material: Material
  estado: Folha
  escrita: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function useFolhas(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia(STATIC_QUERY).matches) return
    const track = section.querySelector<HTMLElement>('.pl-track')
    if (!track) return

    const cursorFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    // cada folha tem um peso um pouco diferente: balançando todas iguais
    // e em fase, a tira parecia uma peça só (QA de 2026-11-12)
    const fracao = (x: number) => x - Math.floor(x)
    const folhas: Viva[] = Array.from(section.querySelectorAll<HTMLElement>('[data-folha]')).map(
      (el, i) => {
        const base = el.dataset.folha === 'capa' ? CAPA : CARTAO
        return {
          el,
          painel: el.closest<HTMLElement>('.pl-painel'),
          material: {
            ...base,
            gravidade: base.gravidade * (0.82 + 0.36 * fracao(i * 0.618)),
            inercia: base.inercia * (0.8 + 0.4 * fracao(i * 0.377 + 0.2)),
          },
          estado: novaFolha(),
          escrita: false,
        }
      },
    )

    // cursor: posição crua dos eventos, velocidade suavizada por quadro
    let px = -1e5
    let py = -1e5
    let fx = px
    let fy = py
    let vx = 0
    let vy = 0
    // câmera: posição da tira lida do transform que o useTira escreve
    let camX = Number.NaN
    let camV = 0
    let camAcc = 0
    let pega: { folha: Viva; offset: number; pointerId: number } | null = null

    let raf = 0
    let ultimo = 0
    let quietos = 0

    const lerCamera = () => {
      const m = /translate3d\((-?[\d.]+)px/.exec(track.style.transform)
      return m ? Number(m[1]) : 0
    }

    const limpar = (f: Viva) => {
      f.estado = novaFolha()
      if (!f.escrita) return
      for (const p of PROPS) f.el.style.removeProperty(p)
      f.escrita = false
    }

    const quadro = (agora: number) => {
      const dt = clamp((agora - ultimo) / 1000, 1 / 240, 0.05)
      ultimo = agora

      // câmera: velocidade e aceleração por diferença finita, suavizadas
      const x = lerCamera()
      if (Number.isNaN(camX)) camX = x
      const v = (x - camX) / dt
      camX = x
      const acc = (v - camV) / dt
      camV += (v - camV) * 0.5
      camAcc += (acc - camAcc) * 0.25

      // cursor: velocidade por quadro, suavizada
      if (fx < -1e4) {
        fx = px
        fy = py
      }
      vx += ((px - fx) / dt - vx) * 0.35
      vy += ((py - fy) / dt - vy) * 0.35
      fx = px
      fy = py

      // leituras primeiro, escritas depois: um único layout por quadro
      const vivas: Array<{ f: Viva; box: DOMRect }> = []
      for (const f of folhas) {
        const d = Number.parseFloat(f.painel?.style.getPropertyValue('--d') ?? '')
        const emQuadro = Number.isFinite(d) && Math.abs(d) < 1.1
        if (!emQuadro && pega?.folha !== f) {
          limpar(f)
          continue
        }
        vivas.push({ f, box: f.el.getBoundingClientRect() })
      }

      let agitado = pega !== null || Math.abs(camV) > 2
      for (const { f, box } of vivas) {
        const perto = cursorFino ? proximidade(box, px, py) : 0
        const pivoX = box.left + box.width / 2
        const alvoMao = pega?.folha === f ? anguloDaMao(pivoX, box.top, px, py) - pega.offset : null
        f.estado = passo(
          f.estado,
          {
            prox: perto,
            alavanca: clamp((py - box.top) / box.height, 0, 1),
            lado: clamp((px - pivoX) / (box.width / 2), -1, 1),
            vx: perto > 0 ? vx : 0,
            vy: perto > 0 ? vy : 0,
            camAcc,
            alvoMao,
          },
          f.material,
          dt,
        )
        const s = f.estado
        f.el.style.setProperty('--f-ang', s.ang.toFixed(3))
        f.el.style.setProperty('--f-rx', s.rx.toFixed(3))
        f.el.style.setProperty('--f-ry', s.ry.toFixed(3))
        f.el.style.setProperty('--f-lift', s.lift.toFixed(3))
        f.escrita = true
        if (perto > 0 || !emRepouso(s)) agitado = true
      }

      // tudo parado por meio segundo: dorme até o próximo cursor ou scroll
      quietos = agitado ? 0 : quietos + 1
      if (quietos > 30) {
        folhas.forEach(limpar)
        raf = 0
        return
      }
      raf = requestAnimationFrame(quadro)
    }

    const acordar = () => {
      if (raf) return
      quietos = 0
      ultimo = performance.now()
      camX = Number.NaN
      raf = requestAnimationFrame(quadro)
    }

    const onMove = (ev: PointerEvent) => {
      px = ev.clientX
      py = ev.clientY
      acordar()
    }
    const onSaiu = () => {
      px = -1e5
      py = -1e5
      fx = px
      fy = py
    }
    const onDown = (ev: PointerEvent) => {
      if (!cursorFino || ev.button !== 0 || ev.pointerType === 'touch') return
      const el = (ev.currentTarget as HTMLElement | null) ?? null
      const folha = folhas.find((f) => f.el === el)
      if (!folha) return
      ev.preventDefault()
      const box = folha.el.getBoundingClientRect()
      const mao = anguloDaMao(box.left + box.width / 2, box.top, ev.clientX, ev.clientY)
      pega = { folha, offset: mao - folha.estado.ang, pointerId: ev.pointerId }
      folha.el.setPointerCapture?.(ev.pointerId)
      folha.el.classList.add('is-pega')
      px = ev.clientX
      py = ev.clientY
      acordar()
    }
    const onUp = (ev: PointerEvent) => {
      if (!pega || ev.pointerId !== pega.pointerId) return
      pega.folha.el.classList.remove('is-pega')
      pega.folha.el.releasePointerCapture?.(ev.pointerId)
      pega = null
      acordar()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('scroll', acordar, { passive: true })
    document.documentElement.addEventListener('pointerleave', onSaiu)
    folhas.forEach((f) => f.el.addEventListener('pointerdown', onDown))

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', acordar)
      document.documentElement.removeEventListener('pointerleave', onSaiu)
      folhas.forEach((f) => {
        f.el.removeEventListener('pointerdown', onDown)
        f.el.classList.remove('is-pega')
        f.escrita = true
        limpar(f)
      })
    }
  }, [sectionRef])
}
