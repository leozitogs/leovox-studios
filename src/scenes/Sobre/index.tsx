// Cena 7 · Sobre · O making-of (decisões 77 a 79).
// A trajetória como prova da tese, não como biografia. A folha off-white
// sobe por cima do fecho verde dos Pilares, com os cantos arredondados e
// duas fitas cruzadas na borda (o negativo e a fita do set). Dentro dela:
// a folha de contato, em que cada tira se revela do papel ao halftone e a
// mesma mão que assina o hero circula o take que vale; a tese em pessoa;
// o elenco secando no varal; e os créditos, que passam a vez ao contato.

import { type CSSProperties, useRef } from 'react'
import {
  CREDITOS,
  ELENCO,
  FITA_NEGATIVO,
  FITA_SET,
  SETAS_DO_RETRATO,
  TIRAS,
  type Tira,
} from './conteudo'
import { useSobre } from './useSobre'
import './sobre.css'

// o círculo à mão: uma volta e um pouco, com o tremor de quem desenha
// rápido e a ponta passando do começo (o lápis de cera da folha de contato)
const CIRCULO = (() => {
  let d = ''
  for (let s = 0; s <= 1.1; s += 0.02) {
    const a = -2.3 + s * Math.PI * 2
    const w = 1 + Math.sin(s * 8) * 0.03
    const x = 50 + Math.cos(a) * 46 * w
    const y = 50 + Math.sin(a) * 47 * w + s * 4
    d += `${d ? ' L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
})()

function Fita({ tipo, termos }: { tipo: 'negativo' | 'set'; termos: readonly string[] }) {
  return (
    <div className={`sv-fita sv-fita--${tipo}`} data-dir={tipo === 'negativo' ? -1 : 1}>
      <div className="sv-fita-trilho">
        <span className="sv-fita-jogo">
          {termos.map((t) => (
            <span key={t}>
              <b>{t}</b>
              <i />
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

function TiraDeContato({ tira }: { tira: Tira }) {
  const lado = tira.escolhido === 2 ? 'esq' : 'dir'
  const primeiro = Number(/(\d+)A/.exec(tira.codigo)?.[1] ?? 0)
  return (
    <li className="sv-tira" data-ano={tira.ano}>
      <span className="sv-tira-cod" aria-hidden="true">
        {tira.codigo}
      </span>
      <p className="sv-prova-texto">
        <strong>{tira.ano}.</strong> {tira.prova}
      </p>
      <div className="sv-negativo">
        {tira.fotogramas.map((f, i) => {
          const escolhido = i === tira.escolhido
          return (
            <figure
              key={f.recorte}
              className={`sv-take${escolhido ? ' is-escolhido' : ''}`}
              data-placeholder="true"
            >
              <div className="sv-quadro">
                <div
                  className="sv-foto"
                  role="img"
                  aria-label={f.alt}
                  style={{ backgroundPosition: f.recorte }}
                />
                <div className="sv-papel-foto" aria-hidden="true" />
                <span className="sv-quadro-num" aria-hidden="true">
                  {String(primeiro + i).padStart(2, '0')}
                  {i === 0 ? 'A' : ''}
                </span>
              </div>
              {escolhido ? (
                <>
                  <svg
                    className="sv-circulo"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path pathLength={1} d={CIRCULO} />
                  </svg>
                  <figcaption className={`sv-nota sv-nota--${lado}`}>
                    <svg className="sv-seta" viewBox="0 0 120 80" aria-hidden="true">
                      <path
                        pathLength={1}
                        d="M114 6 C 74 6, 30 26, 8 70 M8 70 l 4 -22 M8 70 l 20 -9"
                      />
                    </svg>
                    <span>{tira.nota}</span>
                  </figcaption>
                </>
              ) : null}
            </figure>
          )
        })}
      </div>
      <span className="sv-tira-ano" aria-hidden="true">
        {tira.ano}
      </span>
    </li>
  )
}

export function Sobre() {
  const sectionRef = useRef<HTMLElement>(null)
  useSobre(sectionRef)

  return (
    <section
      ref={sectionRef}
      className="sobre"
      data-harness-scene="sobre"
      aria-labelledby="sobre-titulo"
    >
      <div className="sv-fitas" aria-hidden="true">
        <Fita tipo="negativo" termos={FITA_NEGATIVO} />
        <Fita tipo="set" termos={FITA_SET} />
      </div>

      <header className="sv-abre">
        <div>
          <p className="sv-rot">
            <b>(07)</b> Making-of
          </p>
          <h2 id="sobre-titulo" className="sv-titulo">
            Como a Leovox
            <br />
            foi feita.
          </h2>
        </div>
        <p className="sv-abre-texto">
          A trajetória como prova, não como biografia. Cada take que entra precisa provar o mesmo:
          criativo e técnico ao mesmo tempo. A mão que assina o começo do filme circula o take que
          vale.
        </p>
      </header>

      <div className="sv-folha">
        <div className="sv-folha-cab" aria-hidden="true">
          <span>Folha de contato · Leovox 400</span>
          <span>
            {TIRAS.length} tiras · {TIRAS.length * 3} takes
          </span>
        </div>
        <ol className="sv-tiras">
          {TIRAS.map((t) => (
            <TiraDeContato key={t.ano} tira={t} />
          ))}
        </ol>
        <p className="sv-ph-legenda">Placeholder · as fotos reais entram aqui</p>
      </div>

      <div className="sv-tese">
        <h3 className="sv-tese-frase">
          Designer que
          <br />
          programa.
          <br />
          Engenheiro que
          <br />
          <span className="sv-sublinha">
            desenha.
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
              <path pathLength={1} d="M1 6 C 20 3, 45 8, 70 4 S 92 5, 99 3" />
            </svg>
          </span>
        </h3>
        <figure className="sv-retrato" data-placeholder="true">
          <img
            src="/branding/mascot/mascot-full-body/mascot-hero-fallback.png"
            alt="Placeholder do retrato do fundador"
            draggable={false}
          />
          <figcaption className="sv-ficha">
            <span>Fundador · file 01/02</span>
            <span>Recife, BR</span>
          </figcaption>
          <ul className="sv-setas">
            {SETAS_DO_RETRATO.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </figure>
      </div>

      <div className="sv-varal">
        <p className="sv-rot">
          <b>Elenco</b> · as provas secando
        </p>
        <svg className="sv-fio" preserveAspectRatio="none" viewBox="0 0 100 20" aria-hidden="true">
          <path className="sv-fio-linha" d="M0 2 Q 50 12 100 2" />
        </svg>
        <ul className="sv-provas">
          {ELENCO.map((p, i) => (
            <li
              key={p.numero}
              className={`sv-prova${p.convite ? ' is-convite' : ''}`}
              data-placeholder="true"
              style={{ '--i': i } as CSSProperties}
            >
              <i className="sv-pregador" aria-hidden="true" />
              <div className="sv-prova-foto" role="img" aria-label={`Placeholder: ${p.rotulo}`} />
              <span className="sv-prova-rot">
                <span>{p.rotulo}</span>
                <span>{p.numero}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="sv-creditos">
        {CREDITOS.map(([funcao, nome]) => (
          <div key={funcao}>
            <dt>{funcao}</dt>
            <dd>{nome}</dd>
          </div>
        ))}
      </dl>
      <p className="sv-fim">
        A próxima cena
        <br />é a <span>sua.</span>
      </p>
    </section>
  )
}
