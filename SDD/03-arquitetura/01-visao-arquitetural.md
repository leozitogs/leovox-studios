# 3.1 Visão arquitetural

## Tipo de sistema

Aplicação web estática, construída como build multipágina do Vite: a home
(`index.html`) e a 404 (`404.html`) são entries independentes. Sem backend
nesta versão; a hospedagem serve arquivos estáticos.

## Princípio: o site é um filme

A arquitetura inteira serve ao plano-sequência. Três camadas de movimento
convivem:

- Movimento de câmera: scrubado pelo scroll (ScrollTrigger pinado), calculado como função pura do progresso.
- Gesto de elemento: roda em tempo real, disparado por gatilho, com seu próprio tempo.
- Transição de rota: o Barba costura saída e entrada sem reload visível.

## Componentes macro

- Shell (`src/App.tsx`): monta o canvas persistente, o loader, o header e as cenas dentro de `.site`.
- Canvas persistente (`src/canvas/PersistentCanvas.tsx`): um único R3F fixo, na camada `--z-canvas`, que sobrevive à troca de rota (o totem viaja nele).
- Cenas (`src/scenes/<Cena>/`): cada cena é uma pasta com componente e CSS próprios.
- Biblioteca de runtime (`src/lib/`): `gsap.ts` (registro de plugins), `lenis.ts` (smooth scroll), `barba.ts` (rotas), `reveal.ts` (barramento de revelação), `errors.ts` (captura de erro).
- Entry da 404 (`src/notfound/`): independente, sem Lenis, carrega instantâneo.

## Decisões estruturais

- O Lenis nasce travado e alimenta o `ScrollTrigger.update`; destrava quando o hero fixa.
- A entrada de cena é CSS puro com fill backwards, pra não contaminar o estado inicial do scrub.
- Erros ficam visíveis em dev (HUD) e seguram a queda em produção (ErrorBoundary com a voz da marca).

Relacionado: [02-diagramas](02-diagramas.md), [03-tecnologias](03-tecnologias.md), [../04-design-detalhado/02-design-modulos](../04-design-detalhado/02-design-modulos.md).
