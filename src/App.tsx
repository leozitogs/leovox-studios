import { useEffect } from 'react'
import { PersistentCanvas } from './canvas/PersistentCanvas'
import { Header } from './components/Header'
import { destroyLenis, initLenis } from './lib/lenis'
import { Hero } from './scenes/Hero'
import { Manifesto } from './scenes/Manifesto'

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
        <Manifesto />
        {/* Destino provisório do scroll: vira a Cena 3 (Pilares) */}
        <section className="scene-spacer" aria-hidden="true" />
      </main>
      <Header />
    </>
  )
}
