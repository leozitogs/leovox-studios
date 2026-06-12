// Cena 2 · Manifesto · A Leovox fala.
// Continuação direta do palco off-white onde o hero terminou. Quatro
// atos com a luz se apagando. A coreografia vive em useManifestoScroll;
// as entradas de cada ato são CSS puro disparado pela classe is-on.
// Atos 3 e 4 estão em rebriefing com o PO: a composição atual é
// provisória e segura o lugar na sequência.

import { useEffect, useRef, type CSSProperties } from 'react'
import { ContourField } from '../../components/ContourField'
import { useManifestoScroll } from './useManifestoScroll'
import './manifesto.css'

// Quebra o texto em letras para o bounce individual do ato 3.
// --i alimenta o stagger no CSS; o jitter da o assentamento torto
// de DIVISAO (rotacao e baseline proprias por letra, no span interno,
// pra nao brigar com o transform da animacao de queda).
const JITTER: Array<[number, number]> = [
  [-3.5, 6],
  [2, -5],
  [-1.5, 4],
  [3.5, -6],
  [-3, 5],
  [2.5, -2],
  [-2, 7],
  [3, -4],
]

function Letters({ text, jitter = false }: { text: string; jitter?: boolean }) {
  return (
    <>
      {[...text].map((c, i) =>
        c === ' ' ? (
          <span key={i} className="mf-sp" />
        ) : (
          <span key={i} className="mf-ch" style={{ '--i': i } as CSSProperties}>
            <span
              className="mf-chi"
              style={
                jitter
                  ? ({
                      '--jr': `${JITTER[i % JITTER.length][0]}deg`,
                      '--jy': `${JITTER[i % JITTER.length][1]}px`,
                    } as CSSProperties)
                  : undefined
              }
            >
              {c}
            </span>
          </span>
        ),
      )}
    </>
  )
}

// Letras do wordmark do ato 4: spans limpos que a fisica do cursor
// transforma em tempo real (o transform e 100% do rAF, sem brigar
// com a entrada, que anima a linha inteira por fora).
function WLetters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) =>
        c === ' ' ? (
          <span key={i} className="mf-wsp" />
        ) : (
          <span key={i} className="mf-wch">
            {c}
          </span>
        ),
      )}
    </>
  )
}

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  useManifestoScroll(sectionRef)

  // O wordmark do ato 4 reage ao cursor (referencia Field Day): cada
  // letra perto dele abre caminho com fisica de mola e volta deslizando
  // quando o cursor sai. Gesto em tempo real, fora do scroll, rodando
  // somente com o ato em cena.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ato = section.querySelector<HTMLElement>('.mf-ato-4')
    if (!ato) return
    const chars = Array.from(ato.querySelectorAll<HTMLElement>('.mf-wch'))
    if (chars.length === 0) return
    const state = chars.map(() => ({ x: 0, y: 0, r: 0 }))

    let mx = -9999
    let my = -9999
    const onMove = (event: MouseEvent) => {
      mx = event.clientX
      my = event.clientY
    }
    window.addEventListener('mousemove', onMove)

    let raf = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!ato.classList.contains('is-on')) return
      for (let i = 0; i < chars.length; i += 1) {
        const el = chars[i]
        const rect = el.getBoundingClientRect()
        const dx = rect.left + rect.width / 2 - mx
        const dy = rect.top + rect.height / 2 - my
        const dist = Math.hypot(dx, dy) || 1
        const force = Math.max(0, 1 - dist / 240)
        const s = state[i]
        s.x += ((dx / dist) * force * 52 - s.x) * 0.14
        s.y += ((dy / dist) * force * 52 - s.y) * 0.14
        s.r += ((dx > 0 ? 1 : -1) * force * 8 - s.r) * 0.14
        el.style.transform = `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <section ref={sectionRef} className="manifesto" aria-label="Manifesto Leovox">
      <ContourField />

      {/* Ato 1 · Recusa · off-white, continuando o palco do hero */}
      <div className="mf-ato mf-ato-1">
        <p className="mf-kicker mf-in d1">MANIFESTO / ATO 1</p>
        <h2 className="mf-title">
          <span className="mf-title-main mf-in d2">A LEOVOX NASCEU DE</span>{' '}
          <span className="mf-nowrap">
            <span className="mf-title-main mf-in d2">UMA</span>{' '}
            <em className="mf-script mf-stamp-in">recusa.</em>
          </span>
        </h2>
        <ul className="mf-recusas">
          <li className="mf-in d3">
            A recusa de <span className="mf-risco">se encaixar</span>.
          </li>
          <li className="mf-in d4">A recusa de escolher entre criativo ou técnico.</li>
          <li className="mf-in d5">
            A recusa de achar que marca boa é{' '}
            <span className="mf-rabisco">
              só logo bonito
              <span className="mf-note">sério?</span>
            </span>
            .
          </li>
        </ul>
      </div>

      {/* Ato 2 · Diagnóstico · cinza */}
      <div className="mf-ato mf-ato-2">
        <div className="mf-marquee" aria-hidden="true">
          <span>MARCA AUTÊNTICA · EXECUÇÃO TÉCNICA · RESULTADO REAL ·&nbsp;</span>
          <span>MARCA AUTÊNTICA · EXECUÇÃO TÉCNICA · RESULTADO REAL ·&nbsp;</span>
        </div>
        <p className="mf-kicker mf-in d1">MANIFESTO / ATO 2</p>
        <h2 className="mf-title">
          <span className="mf-title-main mf-in d2">O MERCADO ERROU</span>{' '}
          <em className="mf-script mf-stamp-in">feio.</em>
        </h2>
      </div>

      {/* Ato 3 · Solução · verde chapado, letras em queda com bounce */}
      <div className="mf-ato mf-ato-3">
        <div className="mf-ht mf-ht-a" aria-hidden="true" />
        <div className="mf-ht mf-ht-b" aria-hidden="true" />
        <p className="mf-kicker mf-in d1">MANIFESTO / ATO 3</p>
        <h2
          className="mf-tese"
          aria-label="A LEOVOX É O QUE ACONTECE QUANDO VOCÊ IGNORA ESSA DIVISÃO."
        >
          <span aria-hidden="true">
            <span className="mf-t1">
              <Letters text="A LEOVOX É O QUE ACONTECE" />
            </span>
            <span className="mf-t2">
              <Letters text="QUANDO VOCÊ" />
              <span className="mf-sticker">IGNORA</span>
            </span>
            <span className="mf-t3">
              <span className="mf-essa">ESSA</span>
              <span className="mf-divisao-l">
                <Letters text="DIVISÃO." jitter />
                <svg
                  className="mf-risco-l"
                  viewBox="0 0 600 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path className="mf-risco-p1" d="M8,52 C120,40 320,30 592,24" pathLength="1" />
                  <path className="mf-risco-p2" d="M14,34 C180,46 400,54 586,46" pathLength="1" />
                </svg>
              </span>
            </span>
          </span>
        </h2>
      </div>

      {/* Ato 4 · Assinatura · centrado como os demais; o wordmark
          reage ao cursor (fisica em useEffect acima) */}
      <div className="mf-ato mf-ato-4">
        <p className="mf-kicker mf-in d1">MANIFESTO / ATO 4</p>
        <h2 className="mf-aqui">
          <span className="mf-aq mf-aq-t1">AQUI SE FAZ COM</span>{' '}
          <span className="mf-chip mf-chip-1">INTENÇÃO</span>
          <span className="mf-aq mf-aq-t2">, COM</span>{' '}
          <span className="mf-chip mf-chip-2">TÉCNICA</span>{' '}
          <span className="mf-aq mf-aq-t3">E COM</span>{' '}
          <span className="mf-chip mf-chip-3">AUTENTICIDADE</span>
          <span className="mf-aq mf-aq-t4">.</span>
        </h2>
        <div className="mf-wordmark" aria-label="DESENVOLVA SEUS SONHOS.">
          <span aria-hidden="true">
            <span className="mf-wl mf-w1">
              <WLetters text="DESENVOLVA" />
            </span>
            <span className="mf-wl mf-w2">
              <WLetters text="SEUS SONHOS." />
            </span>
          </span>
          <span className="mf-encosta" aria-hidden="true">
            ei, psiu! encosta nas letras aí
          </span>
        </div>
        <p className="mf-selo">ISSO É LEOVOX.</p>
      </div>

      {/* Lâminas de transição entre atos */}
      <div className="mf-blade mf-blade-green" aria-hidden="true" />
      <div className="mf-blade mf-blade-dark" aria-hidden="true" />
    </section>
  )
}
