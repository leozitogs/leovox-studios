// Cena 3 · Pilares · A tira horizontal.
// A abertura e o cartaz PILARES DA LEOVOX aprovado pelo PO (mockup de
// 2026-08-15): palco #222222 com papel amassado, grafismos half-style
// sangrando pela borda esquerda, o lockup tipografico e o personagem
// de contorno verde. A luz cai do off-white do manifesto pro palco
// escuro na chegada; depois do cartaz o scroll vira travessia lateral
// pelos 3 quadros das frentes (briefing v3 da cena). Os quadros estao
// em placeholder aprovado (numero, frente e palavra-ancora) ate a
// producao de assets do PO chegar: linha-cara, evidencias e poses do
// mascote entram nas proximas passadas.

import { useRef } from 'react'
import { FRENTES } from './frentes'
import { usePilaresScroll } from './usePilaresScroll'
import './pilares.css'

export function Pilares() {
  const sectionRef = useRef<HTMLElement>(null)
  usePilaresScroll(sectionRef)

  return (
    <section ref={sectionRef} className="pilares" aria-label="Pilares da Leovox">
      {/* o papel entra junto com a luz caindo: opacidade e cor de fundo
          sao funcao pura do progresso, pintadas pelo hook */}
      <div className="pl-textura" aria-hidden="true" />

      <div className="pl-track">
        {/* Beat 0 · o cartaz-titulo */}
        <header className="pl-painel pl-abertura">
          <div className="pl-cartaz">
            {/* width/height declarados: sem a proporcao intrinseca a
              caixa colapsa em altura zero e o loading lazy nunca ve o
              elemento entrar no viewport (bug provado em browser) */}
            <div className="pl-marks" aria-hidden="true">
              <img
                className="pl-mark pl-mark-star-verde"
                src="/commons/star-half-style-1-green.svg"
                alt=""
                width={1440}
                height={810}
                loading="lazy"
              />
              <img
                className="pl-mark pl-mark-star-branca"
                src="/commons/star-half-style-2-white.svg"
                alt=""
                width={810}
                height={1013}
                loading="lazy"
              />
              <img
                className="pl-mark pl-mark-seta"
                src="/commons/seta-half-style.svg"
                alt=""
                width={1440}
                height={810}
                loading="lazy"
              />
              <img
                className="pl-mark pl-mark-pixacao"
                src="/commons/pixacao-half-style.svg"
                alt=""
                width={810}
                height={1013}
                loading="lazy"
              />
            </div>
            <h2 className="pl-lockup">
              <img
                src="/branding/typography/pilares-da-leovox-txt.svg"
                alt="Pilares da Leovox"
                width={1440}
                height={810}
                loading="lazy"
              />
            </h2>
            <img
              className="pl-personagem"
              src="/branding/mascot/mascot-full-body/leovox-personagem-pilares.svg"
              alt=""
              width={1440}
              height={810}
              loading="lazy"
            />
          </div>
        </header>

        {/* Beats 1 a 3 · um quadro por frente, placeholder do briefing */}
        {FRENTES.map((f) => (
          <section
            key={f.id}
            className="pl-painel pl-quadro"
            aria-label={`${f.numero} · ${f.nome}`}
          >
            <span className="pl-q-numero" aria-hidden="true">
              {f.numero}
            </span>
            <h3 className="pl-q-ancora">{f.ancora}</h3>
            <p className="pl-q-frente">{f.nome}</p>
            {f.complemento ? <p className="pl-q-complemento">{f.complemento}</p> : null}
          </section>
        ))}
      </div>

      {/* o carimbo que segura o argumento durante os quadros */}
      <p className="pl-carimbo">UM ECOSSISTEMA.</p>

      {/* navegacao por capitulos, com o rolo de texto da referencia
          getquoti (duas copias empilhadas, overflow escondido) */}
      <nav className="pl-nav" aria-label="Capítulos das frentes">
        {FRENTES.map((f) => (
          <button
            key={f.id}
            type="button"
            className="pl-nav-btn"
            aria-label={`Ir pra frente ${f.numero}, ${f.nome}`}
          >
            <span className="pl-rolo" aria-hidden="true">
              <span className="pl-rolo-l">{f.numero}</span>
              <span className="pl-rolo-l">{f.numero}</span>
            </span>
          </button>
        ))}
      </nav>
    </section>
  )
}
