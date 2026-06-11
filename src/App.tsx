import { useEffect } from 'react'
import { PersistentCanvas } from './canvas/PersistentCanvas'
import { Header } from './components/Header'
import { destroyLenis, initLenis } from './lib/lenis'
import { Hero } from './scenes/Hero'

export default function App() {
  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  return (
    <>
      <PersistentCanvas />
      <main>
        <Hero />
        {/* Destino provisório do scroll: vira a Cena 2 (Manifesto) */}
        <section className="scene-spacer" aria-hidden="true" />
      </main>
      <Header />
    </>
  )
}
