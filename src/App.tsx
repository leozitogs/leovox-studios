import { useEffect } from 'react'
import { PersistentCanvas } from './canvas/PersistentCanvas'
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
      </main>
    </>
  )
}
