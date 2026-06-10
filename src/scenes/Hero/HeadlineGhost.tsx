// Headline fantasma: DESENVOLVA SEUS SONHOS. em Extenda, integrada ao céu.
// Duas mecânicas: varredura de luz ocasional (a cada ~7s) e revelação
// real no hover, com a máscara seguindo o cursor. Tudo por máscara de
// gradiente, herança serigrafia: luz por cor, zero glow.

import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const HEADLINE = 'DESENVOLVA SEUS SONHOS.'

export function HeadlineGhost() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('is-resolved')
      return
    }

    // quickTo no lugar de quickSetter: a luz ganha inércia e arrasta
    // levemente atrás do cursor, em vez de grudar nele.
    const moveX = gsap.quickTo(root, '--mx', { duration: 0.45, ease: 'power3.out' })
    const moveY = gsap.quickTo(root, '--my', { duration: 0.45, ease: 'power3.out' })
    let inside = false

    const onMove = (event: MouseEvent) => {
      const rect = root.getBoundingClientRect()
      moveX(event.clientX - rect.left)
      moveY(event.clientY - rect.top)

      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      if (isInside !== inside) {
        inside = isInside
        gsap.to(root, {
          '--reveal': isInside ? 1 : 0,
          duration: isInside ? 0.4 : 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
    }

    window.addEventListener('mousemove', onMove)

    const sweep = gsap.timeline({ repeat: -1, repeatDelay: 6.5, delay: 1.2 })
    sweep.fromTo(
      root,
      { '--sweep': '-30%' },
      { '--sweep': '130%', duration: 0.9, ease: 'power2.inOut' },
    )

    return () => {
      window.removeEventListener('mousemove', onMove)
      sweep.kill()
      gsap.killTweensOf(root)
    }
  }, [])

  return (
    <div ref={rootRef} className="hero-headline">
      <h1 className="headline-stack">
        <span className="headline-ghost">{HEADLINE}</span>
        <span className="headline-lit" aria-hidden="true">
          {HEADLINE}
        </span>
        <span className="headline-sweep" aria-hidden="true">
          {HEADLINE}
        </span>
      </h1>
    </div>
  )
}
