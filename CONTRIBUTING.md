# Como este projeto é tocado

Este repositório é o portfólio da Leovox Studios em produção. Ele é
público de propósito: o processo aqui dentro é tão deliberado quanto o
resultado. Eu (Leonardo, fundador) dirijo o projeto como Product Owner;
o desenvolvimento roda com direção de produto assistida e execução
supervisionada, e nada entra sem a minha aprovação por escrito.

## O fluxo, cena a cena

O site é um filme e o roteiro vive em `docs/PIPELINE.md`. Cada cena
segue o mesmo ciclo, sem atalho:

1. Briefing com protótipo visual aprovado antes de qualquer código.
2. Plano de execução (arquivos, abordagem, libs) aprovado por escrito.
3. Build estático primeiro, movimento depois.
4. QA de cena: scroll ida e volta em todos os ritmos, clique em tudo,
   reduced-motion, e bug de animação se reproduz em browser antes de
   qualquer correção (e a correção se prova do mesmo jeito).
5. Um PR por cena, com o template e o checklist de marca preenchidos.

## Git

- Branches por cena: `cena/hero`, `cena/manifesto`, e assim por diante.
- Commits em inglês, modo imperativo, sem prefixo de convenção
  (`Build hero scene state A...`, não `feat: ...`).
- `npm run validate` precisa passar ANTES de todo commit. Sem exceção,
  sem `--no-verify`, sem "arruma depois".
- Só o Product Owner commita e pusha.
- Fluxo trunk-based: cena pra main via PR com CI verde. Sem branch
  develop até existir deploy que justifique.

## Portão de qualidade

```
npm run validate
```

Roda em sequência: checagem de travessão, typecheck, lint, formatação,
testes (marca, matemática das cenas, existência de assets) e build.
O CI repete tudo em cada push e PR, e ainda roda o smoke de browser:

```
npm run build && npm run smoke
```

O smoke sobe o build num Chromium real, percorre o filme inteiro
(abertura, hero, os 4 atos do manifesto e a reversão) e falha com
qualquer console.error, exceção, rejeição de promise ou 404 de asset.
`SMOKE_QUICK=1` encurta as esperas em máquina lenta. Em dev, o HUD de
erros mostra qualquer captura na tela, sem abrir o devtools; em
produção, um ErrorBoundary segura a queda na voz da marca. Scripts
individuais: `lint`, `format`, `format:check`, `typecheck`, `test`,
`check:travessao`, `smoke`.

## Regras de marca no código

1. Travessão banido em qualquer conteúdo: string, comentário, copy,
   commit, PR. O `check:travessao` caça, mas a regra é não escrever.
2. Paleta oficial: `#000000`, `#222222`, `#19BC00`, `#FBFBFB`,
   `#FFFFFF`, mais o verde pastel `#C5F49D` de apoio. A paleta orienta,
   não aprisiona: cor se usa com intenção.
3. O verde `#19BC00` é cor estrutural, aplicada chapada. Nunca efeito:
   glow, neon, bloom, halo, glitch, scanline, RGB split, holograma,
   código binário decorativo e ruído digital são banidos.
4. Grafite genérico não entra; assinatura própria autêntica entra.
5. Halftone e serigrafia são as heranças visuais incentivadas.
6. Corte proibido: nenhum fade branco ou reload visível entre cenas.

## Regras de animação (aprendidas em produção, valem como lei)

1. Movimento de câmera é scrubado pelo scroll; gesto de elemento roda
   em tempo real, disparado por gatilho, e nunca pode ser esticado ou
   picotado pelo ritmo do usuário.
2. Opacidade dentro de timeline scrubada se calcula como função pura do
   progresso, não como tween. Tween de autoAlpha não restaura confiável
   no reverse.
3. Entrada de cena é CSS puro com fill backwards: animação que não
   deixa estilo inline não contamina o estado inicial do scrub.
4. Alvo fora da seção escopada entra como referência de elemento na
   timeline, nunca como string de seletor.
5. Tween preguiçoso (.to) não entra em timeline scrubada: tudo fromTo
   com valores explícitos.

## Pipelines de asset

- **Vídeo com alpha**: fonte em mp4 com fundo verde, chroma key direto
  no ffmpeg, saída VP8 yuva420p 24fps. Checklist de aceite: profile 0,
  alpha_mode 1 E alphaextract com mínimo perto de 0. Comando canônico e
  regras completas no README de `public/animation/`.
- **Imagens**: 4K nos masters; conversão pra WebP/AVIF responsivo entra
  antes do lançamento.
- **Fontes**: ttf/otf direto durante o dev; conversão pra woff2 e
  resolução da licença comercial da Extenda (cortes trial) são
  bloqueios de lançamento.

## Documentos

| Onde               | O que                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| `docs/PIPELINE.md` | O roteiro do filme: as cenas, o estado de cada uma e como são produzidas |
| `CONTRIBUTING.md`  | Este documento: como o trabalho acontece                                 |

A identidade completa da Leovox (brand manual, tom de voz, mascote,
direção criativa) vive fora deste repositório. Este código é público
sob licença proprietária: ver `LICENSE`.
