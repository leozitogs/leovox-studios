# 4.3 Interfaces e contratos

Contratos internos entre módulos. Não há API externa.

## Barramento de revelação (`lib/reveal.ts`)

Desacopla o fim do loader da entrada do hero: o loader emite o reveal, a cena
escuta e dispara a própria entrada em CSS puro. Contrato: a entrada não depende
de medida de layout, então funciona mesmo enquanto a folha sobe.

## Smooth scroll (`lib/lenis.ts`)

Expõe iniciar, `stop` e `start`. O RAF do Lenis alimenta o `ScrollTrigger.update`.
Regra: link interno usa o scroll suave do Lenis, nunca `href="#"` cru (que salta
por fora e arrasta o pin).

## GSAP (`lib/gsap.ts`)

Exporta `gsap` e `ScrollTrigger` já registrados. Plugins entram aqui, sob demanda.

## Cena com scroll (ex `useHeroScroll`)

Recebe referências de elemento (nunca string de seletor para alvo fora da
seção), cria o pin e devolve a função de cleanup (`kill`). As opacidades são
função pura do progresso, calculadas no `onUpdate`.

## Captura de erro (`lib/errors.ts`)

Um barramento que captura `window.onerror`, rejeições e `console.error`. Em dev,
o ErrorHud mostra toasts na voz da marca; em produção, a captura é silenciosa e
pronta pra plugar um endpoint no futuro.

Relacionado: [04-fluxos](04-fluxos.md), [02-design-modulos](02-design-modulos.md).
