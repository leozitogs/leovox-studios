// Um trabalho na tira: a evidência dominante num cartão de papel
// pendurado por fita, grande o bastante pra ser a peça da tela, e o
// nome numa etiqueta preta colada por cima da borda do cartão (lê sobre
// qualquer mídia). Sem parágrafo: se o trabalho precisa de texto pra se
// explicar, ainda não é a melhor evidência. Enquanto o trabalho real não
// chega, o cartão é um placeholder declarado (data-placeholder), nunca
// um case falso. O cartão é folha solta: cursor e câmera o balançam.

import type { CSSProperties } from 'react'
import type { FrenteInfo, Trabalho } from '../frentes'

type Props = {
  readonly frente: FrenteInfo
  readonly trabalho: Trabalho
  readonly ordem: string
  readonly indice: number
}

// Cada cartão pega um recorte diferente do scan de papel, pra tira não
// parecer o mesmo template repetido.
const RECORTES = ['12% 18%', '78% 64%', '34% 88%', '91% 9%', '55% 41%', '8% 72%']

export function TrabalhoPainel({ frente, trabalho, ordem, indice }: Props) {
  const placeholder = !trabalho.midia
  const tituloId = `tr-titulo-${trabalho.id}`
  const papel = {
    '--papel-pos': RECORTES[indice % RECORTES.length],
    '--papel-giro': indice % 2 === 0 ? '1' : '-1',
  } as CSSProperties

  return (
    <article
      className={`pl-painel tr-trabalho tr-trabalho--${trabalho.formato}`}
      data-panel-kind="trabalho"
      data-panel-id={trabalho.id}
      data-frente={frente.id}
      data-trabalho={trabalho.id}
      data-placeholder={placeholder ? 'true' : 'false'}
      aria-labelledby={tituloId}
      style={papel}
    >
      {/* marca d'água da frente: tinta cheia quase do tom do palco, sem
          contorno, só no primeiro trabalho (duas vizinhas se sobreporiam) */}
      {ordem.endsWith('.1') ? (
        <span className="tr-fantasma" aria-hidden="true">
          {frente.ancora}
        </span>
      ) : null}

      <figure className="tr-cartao" data-folha="cartao">
        <span className="tr-sombra" aria-hidden="true" />
        <div className="tr-midia">
          {trabalho.midia?.kind === 'video' ? (
            <video
              src={trabalho.midia.src}
              poster={trabalho.midia.poster}
              muted
              loop
              playsInline
              preload="none"
              aria-label={trabalho.midia.alt}
            />
          ) : trabalho.midia ? (
            <img
              src={trabalho.midia.src}
              alt={trabalho.midia.alt}
              loading="lazy"
              draggable={false}
            />
          ) : (
            <div className="tr-ph" aria-hidden="true">
              <span className="tr-ph-ancora">{frente.ancora}</span>
            </div>
          )}
        </div>
        <span className="tr-fita tr-fita--a" aria-hidden="true" />
        <span className="tr-fita tr-fita--b" aria-hidden="true" />
        {placeholder ? (
          <figcaption className="tr-ph-legenda">
            Placeholder · {trabalho.formato === 'paisagem' ? '16:10' : '4:5'} · trabalho real entra
            aqui
          </figcaption>
        ) : null}
      </figure>

      {/* a etiqueta cruza a borda de baixo do cartão; ordem, tipo e ano
          ficam embaixo, no escuro, e a anotação à mão ao lado */}
      <div className="tr-info">
        <h4 className="tr-titulo" id={tituloId}>
          <span className="tr-etiqueta">{trabalho.titulo}</span>
        </h4>
        <div className="tr-linha">
          <p className="tr-tipo">
            <span className="tr-ordem">{ordem}</span> {trabalho.tipo} · {trabalho.ano}
          </p>
          {trabalho.anotacao ? <p className="tr-anotacao">{trabalho.anotacao}</p> : null}
        </div>
      </div>
    </article>
  )
}
