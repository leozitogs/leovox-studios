// O trilho de orientação, fixo na base enquanto a tira está pinada. Não
// repete o que a tela já diz (o nome da frente está na capa, o do
// trabalho na ficha): é só onde você está e pra onde pode ir.
// - no meio, a régua agrupada por frente: cada grupo abre com a âncora
//   da marca (CARA., PALCO., MOTOR.) como botão do capítulo, com o rolo
//   getquoti no hover, seguida de uma marca por trabalho;
// - à direita, o contador;
// - à esquerda, a dica de navegação, só na primeira capa.
// Tudo é botão real e focável; o hook liga os cliques, pinta as marcas e
// anuncia o painel corrente pra leitor de tela.

import { FRENTES, TIRA, TOTAL_TRABALHOS } from '../frentes'

export function Trilho() {
  return (
    <div className="tr-trilho">
      <p className="tr-dica" aria-hidden="true">
        <kbd>←</kbd>
        <kbd>→</kbd> ou role · puxe as folhas
      </p>

      <nav className="tr-regua" aria-label="Frentes e trabalhos da tira">
        {FRENTES.map((f) => (
          <div key={f.id} className="tr-regua-grupo" data-frente={f.id}>
            <button
              type="button"
              className="pl-nav-btn"
              data-goto={`capa-${f.id}`}
              aria-label={`Ir pra frente ${f.numero}, ${f.nome}`}
            >
              <span className="tr-cap-num" aria-hidden="true">
                {f.numero}
              </span>
              <span className="pl-rolo" aria-hidden="true">
                <span className="pl-rolo-l">{f.ancora}</span>
                <span className="pl-rolo-l">{f.ancora}</span>
              </span>
            </button>
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
          </div>
        ))}
      </nav>

      <p className="tr-atual">
        <span className="tr-contador" aria-hidden="true">
          <span className="tr-contador-n">00</span>
          <span className="tr-contador-total">/{String(TOTAL_TRABALHOS).padStart(2, '0')}</span>
        </span>
        <span className="tr-sr" aria-live="polite" />
      </p>
    </div>
  )
}
