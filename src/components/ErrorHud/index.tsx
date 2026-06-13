// HUD de erros, so em dev: errou em qualquer lugar, aparece um toast
// preto de borda verde no canto contando o que e onde, sem precisar
// abrir o devtools. Assina o barramento de src/lib/errors.ts.

import { useEffect, useState } from 'react'
import { onCapturedError, type CapturedError } from '../../lib/errors'
import './errorhud.css'

const TOAST_MS = 9000
const MAX_VISIVEIS = 4

interface Toast extends CapturedError {
  id: number
}

let nextId = 1

export function ErrorHud() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    return onCapturedError((error) => {
      const toast: Toast = { ...error, id: nextId }
      nextId += 1
      setToasts((current) => [...current.slice(-(MAX_VISIVEIS - 1)), toast])
      window.setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== toast.id))
      }, TOAST_MS)
    })
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="error-hud" role="alert" aria-live="assertive">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          className="error-toast"
          onClick={() => setToasts((current) => current.filter((t) => t.id !== toast.id))}
        >
          <span className="error-kind">{toast.kind}</span>
          <span className="error-message">{toast.message}</span>
          {toast.detail ? <span className="error-detail">{toast.detail}</span> : null}
        </button>
      ))}
    </div>
  )
}
