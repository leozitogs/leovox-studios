import { useEffect, useRef } from 'react'
import { PersistentCanvas } from './canvas/PersistentCanvas'
import { Header } from './components/Header'
import { ErrorHud } from './components/ErrorHud'
import { Loader } from './components/Loader'
import { destroyLenis, initLenis, stopLenis } from './lib/lenis'
import { Hero } from './scenes/Hero'
import { Manifesto } from './scenes/Manifesto'

export default function App() {
  // O site inteiro vive na .site: e ela que sobe como folha na
  // abertura. O Lenis nasce travado; o loader destrava no reveal.
  const siteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initLenis()
    stopLenis()
    return () => destroyLenis()
  }, [])

  return (
    <>
      {import.meta.env.DEV ? <ErrorHud /> : null}
      <Loader siteRef={siteRef} />
      <div ref={siteRef} className="site">
        <PersistentCanvas />
        <main>
          <Hero />
          <Manifesto />
          {/* Destino provisório do scroll: vira a Cena 3 (Pilares) */}
          <section className="scene-spacer" aria-hidden="true" />
        </main>
        <Header />
      </div>
    </>
  )
}
