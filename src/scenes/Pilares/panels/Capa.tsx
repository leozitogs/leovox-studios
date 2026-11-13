// Capa de capítulo: uma folha off-white de papel rasgado pendurada por
// uma fita sobre o palco escuro. Composição de cartaz: o número da
// frente em tinta cheia, grande o bastante pra vazar do papel, o nome
// no alto, um grafismo half-style da marca no meio e a âncora
// carimbada. A folha é solta: o cursor e a câmera a balançam (física
// em useFolhas); o carimbo é gesto e o resto obedece a `d`.

import type { FrenteInfo } from '../frentes'
import { rasgo } from '../rasgo'

type Props = { readonly frente: FrenteInfo; readonly semente: number }

// Um grafismo por frente, todos já carregados pelo cartaz da abertura.
const GRAFISMO: Record<FrenteInfo['id'], string> = {
  identidade: '/commons/star-half-style-1-green.svg',
  digital: '/commons/star-half-style-2-white.svg',
  tecnologia: '/commons/pixacao-half-style.svg',
}

export function Capa({ frente, semente }: Props) {
  return (
    <section
      className="pl-painel tr-capa"
      data-panel-kind="capa"
      data-panel-id={`capa-${frente.id}`}
      data-frente={frente.id}
      aria-labelledby={`tr-capa-${frente.id}`}
    >
      <div className="tr-capa-folha" data-folha="capa">
        <span className="tr-sombra" aria-hidden="true" />
        <div className="tr-capa-papel" style={{ clipPath: rasgo(semente) }}>
          <img
            className={`tr-capa-grafismo tr-capa-grafismo--${frente.id}`}
            src={GRAFISMO[frente.id]}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
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
        <span className="tr-fita tr-fita--capa" aria-hidden="true" />
      </div>
    </section>
  )
}
