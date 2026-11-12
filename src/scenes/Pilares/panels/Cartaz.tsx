// O cartaz PILARES DA LEOVOX (decisão 58, aprovado pelo PO): palco
// #222222 com papel amassado, grafismos half-style sangrando pela
// esquerda, o lockup e o personagem de contorno verde. Intocado na v4.

export function Cartaz() {
  return (
    <header className="pl-painel pl-abertura" data-panel-kind="cartaz" data-panel-id="cartaz">
      <div className="pl-cartaz">
        {/* width/height declarados: sem a proporção intrínseca a caixa
            colapsa em altura zero e o loading lazy nunca vê o elemento
            entrar no viewport (bug provado em browser) */}
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
  )
}
