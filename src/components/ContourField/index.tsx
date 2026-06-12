// Fundo minimamente interativo: linhas de contorno finas que ondulam
// sozinhas e cedem perto do cursor. A cor vem da variável --mf-line do
// ancestral (o manifesto troca por ato; o palco do hero usa a escura).

import { useEffect, useRef } from 'react'
import './contour.css'

export function ContourField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let w = 0
    let h = 0
    let raf = 0
    let running = true
    const mouse = { x: -9999, y: -9999 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = canvas.width = rect.width
      h = canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }
    window.addEventListener('mousemove', onMove)

    const LINES = 13
    const STEP = 18
    let t = 0

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!running) return
      t += 0.004
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle =
        getComputedStyle(canvas).getPropertyValue('--mf-line').trim() || 'rgba(0, 0, 0, 0.08)'
      ctx.lineWidth = 1
      for (let i = 0; i < LINES; i++) {
        const baseY = (h / (LINES + 1)) * (i + 1)
        ctx.beginPath()
        for (let x = 0; x <= w; x += STEP) {
          const wave =
            Math.sin(x * 0.004 + t * 2 + i * 0.7) * 10 + Math.sin(x * 0.011 + t * 1.3 + i) * 5
          const dy = baseY - mouse.y
          const dist = Math.hypot(x - mouse.x, dy)
          const push = Math.max(0, 1 - dist / 180) * 26 * (dy < 0 ? -1 : 1)
          const y = baseY + wave + push
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
    })
    io.observe(canvas)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="contour-field" aria-hidden="true" />
}
