// Cena 9 · 404 · Fora do roteiro.
// Pixel-perfect na ref-404-final.png: Brush Up protagonista,
// dois ERRO watermarks em baixissimo contraste (topo/base cortados),
// textura de papel cobrindo as camadas traseiras, mascote
// ancorado embaixo-esquerda com mix-blend multiply (mata o matte
// branco do PNG), selo 404 circular top-right, paragrafo +
// seta curva + botao carimbo. Build estatico; animacao entra
// so depois da aprovacao do PO.

import './notfound.css'

export function NotFound() {
  return (
    <main className="nf">
      {/* Camada 1-2: ERRO watermarks em cima e embaixo (atras da textura) */}
      <div className="nf-bg" aria-hidden="true">
        <span className="nf-wm nf-wm-top">ERRO</span>
        <span className="nf-wm nf-wm-bot">ERRO</span>
      </div>

      {/* Camada 3: Eco unico de contorno verde Lost in South atras da textura */}
      <span className="nf-echo-bg" aria-hidden="true">
        ERRO
      </span>

      {/* Camada 4: Textura de papel cobrindo tudo atras */}
      <div className="nf-texture" aria-hidden="true" />

      {/* Conteudo em primeiro plano (z-index 5+) */}

      {/* Mascote: ancorando embaixo a esquerda, mix-blend multiply */}
      <div className="nf-char" aria-hidden="true">
        <img
          className="nf-char-img"
          src="/branding/mascot/mascot-full-body/leovox-personagem-saindo-de-lado.png"
          alt=""
          draggable={false}
        />
      </div>

      {/* Selo 404: anel desenhado a mao com seta no topo, top-right */}
      <div className="nf-badge" aria-hidden="true">
        <svg className="nf-badge-ring" viewBox="0 0 120 120" fill="none">
          <path
            d="M60,13 C86,13 107,34 107,60 C107,86 86,107 60,107 C34,107 13,86 13,60 C13,34 34,13 60,13"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M60,13 C72,7 81,10 79,20 M79,20 L73,14 M79,20 L70,21"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="nf-badge-num">4O4</span>
      </div>

      {/* ERRO protagonista em Brush Up verde chapado.
          nf-404 e o marcador estavel que o smoke gate asserta. */}
      <h1 className="nf-title nf-404">
        <span className="nf-sr">Erro 404. Cena não encontrada.</span>
        <span className="nf-erro" aria-hidden="true">
          ERRO
        </span>
      </h1>

      {/* Paragrafo + seta + botao: terco inferior */}
      <div className="nf-foot">
        <p className="nf-para">
          Você saiu do roteiro.
          <br />
          Acontece com os melhores.
          <br />O set continua Lá em cima.
        </p>
        <svg className="nf-arrow" viewBox="0 0 90 72" fill="none" aria-hidden="true">
          <path
            d="M10,12 C6,40 28,57 68,50 M68,50 L55,45 M68,50 L60,63"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="1"
          />
        </svg>
        <a className="nf-cta" href="/">
          VOLTAR
        </a>
      </div>
    </main>
  )
}
