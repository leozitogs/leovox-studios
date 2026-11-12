// O trilho de orientação, fixo na base enquanto a tira está pinada:
// capítulos à esquerda (rolo getquoti aprovado na v3), uma régua com uma
// marca por trabalho no meio e, à direita, o contador e o nome do
// trabalho ativo, que troca por carimbo. Tudo é botão real e focável;
// o hook liga os cliques e pinta o preenchimento das marcas.

import { FRENTES, TIRA, TOTAL_TRABALHOS } from '../frentes'

export function Trilho() {
  return (
    <div className="tr-trilho">
      <nav className="tr-capitulos" aria-label="Capítulos das frentes">
        {FRENTES.map((f) => (
          <button
            key={f.id}
            type="button"
            className="pl-nav-btn"
            data-goto={`capa-${f.id}`}
            aria-label={`Ir pra frente ${f.numero}, ${f.nome}`}
          >
            <span className="pl-rolo" aria-hidden="true">
              <span className="pl-rolo-l">{f.numero}</span>
              <span className="pl-rolo-l">{f.numero}</span>
            </span>
          </button>
        ))}
        <span className="tr-capitulo-nome" aria-hidden="true" />
      </nav>

      <nav className="tr-regua" aria-label="Trabalhos da tira">
        {FRENTES.map((f) => (
          <span key={f.id} className="tr-regua-grupo">
            {TIRA.map((p) =>
              p.kind === 'trabalho' && p.frente.id === f.id ? (
                <button
                  key={p.id}
                  type="button"
                  className="tr-tick"
                  data-goto={p.id}
                  aria-label={`Ir pra ${p.trabalho.titulo}`}
                />
              ) : null,
            )}
          </span>
        ))}
      </nav>

      <p className="tr-atual" aria-live="polite">
        <span className="tr-contador">
          <span className="tr-contador-n">00</span>/{String(TOTAL_TRABALHOS).padStart(2, '0')}
        </span>
        <span className="tr-nome" />
      </p>
    </div>
  )
}
