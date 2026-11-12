// A matemática pura da tira dos Pilares (briefing v4, "A tira").
// A câmera é função pura do scroll dentro do pin (regra de ouro do
// PIPELINE: movimento de câmera é scrubado). Quando o scroll para, a
// gravidade assenta no painel mais próximo, então a tela nunca descansa
// entre dois painéis (decisões 35 e 47). Cada painel deriva tudo o que
// faz de um único número, `d`, a distância do seu centro ao centro da
// tela: ida e volta saem de graça e nada fica órfão. O hook só
// orquestra; quem decide é isto aqui.

/** Alturas de viewport em que a câmera fica parada no cartaz. */
export const HOLD_VH = 0.7

/** Quando o cartaz assembla, em alturas de viewport dentro do pin. */
export const TITULO_ON_VH = 0.3

/** Pixels horizontais por pixel de scroll: a tira anda um pouco mais rápido que a mão. */
export const RATIO = 1.25

/** Distância, em px de scroll, abaixo da qual já se está no descanso. */
export const SETTLE_TOLERANCE = 2

/** Até onde (em larguras de tela) um painel ainda é pintado e ligado. */
export const D_MAX = 1.6

export type PanelBox = { readonly left: number; readonly width: number }

export type TiraLayout = {
  readonly vw: number
  readonly vh: number
  readonly trackWidth: number
  readonly panels: readonly PanelBox[]
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value))
}

/** Quanto a tira precisa andar na horizontal do primeiro ao último painel. */
export function travel(layout: TiraLayout): number {
  return Math.max(0, layout.trackWidth - layout.vw)
}

/** Comprimento do pin em px de scroll: o tempo do cartaz mais a travessia. */
export function pinLength(layout: TiraLayout): number {
  return HOLD_VH * layout.vh + travel(layout) / RATIO
}

/** Deslocamento da tira para o scroll `s` dentro do pin. Nunca positivo. */
export function cameraX(s: number, layout: TiraLayout): number {
  const moved = (s - HOLD_VH * layout.vh) * RATIO
  // 0 - x em vez de -x: na origem devolve +0, não -0
  return 0 - clamp(moved, 0, travel(layout))
}

/** `d`: distância do centro do painel ao centro da tela, em larguras de tela. */
export function panelOffset(panel: PanelBox, x: number, vw: number): number {
  return (panel.left + panel.width / 2 + x - vw / 2) / vw
}

/** 1 com o painel no centro, 0 a partir de 0,625 tela de distância. */
export function nearness(d: number): number {
  return clamp(1 - Math.abs(d) * 1.6)
}

/**
 * Quanto da evidência já foi revelada: o papel abre enquanto o painel
 * entra pela direita e fica aberto depois que passa do centro.
 */
export function reveal(d: number): number {
  return clamp((1.15 - d) / 0.6)
}

/** Deslocamento da câmera que põe o painel no centro (limitado à travessia). */
export function centeredX(panel: PanelBox, layout: TiraLayout): number {
  return clamp(panel.left + panel.width / 2 - layout.vw / 2, 0, travel(layout))
}

/** Scroll, dentro do pin, em que o painel `i` descansa no centro. */
export function restScroll(i: number, layout: TiraLayout): number {
  const panel = layout.panels[i]
  if (!panel) throw new RangeError(`painel inexistente: ${i}`)
  return HOLD_VH * layout.vh + centeredX(panel, layout) / RATIO
}

/** O painel mais perto do centro da tela para o deslocamento `x`. */
export function nearestPanel(x: number, layout: TiraLayout): number {
  let best = 0
  let bestD = Infinity
  layout.panels.forEach((panel, i) => {
    const d = Math.abs(panelOffset(panel, x, layout.vw))
    if (d < bestD) {
      bestD = d
      best = i
    }
  })
  return best
}

/**
 * Para onde a gravidade leva o scroll parado em `s`, ou null se já está
 * num descanso. Enquanto a câmera está parada no cartaz, qualquer ponto
 * é descanso: não existe "meio" para corrigir.
 */
export function settleTarget(s: number, layout: TiraLayout): number | null {
  if (s <= HOLD_VH * layout.vh + SETTLE_TOLERANCE) return null
  if (s >= pinLength(layout) - SETTLE_TOLERANCE) return null
  let target = s
  let best = Infinity
  layout.panels.forEach((_, i) => {
    const rest = restScroll(i, layout)
    const dist = Math.abs(rest - s)
    if (dist < best) {
      best = dist
      target = rest
    }
  })
  return best <= SETTLE_TOLERANCE ? null : target
}

/** Quanto a marca do painel no trilho já foi percorrida (0 a 1). */
export function railFill(panel: PanelBox, x: number, vw: number): number {
  return clamp((vw / 2 - (panel.left + x)) / panel.width)
}

/** Inclinação máxima do texto pela velocidade, em graus. */
export const SKEW_MAX = 4.5

/**
 * A velocidade vira matéria: o texto inclina no sentido contrário ao da
 * travessia, até SKEW_MAX graus. Velocidade em px de scroll por segundo.
 * (As folhas não usam isto: elas balançam pela física em folhaFisica.)
 */
export function velocitySkew(velocity: number): number {
  const skew = 0 - clamp(velocity / 1800, -1, 1) * SKEW_MAX
  return Math.abs(skew) < 0.01 ? 0 : skew
}
