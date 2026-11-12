// Cena 3 · Pilares · "A tira" (briefing v4, 2026-11-12).
// A luz cai do off-white do manifesto pro palco escuro, o cartaz PILARES
// DA LEOVOX assembla e o scroll vira uma câmera que percorre a tira de
// trabalhos: capa de cada frente, os trabalhos dela e o fecho. A câmera
// é scrubada; parou, a gravidade assenta no painel mais próximo.

import { useRef } from 'react'
import { TIRA } from './frentes'
import { Capa } from './panels/Capa'
import { Cartaz } from './panels/Cartaz'
import { Fecho } from './panels/Fecho'
import { TrabalhoPainel } from './panels/TrabalhoPainel'
import { Trilho } from './panels/Trilho'
import { useFolhas } from './useFolhas'
import { useTira } from './useTira'
import './pilares.css'

export function Pilares() {
  const sectionRef = useRef<HTMLElement>(null)
  useTira(sectionRef)
  useFolhas(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="pilares"
      aria-label="Pilares da Leovox"
      data-harness-scene="pilares"
    >
      {/* o papel entra junto com a luz caindo: opacidade e cor de fundo
          são função pura do progresso, pintadas pelo hook */}
      <div className="pl-textura" aria-hidden="true" />

      <div className="pl-track">
        {TIRA.map((painel, i) => {
          switch (painel.kind) {
            case 'cartaz':
              return <Cartaz key={painel.id} />
            case 'capa':
              return <Capa key={painel.id} frente={painel.frente} semente={17 + i * 31} />
            case 'trabalho':
              return (
                <TrabalhoPainel
                  key={painel.id}
                  frente={painel.frente}
                  trabalho={painel.trabalho}
                  ordem={painel.ordem}
                  indice={painel.indice}
                />
              )
            case 'fecho':
              return <Fecho key={painel.id} />
          }
        })}
      </div>

      <Trilho />
    </section>
  )
}
