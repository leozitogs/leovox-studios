# Plano concluído: Pilares, "A tira" (briefing v4)

## Objetivo

Refazer a seção horizontal dos Pilares com o nível de execução da referência aprovada pelo PO,
mantendo o cartaz (decisão 58) e a queda de luz (decisão 59), com placeholders até os trabalhos
reais chegarem. Laptop primeiro; responsividade fina depois.

## Escopo entregue

- Tira de 11 painéis: cartaz, 3 capas de frente em folha off-white rasgada, 6 trabalhos placeholder
  (2 por frente, paisagem e retrato) e fecho em verde chapado.
- Câmera scrubada como função pura do scroll (`tiraMath.ts`), proporção 1,25 e 0,7 tela de cartaz
  parado.
- Gravidade de painel: 150 ms sem scroll, o Lenis assenta no descanso mais próximo. Substitui a
  travessia por gatilho da decisão 60.
- Eixo de estado por painel: `--d`, `--near` e `--reveal` derivam parallax de camadas, âncora
  fantasma, revelação do cartão, inclinação do título e opacidade do texto.
- Velocidade vira inclinação do papel (até 2 graus, `@property --skew` com transição de volta ao
  prumo).
- Trilho fixo: capítulos com o rolo getquoti, régua com uma marca por trabalho, contador e nome que
  troca por carimbo. Clique, setas do teclado e foco só nos painéis visíveis.
- Sem pin abaixo de 900px e com reduced motion: fluxo vertical completo.
- Para ligar um trabalho real basta preencher `midia` em `src/scenes/Pilares/frentes.ts`.
- Correção no Manifesto: o índice dos atos ficava aceso por cima dos Pilares depois de um salto;
  `toggle(classe, undefined)` invertia a classe. A regra agora é explícita.

## Critérios

- [x] Três capas, uma por frente oficial, na ordem.
- [x] Placeholders declarados por `data-placeholder`, sem parágrafo de apoio.
- [x] Câmera função pura do scroll; parado no meio, assenta num painel.
- [x] Trilho e teclado navegam; o trilho informa frente e trabalho ativos.
- [x] Nenhum título estoura a coluna em 1366x768, 1440x900 e 1600x900.
- [x] Reduced motion e telas estreitas em fluxo vertical.

## Evidências

- `npm run validate`: travessão, contratos, agentes, tipos, lint, formato, 22 testes de unidade
  (13 novos da matemática da tira) e build.
- `npx playwright test` em chromium-desktop, chromium-compact, chromium-mobile,
  chromium-reduced-motion e webkit-mobile: 44 aprovados.
- `npm run smoke`: console limpo, gravidade assentando no meio da travessia, volta limpa ao cartaz.
- Quadros na travessia, Edge com GPU integrada em 1440x900: média 17,0 ms e p95 20,5 ms, no mesmo
  patamar do Manifesto (19,0) e do Hero (18,3). No Chromium headless sem GPU o p95 sobe para cerca de
  66 ms, e o Hero fica em 53 ms no mesmo ambiente.

## Riscos e limites

- Firefox não abre nesta máquina Windows; fica coberto pelo CI e pelo harness noturno no Linux.
- A meta de p95 abaixo de 20 ms ficou no limite (20,5 ms) em GPU integrada e build de
  desenvolvimento; medir de novo com o build de produção e com os assets reais.
- Os assets reais vão mudar peso e crop; o cartão já recorta com `object-fit: cover`.
- Responsividade fina (tablet e celular) fica para a rodada final, como pediu o PO.

## Trabalho restante

- Receber os trabalhos reais e preencher `frentes.ts`.
- Rodada de responsividade.
- QA do PO no :5173.
