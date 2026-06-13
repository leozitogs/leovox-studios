// Progresso real da abertura: fontes, video do mascote, imagens-chave
// e o load da pagina, com pesos. Devolve uma ref (0 a 1) pra leitura
// por rAF sem re-render. Failsafe: rede lenta nunca prende a abertura
// pra sempre.

import { useEffect, useRef, type RefObject } from 'react'
import { combineMarks, type Marks } from './progressMath'

const KEY_IMAGES = [
  '/background/bg-buildings.png',
  '/textures/texture-paper.png',
  '/branding/typography/leovox-grafism.png',
  '/branding/mascot/mascot-full-body/mascot-hero-fallback.png',
]

const FAILSAFE_MS = 9000

export function useLoadProgress(): RefObject<number> {
  const progress = useRef(0)

  useEffect(() => {
    let alive = true
    const marks: Marks = { fonts: 0, video: 0, images: 0, page: 0 }

    const update = () => {
      if (!alive) return
      progress.current = combineMarks(marks)
    }

    document.fonts.ready.then(() => {
      marks.fonts = 1
      update()
    })

    // o video do hero ja esta montado (fora de tela, atras do loader)
    const video = document.querySelector<HTMLVideoElement>('.hero-mascote')
    if (!video || video.readyState >= 4) {
      marks.video = 1
    } else {
      const onReady = () => {
        marks.video = 1
        update()
      }
      video.addEventListener('canplaythrough', onReady, { once: true })
    }

    let loaded = 0
    KEY_IMAGES.forEach((src) => {
      const img = new Image()
      const done = () => {
        loaded += 1
        marks.images = loaded / KEY_IMAGES.length
        update()
      }
      img.onload = done
      img.onerror = done
      img.src = src
    })

    if (document.readyState === 'complete') {
      marks.page = 1
    } else {
      window.addEventListener(
        'load',
        () => {
          marks.page = 1
          update()
        },
        { once: true },
      )
    }

    const failsafe = window.setTimeout(() => {
      marks.fonts = 1
      marks.video = 1
      marks.images = 1
      marks.page = 1
      update()
    }, FAILSAFE_MS)

    update()
    return () => {
      alive = false
      window.clearTimeout(failsafe)
    }
  }, [])

  return progress
}
