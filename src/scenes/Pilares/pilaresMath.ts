// A matematica pura da cena Pilares, isolada pra ser testavel: a rampa
// de luz da chegada e a travessia horizontal por gatilho. O motor e o
// mesmo do manifesto original (limiar com banda morta e gravidade de
// descanso, decisoes 35 e 47), rotacionado pra horizontal como pede o
// briefing da cena. O hook so orquestra; quem decide e isto aqui.

// Duracao virtual da cena: t = progress * D dentro do pin.
export const D = 11.6

// A luz se apagando na chegada: o palco herda o off-white em que o
// manifesto termina e escurece ate o #222222 da tira. A cor e funcao
// pura do progresso (lei 2), pintada pelo hook via luzAt.
export const LUZ_FIM = 1.6

// O cartaz-titulo assembla quando a luz ja caiu o bastante pro branco
// do lockup ter contraste. Voltar pra tras do limiar desarma a entrada
// e a coreografia reexecuta na proxima descida.
export const TITULO_ON = 1.15

// Beats da tira: cartaz + 3 quadros de frente.
export const BEATS = 4

// Limiares de troca de beat e a banda morta contra tremor na
// fronteira: dentro dela, nada muda.
export const SWAPS = [3.4, 5.8, 8.2]
export const DEADBAND = 0.22

// Onde a gravidade assenta o scroll parado: o descanso de cada beat.
export const REST_BY_BEAT = [2.4, 4.6, 7, 9.4]

/** Quanto da luz ja caiu em t: 0 e off-white, 1 e o #222222 da tira. */
export function luzAt(t: number): number {
  if (t <= 0) return 0
  if (t >= LUZ_FIM) return 1
  return t / LUZ_FIM
}

/**
 * Qual beat o tempo t pede, partindo do beat corrente e respeitando a
 * banda morta: dentro dela, nada muda (sem tremor na fronteira).
 */
export function desiredBeat(current: number, t: number): number {
  let k = current
  while (k < SWAPS.length && t > SWAPS[k] + DEADBAND) k += 1
  while (k > 0 && t < SWAPS[k - 1] - DEADBAND) k -= 1
  return k
}

/**
 * Onde a gravidade assenta o scroll parado. Na rampa de luz o unico
 * pouso honesto e o comeco: meia-luz nao e lugar de descanso.
 */
export function restFor(current: number, t: number): number {
  if (current === 0 && t < 0.8) return 0
  return REST_BY_BEAT[current]
}

/**
 * O deslocamento do trilho por beat, em xPercent do proprio trilho
 * (BEATS paineis de largura igual): mesmo valor em qualquer largura
 * de tela.
 */
export function trackXPercent(beat: number): number {
  // 0 - x em vez de -x: beat 0 devolve +0, nao -0
  return 0 - beat * (100 / BEATS)
}
