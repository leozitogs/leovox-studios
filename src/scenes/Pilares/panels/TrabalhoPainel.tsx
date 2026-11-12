// Um trabalho na tira: a evidência dominante num cartão de papel colado
// com fita, e ao lado o número, o nome, o tipo e uma anotação à mão.
// Sem parágrafo: se o trabalho precisa de texto pra se explicar, ainda
// não é a melhor evidência. Enquanto o trabalho real não chega, o cartão
// é um placeholder declarado (data-placeholder), nunca um case falso.

import type { FrenteInfo, Trabalho } from '../frentes'

type Props = {
  readonly frente: FrenteInfo
  readonly trabalho: Trabalho
  readonly ordem: string
}

export function TrabalhoPainel({ frente, trabalho, ordem }: Props) {
  const placeholder = !trabalho.midia
  const tituloId = `tr-titulo-${trabalho.id}`

  return (
    <article
      className={`pl-painel tr-trabalho tr-trabalho--${trabalho.formato}`}
      data-panel-kind="trabalho"
      data-panel-id={trabalho.id}
      data-frente={frente.id}
      data-trabalho={trabalho.id}
      data-placeholder={placeholder ? 'true' : 'false'}
      aria-labelledby={tituloId}
    >
      {/* a âncora fantasma só no primeiro trabalho da frente: duas
          vizinhas se sobreporiam no fundo */}
      {ordem.endsWith('.1') ? (
        <span className="tr-fantasma" aria-hidden="true">
          {frente.ancora}
        </span>
      ) : null}

      <div className="tr-info">
        <p className="tr-ordem">
          {ordem} · {frente.nome}
        </p>
        <h4 className="tr-titulo" id={tituloId}>
          {trabalho.titulo}
        </h4>
        <p className="tr-tipo">
          {trabalho.tipo} · {trabalho.ano}
        </p>
        {trabalho.anotacao ? <p className="tr-anotacao">{trabalho.anotacao}</p> : null}
      </div>

      <figure className="tr-cartao">
        <span className="tr-fita tr-fita--a" aria-hidden="true" />
        <span className="tr-fita tr-fita--b" aria-hidden="true" />
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
            <img src={trabalho.midia.src} alt={trabalho.midia.alt} loading="lazy" />
          ) : (
            <div className="tr-ph" aria-hidden="true">
              <span className="tr-ph-ancora">{frente.ancora}</span>
            </div>
          )}
        </div>
        {placeholder ? (
          <figcaption className="tr-ph-legenda">
            Placeholder · {trabalho.formato === 'paisagem' ? '16:10' : '4:5'} · trabalho real entra
            aqui
          </figcaption>
        ) : null}
      </figure>
    </article>
  )
}
