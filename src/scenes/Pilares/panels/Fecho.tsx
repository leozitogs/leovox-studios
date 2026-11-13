// O fecho da tira: a headline assume o quadro em verde chapado com
// letra preta (a mesma inversão do ato 3 do manifesto, decisão 38) e o
// despine leva direto à próxima cena. Nada de vão escuro no fim.

import { rasgo } from '../rasgo'

export function Fecho() {
  return (
    <footer className="pl-painel tr-fecho" data-panel-kind="fecho" data-panel-id="fecho">
      <div className="tr-fecho-folha" style={{ clipPath: rasgo(73, 40, 1.6) }}>
        <p className="tr-fecho-kicker">Identidade · Presença · Tecnologia</p>
        <p className="tr-fecho-titulo">
          <span>Um</span> <span>ecossistema.</span>
        </p>
        <p className="tr-fecho-sub">Três frentes integradas.</p>
      </div>
    </footer>
  )
}
