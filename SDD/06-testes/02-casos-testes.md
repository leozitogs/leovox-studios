# 6.2 Casos de teste (principais)

| ID    | Cenário                           | Critério de aceite                                                        |
| ----- | --------------------------------- | ------------------------------------------------------------------------- |
| CT-01 | Reversibilidade do scroll no hero | Ida e volta em qualquer ritmo deixa personagem, headline e vídeo íntegros |
| CT-02 | Snap por ato no Manifesto         | Parar no meio de uma fatiada assenta no descanso do ato corrente          |
| CT-03 | Header nascendo do hero           | A bola desce, vira a pill e some no reverse, sem travar                   |
| CT-04 | 404 console limpo                 | `:5173/404.html` sem erro de console no smoke                             |
| CT-05 | Existência de asset               | Caminho de `public/` citado no `src` que não existe derruba o build       |
| CT-06 | Travessão                         | Nenhum travessão em arquivo do repo (`check:travessao`)                   |
| CT-07 | Paleta                            | Off-white `#FBFBFB` e branco puro `#FFFFFF` liberados; verde sem glow     |
| CT-08 | Reduced-motion                    | Toda cena cai num estado estático, sem pin nem gesto                      |
| CT-09 | Vídeo com alpha                   | VP8, profile 0, `alpha_mode` 1, alphaextract com mínimo perto de 0        |
| CT-10 | Links da nav                      | Clique não salta a página por fora do Lenis nem some com a cena           |

Relacionado: [01-estrategia-testes](01-estrategia-testes.md).
