// O sistema que explicita erros: captura erro global, rejeicao de
// promise e console.error num barramento unico. O HUD (dev) assina
// aqui; em producao a captura segue silenciosa no buffer, pronta pra
// um endpoint futuro.

export interface CapturedError {
  kind: 'erro' | 'promise' | 'console'
  message: string
  detail?: string
  time: number
}

type Listener = (error: CapturedError) => void

const listeners = new Set<Listener>()
const buffer: CapturedError[] = []
const BUFFER_MAX = 30

let installed = false
let publishing = false

function publish(error: CapturedError): void {
  // um listener que erre nao pode realimentar o proprio barramento
  if (publishing) return
  publishing = true
  try {
    buffer.push(error)
    if (buffer.length > BUFFER_MAX) buffer.shift()
    listeners.forEach((listener) => listener(error))
  } finally {
    publishing = false
  }
}

export function captureErrors(): void {
  if (installed) return
  installed = true

  window.addEventListener('error', (event) => {
    publish({
      kind: 'erro',
      message: event.message || 'Erro desconhecido',
      detail: event.filename ? `${event.filename}:${event.lineno}` : undefined,
      time: Date.now(),
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason as { message?: string } | undefined
    publish({
      kind: 'promise',
      message: String(reason?.message ?? event.reason ?? 'Rejeicao sem motivo'),
      time: Date.now(),
    })
  })

  const original = console.error.bind(console)
  console.error = (...args: unknown[]) => {
    original(...args)
    publish({
      kind: 'console',
      message: args
        .map((a) => (a instanceof Error ? a.message : String(a)))
        .join(' ')
        .slice(0, 300),
      time: Date.now(),
    })
  }
}

export function onCapturedError(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getCapturedErrors(): readonly CapturedError[] {
  return buffer
}
