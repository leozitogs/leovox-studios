export interface HarnessSceneState {
  id: string
  progress: number | null
  active: boolean
  rect: { top: number; left: number; width: number; height: number }
  dataset: Record<string, string>
  classes: string[]
}

export interface HarnessAnimation {
  source: 'css' | 'gsap'
  label: string
  progress: number | null
}

export interface HarnessScrollTrigger {
  id: string | null
  scene: string | null
  start: number
  end: number
  progress: number
  active: boolean
}

export interface HarnessFrameMetrics {
  durationMs: number
  frameCount: number
  averageFrameMs: number
  p95FrameMs: number
  longFrames: number
}

export interface LeovoxHarness {
  ready(): Promise<void>
  listScenes(): string[]
  enterScene(id: string): Promise<HarnessSceneState>
  setProgress(id: string, progress: number): Promise<HarnessSceneState>
  settle(timeoutMs?: number): Promise<void>
  getSceneState(id: string): HarnessSceneState
  getActiveAnimations(): HarnessAnimation[]
  getScrollTriggers(): HarnessScrollTrigger[]
  collectFrameMetrics(durationMs?: number): Promise<HarnessFrameMetrics>
}

declare global {
  interface Window {
    __LEOVOX_HARNESS__?: LeovoxHarness
  }
}
