# Plano ativo: entrada do índice do Manifesto

## Objetivo

Impedir que os quatro marcadores apareçam no primeiro scroll e liberar sua entrada apenas quando o Hero estiver encolhido no enquadramento de card da referência.

## Critérios

- [x] O primeiro movimento de scroll mantém o índice oculto.
- [x] O índice continua oculto durante a maior parte do encolhimento.
- [x] A entrada começa somente quando o card se aproxima do estado final.
- [x] Os marcadores surgem em sequência com movimento suave.
- [x] O índice permanece durante o Manifesto e desaparece antes de Pilares.
- [x] Reverse esconde o índice ao devolver o Hero ao estado aberto.

## Evidências

- O contrato de browser confirma o índice oculto em 10% e 82% do Hero e visível em 94%.
- As capturas `test-results/manifesto-nav-before.png` e `test-results/manifesto-nav-entry.png` confirmam o enquadramento visual antes e depois do limiar.
- `npm run validate`: aprovado.
- `npm run test:browser:chromium -- --workers=1`: 29 aprovados e 10 ignorados pelas condições previstas de viewport e movimento.

## Riscos e trabalho restante

- O limiar de 92% foi calibrado para o enquadramento atual do Hero e deve ser revisto se a duração ou a geometria da timeline mudar.
- Nenhum trabalho restante para este ajuste.
