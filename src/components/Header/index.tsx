// Header · nav pill. Invisível durante toda a introdução do hero.
// Quando o card começa a encolher, o useHeroScroll dispara a
// coreografia em tempo real: a bola com a isologo desce e, ainda no
// pouso, se expande virando a pill do protótipo.
// A barra cinza interna (.nav-progress) é o progresso de scroll da
// página. Depois do hero, a pill sobe no scroll pra baixo e reaparece
// no scroll pra cima (useHeroScroll dirige tudo).
//
// Os destinos ainda são placeholders: o clique é bloqueado pra não
// disparar navegação de âncora (#), que pula a página pro topo por
// fora do Lenis e atropela a timeline pinada. Quando as cenas
// existirem, cada link ganha o destino real com scroll suave.

import type { MouseEvent } from 'react'
import './header.css'

function blockPlaceholder(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
}

export function Header() {
  return (
    <header className="nav-pill">
      <span className="nav-progress" aria-hidden="true" />
      <a className="nav-logo" href="#" onClick={blockPlaceholder} aria-label="Leovox Studios">
        <img src="/branding/mascot/isotipo-leovox-verde.svg" alt="" draggable={false} />
      </a>
      <nav className="nav-links" aria-label="Navegação principal">
        <a href="#" onClick={blockPlaceholder}>
          Projetos
        </a>
        <a href="#" onClick={blockPlaceholder}>
          Sobre
        </a>
        <a href="#" onClick={blockPlaceholder}>
          Serviços
        </a>
      </nav>
      {/* CTA no padrão getquoti (spec final do PO): o botão é a
          máscara. No hover o card branco recua pra trás (sobe um
          passo, inclina) e o card verde nasce da borda de baixo do
          próprio botão, subindo pela FRENTE e cobrindo o antigo:
          troca de baralho, não lançamento. CSS puro. */}
      <a className="nav-cta" href="#" onClick={blockPlaceholder}>
        <span className="nav-cta-card nav-cta-card-a">Contato</span>
        <span className="nav-cta-card nav-cta-card-b" aria-hidden="true">
          Contato
        </span>
      </a>
    </header>
  )
}
