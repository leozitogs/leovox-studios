# Cenas · regras locais

Vale para tudo em `src/scenes/`. Soma-se ao `AGENTS.md` da raiz.

## Forma de uma cena

- Pasta `src/scenes/<Cena>/` com `index.tsx`, um `.css` próprio e hooks `use<Cena>Scroll.ts` quando
  houver câmera scrubada. Matemática de movimento fica em arquivo puro (`tiraMath.ts`), testada em
  `tests/` sem browser.
- Cena não importa outra cena. Infra compartilhada vem de `src/lib/` (instâncias únicas de GSAP e
  Lenis). Componente reutilizável vai para `src/components/`.
- A raiz da cena declara `data-harness-scene="<id>"` para a API `window.__LEOVOX_HARNESS__`.
- Cores e fontes só por variáveis de `src/styles/tokens.css`.

## Movimento

- Câmera scrubada: estado como função pura do progresso; `fromTo` com valores explícitos; opacidade
  calculada, não tweenada.
- Gesto de elemento: tempo real, disparado por gatilho, nunca esticado pelo ritmo do scroll.
- Entrada de cena em CSS puro com `fill backwards`, sem estilo inline.
- Alvo fora da seção escopada entra como referência de elemento, nunca como string de seletor.
- Teardown limpa timeline, ScrollTrigger, listener e estilo inline. Refresh, salto pelo menu e
  reload no meio chegam no mesmo estado que o scroll contínuo.
- Reduced motion e telas abaixo de 900px: fluxo vertical completo, sem pin.

## Prova

- Critério do contrato da cena coberto por teste com o ID no título (`[PIL-04]`).
- Placeholder se declara com `data-placeholder` e nunca se apresenta como case publicado.
- Antes de entregar: `npm run test:browser:chromium` e a skill `leovox-verificar`.
