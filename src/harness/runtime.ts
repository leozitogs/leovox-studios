import { gsap, ScrollTrigger } from '../lib/gsap'
import { getLenis } from '../lib/lenis'
import type {
  HarnessAnimation,
  HarnessFrameMetrics,
  HarnessSceneState,
  HarnessScrollTrigger,
  LeovoxHarness,
} from './types'

const SCENE_SELECTOR = '[data-harness-scene]'

function frame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

function scene(id: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(`[data-harness-scene="${id}"]`)
  if (!element) throw new Error(`LVX-HARNESS-001: cena não encontrada: ${id}`)
  return element
}

function triggerFor(element: HTMLElement) {
  return ScrollTrigger.getAll().find((trigger) => trigger.trigger === element) ?? null
}

function stateFor(element: HTMLElement): HarnessSceneState {
  const rect = element.getBoundingClientRect()
  const trigger = triggerFor(element)
  return {
    id: element.dataset.harnessScene ?? 'unknown',
    progress: trigger?.progress ?? null,
    active: trigger?.isActive ?? (rect.bottom > 0 && rect.top < window.innerHeight),
    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    dataset: { ...element.dataset } as Record<string, string>,
    classes: [...element.classList],
  }
}

async function settle(timeoutMs = 1800): Promise<void> {
  const started = performance.now()
  let stableFrames = 0
  let lastY = window.scrollY

  while (performance.now() - started < timeoutMs) {
    ScrollTrigger.update()
    await frame()
    const y = window.scrollY
    // Cenas podem manter matéria viva em loops contínuos. Assentamento
    // aqui significa câmera estável; animações ainda ativas continuam
    // observáveis por getActiveAnimations().
    stableFrames = Math.abs(y - lastY) < 0.25 ? stableFrames + 1 : 0
    lastY = y
    // A gravidade das cenas é agendada depois de 150 ms. Esperar esse
    // limiar evita declarar repouso antes de ela começar.
    if (stableFrames >= 6 && performance.now() - started >= 220) return
  }

  throw new Error(`LVX-HARNESS-002: interface não assentou em ${timeoutMs}ms`)
}

async function scrollToPosition(position: number): Promise<void> {
  const lenis = getLenis()
  // Suspender o ticker evita uma corrida entre o scroll nativo e o alvo
  // interno do Lenis. O salto só volta a aceitar input depois que ambos
  // apontam para a mesma posição.
  lenis?.stop()
  if (lenis) {
    // ScrollTrigger cria pin-spacers depois do boot. Atualizar a dimensão
    // impede que o Lenis limite um alvo válido ao tamanho anterior da página.
    lenis.resize()
    lenis.scrollTo(position, { immediate: true, force: true })
  } else window.scrollTo({ top: position, behavior: 'instant' })
  ScrollTrigger.update()
  await frame()
  await frame()
  lenis?.start()
}

function install(): void {
  const api: LeovoxHarness = {
    async ready() {
      await document.fonts.ready
      const started = performance.now()
      while (document.documentElement.classList.contains('is-loading')) {
        if (performance.now() - started > 12000) {
          throw new Error('LVX-HARNESS-003: loader não concluiu')
        }
        await frame()
      }
      ScrollTrigger.refresh()
      getLenis()?.resize()
      await frame()
      await frame()
    },

    listScenes() {
      return Array.from(
        document.querySelectorAll<HTMLElement>(SCENE_SELECTOR),
        (element) => element.dataset.harnessScene ?? '',
      ).filter(Boolean)
    },

    async enterScene(id) {
      const element = scene(id)
      const trigger = triggerFor(element)
      const top = trigger?.start ?? window.scrollY + element.getBoundingClientRect().top
      await scrollToPosition(top + 1)
      return stateFor(element)
    },

    async setProgress(id, progress) {
      const element = scene(id)
      const normalized = Math.max(0, Math.min(1, progress))
      const trigger = triggerFor(element)
      const documentTop = window.scrollY + element.getBoundingClientRect().top
      const start = trigger?.start ?? documentTop
      const end =
        trigger?.end ?? documentTop + Math.max(1, element.offsetHeight - window.innerHeight)
      await scrollToPosition(start + (end - start) * normalized)
      return stateFor(element)
    },

    settle,

    getSceneState(id) {
      return stateFor(scene(id))
    },

    getActiveAnimations() {
      const css: HarnessAnimation[] = document
        .getAnimations()
        .filter((animation) => animation.playState === 'running')
        .map((animation) => ({
          source: 'css',
          label:
            animation.id ||
            (animation.effect instanceof KeyframeEffect
              ? animation.effect.target?.constructor.name
              : null) ||
            'animation',
          progress: animation.effect?.getComputedTiming().progress ?? null,
        }))
      const gsapAnimations: HarnessAnimation[] = gsap.globalTimeline
        .getChildren(true, true, true)
        .filter((animation) => animation.isActive())
        .map((animation) => ({
          source: 'gsap',
          label: animation.vars.id?.toString() ?? animation.data?.toString() ?? 'timeline',
          progress: animation.progress(),
        }))
      return [...css, ...gsapAnimations]
    },

    getScrollTriggers() {
      return ScrollTrigger.getAll().map<HarnessScrollTrigger>((trigger) => {
        const triggerElement = trigger.trigger instanceof HTMLElement ? trigger.trigger : null
        return {
          id: trigger.vars.id?.toString() ?? null,
          scene: triggerElement?.closest<HTMLElement>(SCENE_SELECTOR)?.dataset.harnessScene ?? null,
          start: trigger.start,
          end: trigger.end,
          progress: trigger.progress,
          active: trigger.isActive,
        }
      })
    },

    async collectFrameMetrics(durationMs = 1000) {
      const samples: number[] = []
      const started = performance.now()
      let previous = started
      while (performance.now() - started < durationMs) {
        await frame()
        const now = performance.now()
        samples.push(now - previous)
        previous = now
      }
      const sorted = [...samples].sort((a, b) => a - b)
      const average = samples.reduce((sum, value) => sum + value, 0) / Math.max(1, samples.length)
      const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0
      const metrics: HarnessFrameMetrics = {
        durationMs: performance.now() - started,
        frameCount: samples.length,
        averageFrameMs: average,
        p95FrameMs: p95,
        longFrames: samples.filter((value) => value > 50).length,
      }
      return metrics
    },
  }

  window.__LEOVOX_HARNESS__ = api
}

export function installHarness(): void {
  const params = new URLSearchParams(window.location.search)
  if (params.get('harness') !== '1' || window.__LEOVOX_HARNESS__) return
  install()
}
