// Header · nav pill. Invisível durante toda a introdução do hero.
// Quando o card começa a encolher, o useHeroScroll dispara a
// coreografia em tempo real: a bola com a isologo desce e, ainda no
// pouso, se expande virando a pill do protótipo. Depois do hero, a pill
// sobe no scroll pra baixo e volta no scroll pra cima, com o cursor no
// topo da tela ou com o foco do teclado (useHeroScroll).
//
// O que a pill faz (useNav):
// - cada link leva à sua cena pelo registro de destinos (lib/navegar):
//   perto, rolagem suave; longe, a lâmina verde;
// - o marcador verde fica sob a seção em que você está e desliza quando
//   ela muda; o hover é das letras, que rolam uma a uma (leoleo);
// - a faixa cinza atrás dos links é o progresso da página.
//
// Contato ainda não tem cena: o CTA fica de pé, sem destino, até a
// Cena 8 ou um contato direto definido pelo PO.

import type { CSSProperties, MouseEvent } from 'react'
import { NAV_ITENS, useNav } from './useNav'
import './header.css'

function semDestino(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
}

export function Header() {
  const { headerRef, aoClicar } = useNav()

  return (
    <header ref={headerRef} className="nav-pill">
      <span className="nav-progress" aria-hidden="true" />
      <a
        className="nav-logo"
        href="#topo"
        data-alvo="topo"
        onClick={aoClicar}
        aria-label="Leovox Studios, voltar ao início"
      >
        <img src="/branding/mascot/isotipo-leovox-verde.svg" alt="" draggable={false} />
      </a>
      <nav className="nav-links" aria-label="Navegação principal">
        {NAV_ITENS.map((item) => (
          <a
            key={item.id}
            className="nav-link"
            href={`#${item.id}`}
            data-alvo={item.alvo}
            data-secao={item.id}
            onClick={aoClicar}
            aria-label={item.rotulo}
          >
            {/* letra a letra, pro nascimento e pro hover do leoleo: cada
                caixa guarda o caractere em data-ch e o CSS desenha as
                duas cópias que rolam */}
            <span className="nav-txt" aria-hidden="true">
              {[...item.rotulo].map((ch, i) => (
                <span key={i} className="nav-ch" data-ch={ch} style={{ '--i': i } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          </a>
        ))}
        <span className="nav-marca" aria-hidden="true" />
      </nav>
      {/* CTA no padrão getquoti (spec final do PO): o botão é a
          máscara. No hover o card branco recua pra trás (sobe um
          passo, inclina) e o card verde nasce da borda de baixo do
          próprio botão, subindo pela FRENTE e cobrindo o antigo:
          troca de baralho, não lançamento. CSS puro. */}
      <a className="nav-cta" href="#contato" onClick={semDestino}>
        <span className="nav-cta-card nav-cta-card-a">Contato</span>
        <span className="nav-cta-card nav-cta-card-b" aria-hidden="true">
          Contato
        </span>
      </a>
    </header>
  )
}
