import { useEffect } from 'react'
import { PersistentCanvas } from './canvas/PersistentCanvas'
import { destroyLenis, initLenis } from './lib/lenis'

// Placeholder do Entregável 1: valida que o projeto sobe.
// A partir da Cena 1, o <main> passa a montar as cenas em scroll contínuo.
export default function App() {
  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  return (
    <>
      <PersistentCanvas />
      <main className="placeholder-stage">
        <h1 className="placeholder-title">Sem Corte</h1>
      </main>
    </>
  )
}
