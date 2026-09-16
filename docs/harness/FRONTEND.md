# Harness frontend

## Matriz inicial

| Projeto | Viewport | Frequência |
| --- | --- | --- |
| Chromium desktop | 1600 x 900 | PR |
| Chromium compacto | 1440 x 900 | PR |
| Chromium mobile | 390 x 844 | PR |
| Chromium reduced motion | 1440 x 900 | PR |
| Firefox desktop | 1440 x 900 | Completa |
| WebKit mobile | 390 x 844 | Completa |

Cada teste escolhe o menor conjunto capaz de provar seu risco. Jornadas críticas rodam em todos os projetos. Comparações pixel a pixel começam no Chromium desktop, em ambiente fixo.

## Seletores

Prioridade: papel semântico, nome acessível, `data-harness-scene`, e por último um `data-testid` justificado. Classes visuais não são contrato de teste.

## Esperas

Esperas fixas são proibidas. Use estado observável: loader removido, classe ativa, atributo de cena, animações assentadas ou resposta da API do harness.
