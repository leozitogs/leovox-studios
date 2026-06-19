# 4.4 Fluxos e regras de negócio

## Fluxo principal (da abertura ao contato)

Loader com progresso real, a folha sobe e emite o reveal, o hero entra em CSS
puro, o hero fixa e destrava o Lenis, o usuário rola pelo filme (Hero,
Manifesto, Pilares, Selected Projects, Sobre, Contato, Footer). Da miniatura de
um projeto, o FLIP leva ao case study sem corte. O Contato fecha o círculo com o
hero.

## Leis de animação (regra de negócio do movimento)

1. Movimento de câmera é scrubado; gesto de elemento roda em tempo real por gatilho, nunca esticado nem picotado.
2. Opacidade em timeline scrubada é função pura do progresso, não tween (autoAlpha não restaura no reverse).
3. Entrada de cena é CSS puro com fill backwards, sem deixar estilo inline.
4. Alvo fora da seção escopada entra como referência de elemento, nunca string de seletor.
5. Tudo `fromTo` com valores explícitos; nada de `.to` preguiçoso em timeline scrubada.
6. Bug de animação se reproduz no browser antes de corrigir, e a correção se prova do mesmo jeito.

## Regra do Manifesto (gravidade de ato)

A transição entre atos roda em tempo real ao cruzar o limiar (com banda morta
contra tremor) e sempre conclui. Parou o scroll, a tela assenta no descanso do
ato corrente. O scroll nunca descansa no meio de uma fatiada.

## Regra da 404

Entry próprio, sem Lenis, carrega instantâneo. O smoke exige console limpo nela.
Caminho único de volta para a home.

Relacionado: [03-interfaces](03-interfaces.md), `CONTRIBUTING.md`, `docs/PIPELINE.md`.
