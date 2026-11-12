// Capa de capítulo: uma folha off-white de papel rasgado colada sobre o
// palco escuro, com o número da frente, o nome e a âncora carimbada. O
// carimbo é gesto (estampa quando a capa liga); o resto obedece a `d`.

import type { FrenteInfo } from '../frentes'
import { rasgo } from '../rasgo'

type Props = { readonly frente: FrenteInfo; readonly semente: number }

export function Capa({ frente, semente }: Props) {
  return (
    <section
      className="pl-painel tr-capa"
      data-panel-kind="capa"
      data-panel-id={`capa-${frente.id}`}
      data-frente={frente.id}
      aria-labelledby={`tr-capa-${frente.id}`}
    >
      <div className="tr-capa-folha" style={{ clipPath: rasgo(semente) }}>
        <span className="tr-capa-num" aria-hidden="true">
          {frente.numero}
        </span>
        <p className="tr-capa-kicker">Frente {frente.numero} de 03</p>
        <h3 className="tr-capa-nome" id={`tr-capa-${frente.id}`}>
          {frente.nome}
        </h3>
        <p className="tr-capa-ancora">
          <span className="tr-carimbo">{frente.ancora}</span>
        </p>
      </div>
    </section>
  )
}
