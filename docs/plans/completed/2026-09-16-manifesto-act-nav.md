# Plano concluído: índice dos atos do Manifesto

## Objetivo

Adicionar à direita um índice vertical de quatro marcadores que aparece na transição após o Hero, acompanha o ato corrente do Manifesto e desaparece antes de Pilares.

## Critérios

- [x] Existem exatamente quatro marcadores.
- [x] O marcador ativo se alonga como na referência.
- [x] O estado acompanha ida, reverse e salto determinístico.
- [x] Cada marcador navega para o ato correspondente.
- [x] Teclado, foco e `aria-current` permanecem sincronizados.
- [x] O índice entra no mesmo limiar em que o Hero encolhe e permanece apenas durante o Manifesto.
- [x] O marcador ativo cresce no fluxo e desloca os vizinhos com espaço contínuo.
- [x] A experiência nova começa em tablet e permanece fora de telas pequenas nesta rodada.

## Evidências

- `npm run validate`: contratos, agentes, tipos, lint, formato, 20 testes e build aprovados.
- `npm run test:browser:chromium -- --workers=1`: 25 testes aprovados e 10 skips deliberados.
- Contrato do índice aprovado em Chromium desktop e compacto.
- Revisão visual local aprovada em 1600 x 900 no terceiro ato.
- Verificação visual do limiar: oculto em 60% do Hero e visível em 70%, após o início do encolhimento.
- Verificação visual do ritmo: entrada escalonada e redistribuição vertical suave entre os quatro marcadores.
- A execução paralela inicial esgotou memória e contextos WebGL do host; a mesma suíte passou integralmente com um worker.
