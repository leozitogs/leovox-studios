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

## Matriz de responsividade desta fase

Telas pequenas e mobile não fazem parte da rodada atual. O contrato responsivo usa o menor eixo para preservar escala física e cobre:

| Faixa | Viewport |
| --- | --- |
| Tablet retrato | 768 x 1024 |
| Tablet paisagem | 1024 x 768 |
| Full HD | 1920 x 1080 |
| 2K | 2560 x 1440 |
| 2.5K | 2560 x 1600 |
| Ultrawide | 3440 x 1440 |
| 4K | 3840 x 2160 |

Execute `npm run test:browser:responsive` para validar geometria, overflow e alvos de interação nessa matriz.

Cada teste escolhe o menor conjunto capaz de provar seu risco. Jornadas críticas rodam em todos os projetos. Comparações pixel a pixel começam no Chromium desktop, em ambiente fixo.

## Seletores

Prioridade: papel semântico, nome acessível, `data-harness-scene`, e por último um `data-testid` justificado. Classes visuais não são contrato de teste.

## Esperas

Esperas fixas são proibidas. Use estado observável: loader removido, classe ativa, atributo de cena, animações assentadas ou resposta da API do harness.
