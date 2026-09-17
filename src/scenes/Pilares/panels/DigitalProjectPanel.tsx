import { type CSSProperties, useState } from 'react'
import type { FrenteInfo } from '../frentes'
import { ProjectAsset } from './ProjectAsset'
import { ProjectIntro } from './ProjectIntro'

const FORMATS = ['9:16', '1:1', '16:9'] as const

export function DigitalProjectPanel({ frente }: { frente: FrenteInfo }) {
  const [activeFormat, setActiveFormat] = useState(0)
  const assets = [frente.assets.vertical!, frente.assets.square!, frente.assets.landscape!]

  return (
    <section
      className="pl-painel pl-quadro pl-project pl-project--digital"
      aria-label={`${frente.numero} · ${frente.nome}`}
      data-project-placeholder="true"
    >
      <span className="pl-project-anchor" aria-hidden="true">
        {frente.ancora}
      </span>
      <ProjectIntro frente={frente} />

      <div className="pl-project-stage pl-digital-stage" data-project-stage>
        <div className="pl-format-stack" data-reveal="hero">
          {assets.map((asset, index) => (
            <ProjectAsset
              key={asset.request}
              asset={asset}
              className={`pl-format pl-format--${index} ${activeFormat === index ? 'is-active' : ''}`}
            >
              <span className="pl-placeholder-media" aria-hidden="true">
                <small>FRAME {String(index + 1).padStart(2, '0')}</small>
                <strong>{index === 0 ? 'REEL' : index === 1 ? 'POST' : 'FILME'}</strong>
                <i>PROJETO REAL</i>
              </span>
            </ProjectAsset>
          ))}
        </div>

        <div className="pl-format-controls" role="group" aria-label="Prévia dos formatos">
          {FORMATS.map((format, index) => (
            <button
              key={format}
              type="button"
              className={activeFormat === index ? 'is-active' : ''}
              aria-pressed={activeFormat === index}
              onClick={() => setActiveFormat(index)}
            >
              {format}
            </button>
          ))}
        </div>

        <div className="pl-playhead" aria-hidden="true">
          <span style={{ '--frame': activeFormat } as CSSProperties} />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </section>
  )
}
