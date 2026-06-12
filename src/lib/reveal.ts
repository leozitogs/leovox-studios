// Barramento da abertura: o loader dispara o reveal quando a tela
// oficial assenta; quem precisa reagir (entrada do hero, Lenis) escuta
// por aqui, sem acoplamento entre componentes.

export const REVEAL_EVENT = 'leovox:reveal'

export function dispatchReveal(): void {
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT))
}

export function onReveal(callback: () => void): () => void {
  window.addEventListener(REVEAL_EVENT, callback, { once: true })
  return () => window.removeEventListener(REVEAL_EVENT, callback)
}
