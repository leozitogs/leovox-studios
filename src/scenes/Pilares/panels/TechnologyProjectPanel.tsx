import { useState } from 'react'
import type { FrenteInfo } from '../frentes'
import { ProjectAsset } from './ProjectAsset'
import { ProjectIntro } from './ProjectIntro'

const FLOW = ['ENTRADA', 'PROCESSO', 'ENTREGA'] as const

export function TechnologyProjectPanel({ frente }: { frente: FrenteInfo }) {
  const [running, setRunning] = useState(false)

  return (
    <section
      className={`pl-painel pl-quadro pl-project pl-project--technology ${running ? 'is-running' : ''}`}
      aria-label={`${frente.numero} · ${frente.nome}`}
      data-project-placeholder="true"
    >
      <span className="pl-project-anchor" aria-hidden="true">
        {frente.ancora}
      </span>
      <ProjectIntro frente={frente} />

      <div className="pl-project-stage pl-tech-stage" data-project-stage>
        <div className="pl-tech-flow" aria-label="Fluxo demonstrativo" data-reveal="flow">
          {FLOW.map((step, index) => (
            <div className="pl-tech-node" key={step} data-step={index + 1}>
              <span>0{index + 1}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>

        <ProjectAsset asset={frente.assets.desktop!} className="pl-tech-desktop" reveal="hero">
          <span className="pl-browser-placeholder" aria-hidden="true">
            <i />
            <i />
            <i />
            <strong>
              INTERFACE
              <br />
              DO PROJETO
            </strong>
            <small>{running ? 'FLUXO CONCLUÍDO' : 'PRONTA PARA O ASSET'}</small>
          </span>
        </ProjectAsset>
        <ProjectAsset asset={frente.assets.mobile!} className="pl-tech-mobile">
          <span className="pl-mobile-placeholder" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </ProjectAsset>
        <ProjectAsset asset={frente.assets.recording!} className="pl-tech-recording">
          <span className="pl-recording-placeholder" aria-hidden="true">
            <i>▶</i>
            <strong>DEMO</strong>
          </span>
        </ProjectAsset>

        <button
          type="button"
          className="pl-run-flow"
          aria-pressed={running}
          onClick={() => setRunning((value) => !value)}
        >
          <span>{running ? 'REINICIAR FLUXO' : 'RODAR FLUXO'}</span>
          <i aria-hidden="true">→</i>
        </button>
      </div>
    </section>
  )
}
