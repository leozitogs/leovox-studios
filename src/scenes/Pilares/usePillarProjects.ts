import { type RefObject, useEffect } from 'react'

export function usePillarProjects(sectionRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const stages = Array.from(section.querySelectorAll<HTMLElement>('[data-project-stage]'))
    const cleanups = stages.map((stage) => {
      const move = (event: PointerEvent) => {
        if (!stage.closest('.pl-project')?.classList.contains('is-on')) return
        const rect = stage.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2))
        const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2))
        stage.style.setProperty('--pl-pointer-x', x.toFixed(3))
        stage.style.setProperty('--pl-pointer-y', y.toFixed(3))
      }
      const reset = () => {
        stage.style.setProperty('--pl-pointer-x', '0')
        stage.style.setProperty('--pl-pointer-y', '0')
      }
      stage.addEventListener('pointermove', move)
      stage.addEventListener('pointerleave', reset)
      return () => {
        stage.removeEventListener('pointermove', move)
        stage.removeEventListener('pointerleave', reset)
        stage.style.removeProperty('--pl-pointer-x')
        stage.style.removeProperty('--pl-pointer-y')
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [sectionRef])
}
