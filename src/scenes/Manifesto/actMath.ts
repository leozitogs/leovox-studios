// A matematica pura do manifesto, isolada pra ser testavel de verdade:
// limiares com banda morta, gravidade de descanso e as tabelas de luz.
// O hook (useManifestoScroll) so orquestra; quem decide e isto aqui.

export const D = 13.2 // duracao virtual da cena
export const SWAPS = [3.6, 7.2, 11.2] // limiares de troca de ato
export const REST_BY_ACT = [1.8, 5.4, 9.2, 13.2] // descanso de cada ato
export const DEADBAND = 0.22 // banda morta em volta do limiar, contra tremor

export const ACT_BG = ['#fbfbfb', '#222222', '#19bc00', '#222222']
export const ACT_LINE = [
  'rgba(0, 0, 0, 0.1)',
  'rgba(251, 251, 251, 0.09)',
  'rgba(0, 0, 0, 0.16)',
  'rgba(251, 251, 251, 0.09)',
]

// Qual ato o tempo t pede, partindo do ato corrente e respeitando a
// banda morta: dentro dela, nada muda (sem tremor na fronteira).
export function desiredAct(current: number, t: number): number {
  let k = current
  while (k < SWAPS.length && t > SWAPS[k] + DEADBAND) k += 1
  while (k > 0 && t < SWAPS[k - 1] - DEADBAND) k -= 1
  return k
}

// Onde a gravidade assenta o scroll parado: no descanso do ato
// corrente. O ato 1 tem dois pousos validos (o topo e o miolo).
export function restFor(current: number, t: number): number {
  if (current === 0 && t < 0.9) return 0
  return REST_BY_ACT[current]
}
