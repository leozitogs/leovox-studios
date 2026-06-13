// A matematica pura do progresso da abertura, isolada pra teste:
// pesos dos marcos e a suavizacao independente de framerate.

export interface Marks {
  fonts: number
  video: number
  images: number
  page: number
}

export const WEIGHTS: Marks = { fonts: 0.3, video: 0.3, images: 0.25, page: 0.15 }

// Combina os marcos (cada um de 0 a 1) no progresso total, sempre 0..1.
export function combineMarks(marks: Marks): number {
  const total =
    marks.fonts * WEIGHTS.fonts +
    marks.video * WEIGHTS.video +
    marks.images * WEIGHTS.images +
    marks.page * WEIGHTS.page
  return Math.min(1, Math.max(0, total))
}

// Aproximacao exponencial por tempo real: a mesma curva em 6fps ou
// 144fps (maquina fraca nao pode atrasar a abertura).
export function approach(value: number, target: number, dt: number, rate = 4.2): number {
  const clamped = Math.min(dt, 0.12)
  return value + (target - value) * (1 - Math.exp(-rate * clamped))
}
