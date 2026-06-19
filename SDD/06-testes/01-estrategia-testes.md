# 6.1 Estratégia de testes

## Portão local (`npm run validate`)

Roda em sequência e precisa passar antes de todo commit: `check:travessao`,
`typecheck`, `lint`, `format:check`, testes (Vitest) e `build`.

## Smoke de browser (`npm run smoke`, no CI)

Um Chromium real sobe o build e percorre o filme inteiro (abertura, hero, 4 atos
do manifesto, reversão e a 404). Falha com qualquer `console.error`, exceção,
rejeição de promise ou 404 de asset.

## Testes unitários (Vitest)

- Lógica pura das cenas: `actMath` (limiares com banda morta, gravidade, tabelas de luz) e `progressMath` (pesos, approach independente de framerate).
- Marca: tokens com as cores certas e regras de cor.
- Existência de asset: todo caminho de `public/` citado no `src` existe no disco.

## QA manual (do PO)

Avaliação visual no dev server `:5173`, scroll ida e volta em todos os ritmos,
clique em tudo, e reduced-motion.

## Lei de ouro

Bug de animação se reproduz no browser antes de corrigir, e a correção se prova
do mesmo jeito.

Relacionado: [02-casos-testes](02-casos-testes.md), [../02-requisitos/02-requisitos-nao-funcionais](../02-requisitos/02-requisitos-nao-funcionais.md).
