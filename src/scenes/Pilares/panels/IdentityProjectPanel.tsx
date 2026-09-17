import { useState } from 'react'
import type { FrenteInfo } from '../frentes'
import { ProjectAsset } from './ProjectAsset'
import { ProjectIntro } from './ProjectIntro'

export function IdentityProjectPanel({ frente }: { frente: FrenteInfo }) {
  const [showSystem, setShowSystem] = useState(false)

  return (
    <section
      className="pl-painel pl-quadro pl-project pl-project--identity"
      aria-label={`${frente.numero} · ${frente.nome}`}
      data-project-placeholder="true"
    >
      <span className="pl-project-anchor" aria-hidden="true">
        {frente.ancora}
      </span>
      <ProjectIntro frente={frente} />

      <div className="pl-project-stage pl-identity-stage" data-project-stage>
        <div className="pl-identity-grid" aria-hidden="true" />
        <div className={`pl-identity-board ${showSystem ? 'is-system' : ''}`} data-reveal="hero">
          <ProjectAsset asset={frente.assets.hero!} className="pl-identity-hero">
            <span className="pl-placeholder-poster" aria-hidden="true">
              <small>{showSystem ? 'CONSTRUÇÃO' : 'RESULTADO'}</small>
              <strong>
                KEY
                <br />
                VISUAL
              </strong>
              <i>DO PROJETO</i>
            </span>
          </ProjectAsset>
          <button
            type="button"
            className="pl-view-switch"
            aria-pressed={showSystem}
            onClick={() => setShowSystem((value) => !value)}
          >
            {showSystem ? 'VER RESULTADO' : 'VER CONSTRUÇÃO'}
          </button>
        </div>

        <ProjectAsset asset={frente.assets.mark!} className="pl-identity-mark" reveal="detail">
          <span className="pl-placeholder-mark" aria-hidden="true">
            Aa
          </span>
        </ProjectAsset>
        <ProjectAsset
          asset={frente.assets.applicationOne!}
          className="pl-identity-app pl-identity-app--one"
        >
          <span className="pl-placeholder-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </ProjectAsset>
        <ProjectAsset
          asset={frente.assets.applicationTwo!}
          className="pl-identity-app pl-identity-app--two"
        >
          <span className="pl-placeholder-ring" aria-hidden="true" />
        </ProjectAsset>
      </div>
    </section>
  )
}
