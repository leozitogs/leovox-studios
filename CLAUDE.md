# CLAUDE.md · Portfolio Leovox Studios

> Memoria do projeto, lida pelo Claude Code em toda sessao. Codinome SEM CORTE.
> Marca autentica, execucao tecnica, resultado real. Desenvolva seus sonhos.

## Contexto

Portfolio web da Leovox Studios, fundado por Leonardo Goncalves (o PO). O site e
tratado como um filme em plano-sequencia: uma tomada continua, cada cena com
mecanica propria, nenhuma transicao parece reload. Meta de qualidade: nivel
Awwwards. v1 e desktop; responsividade vem depois. O PO dirige e faz QA. Voce
executa via subagentes especialistas.

## Stack real (nao-negociavel, confirme no package.json antes de assumir)

- React 19 + Vite + TypeScript estrito (`strict: true`)
- CSS puro com variaveis em `src/styles/tokens.css` e um `.css` por cena.
  SEM Tailwind. SEM Framer Motion.
- GSAP 3 + ScrollTrigger para animacao
- Lenis para smooth scroll
- Barba.js (`@barba/core`) para transicoes de rota
- React Three Fiber + drei para 3D (canvas persistente unico)
- FLIP para elemento-ancora compartilhado

Nao instale fora dessa lista sem aprovacao do PO. Se um agente sugerir Tailwind,
Framer Motion ou tokens `leovox-*` de Tailwind, esta errado: o projeto usa CSS
puro com variaveis CSS.

## Documentos canonicos (leia antes de tocar arquivo)

- `docs/PIPELINE.md`: o roteiro do filme, as cenas, o estado de cada uma e como
  sao produzidas.
- `CONTRIBUTING.md`: fluxo, git, regras de marca, leis de animacao, pipelines de
  asset.
- `docs/DECISOES.md`: registro de decisoes (local e gitignored), historico
  canonico.

A identidade completa (brand manual, tom de voz, mascote) vive FORA do repo, na
pasta de identidade do PO. Nao referencie paths de `Documentos/` aqui dentro:
eles nao existem no repositorio do portfolio.

## Regras de marca no codigo

1. Travessao banido em qualquer conteudo (string, comentario, copy, commit, PR).
   `npm run check:travessao` pega, mas a regra e nao escrever. Use virgula,
   ponto, pipe ou parenteses.
2. Paleta: `#000000`, `#222222`, `#19BC00`, `#FBFBFB`, `#FFFFFF`, mais o pastel
   `#C5F49D`. A paleta orienta, nao aprisiona. Branco puro `#FFFFFF` e LIBERADO
   (token `--color-white`); a regra antiga que o proibia foi corrigida na
   decisao 11.
3. O verde `#19BC00` e cor estrutural, aplicada chapada. Nunca efeito: glow,
   neon, bloom, halo, glitch, scanline, RGB split, holograma, codigo binario
   decorativo e ruido digital sao banidos.
4. Grafite generico nao entra; assinatura propria autentica entra.
5. Halftone e serigrafia sao as herancas visuais incentivadas.
6. Corte proibido: nenhum fade branco ou reload visivel entre cenas.

## Fontes (7 familias oficiais, via @font-face em tokens.css)

Anton (display), Bebas Neue (numerico e kicker), Extenda 30/40/80 (assinatura,
cortes trial), Montserrat (corpo), Poppins (conversacional), Lost in South
(selo), Schoolbell (anotacao a mao). Nao instale Inter, Roboto, Geist, Manrope e
afins.

## Leis de animacao (aprendidas em producao, valem como lei)

1. Movimento de camera e scrubado pelo scroll; gesto de elemento roda em tempo
   real por gatilho, e nunca pode ser esticado ou picotado pelo ritmo do usuario.
2. Opacidade dentro de timeline scrubada se calcula como funcao pura do
   progresso, nao como tween. Tween de `autoAlpha` nao restaura confiavel no
   reverse.
3. Entrada de cena e CSS puro com `fill backwards`: animacao que nao deixa estilo
   inline nao contamina o estado inicial do scrub.
4. Alvo fora da secao escopada entra como referencia de elemento na timeline,
   nunca como string de seletor.
5. Tween preguicoso (`.to`) nao entra em timeline scrubada: tudo `fromTo` com
   valores explicitos.
6. Bug de animacao se reproduz no browser antes de corrigir, e a correcao se
   prova do mesmo jeito.

## Pipelines de asset

- Video com alpha: fonte mp4 com fundo verde, chroma key direto no ffmpeg, saida
  VP8 `yuva420p` 24fps. Checklist de aceite: profile 0, `alpha_mode` 1 E
  `alphaextract` com minimo perto de 0. Comando canonico em
  `public/animation/README.md`.
- Imagens: 4K nos masters; conversao pra WebP/AVIF antes do lancamento.
- Fontes: ttf/otf no dev; woff2 e a licenca comercial da Extenda (cortes trial)
  sao bloqueios de lancamento.

## Portao de qualidade

`npm run validate` roda em sequencia: `check:travessao`, typecheck, lint, format,
testes (marca, matematica das cenas, existencia de assets) e build. Precisa
passar ANTES de todo commit. O CI repete tudo e roda `npm run smoke` (Chromium
real percorrendo o filme inteiro, falha com qualquer `console.error`, excecao,
rejeicao de promise ou 404 de asset). Scripts individuais: `lint`, `format`,
`format:check`, `typecheck`, `test`, `check:travessao`, `smoke`.

## Git (do PO, nunca seu)

Branches por cena (`cena/hero`, `cena/manifesto`, ...). Commits em ingles, modo
imperativo, sem prefixo de convencao (`Build hero scene...`, nao `feat:`).
Trunk-based, sem branch develop. Voce NUNCA commita, pusha ou cria branch. Voce
roda `npm run validate` e devolve a mensagem de commit proposta pro PO.

## Estrutura real do projeto

`src/`: `scenes/<Cena>/` (Hero, Manifesto, Pilares, SelectedProjects, CaseIndex,
Sobre, Contato, Footer), `components/`, `canvas/` (PersistentCanvas, Totem),
`lib/` (gsap, lenis, barba, reveal, errors), `hooks/`, `data/projects.ts`,
`styles/` (tokens.css, global.css), `notfound/`.

`public/`: `animation/`, `background/`, `branding/` (mascot, monogram,
typography), `commons/`, `components/`, `fonts/`, `models/`, `textures/`,
`favicon/`.

## Squad de subagentes Leovox (use via Task)

| Subagent                      | Quando usar                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `leovox-conductor`            | Brief grande, multi-disciplinar. Orquestra os outros.                               |
| `leovox-art-director`         | Antes de codar cena nova. Devolve Visual Spec, nao codigo.                          |
| `leovox-brand-guard`          | SEMPRE antes de aprovar entrega. Audita contra as regras de marca.                  |
| `leovox-frontend-architect`   | Componente React, cena estatica, estrutura, CSS puro.                               |
| `leovox-animation-engineer`   | GSAP em tempo real: microinteracao, gesto de elemento por gatilho.                  |
| `leovox-scroll-storyteller`   | ScrollTrigger pinado: camera scrubada, progresso como funcao pura, reversibilidade. |
| `leovox-transitions-engineer` | Lenis (smooth scroll) e Barba (transicoes de rota), o plano-sequencia sem reload.   |
| `leovox-3d-engineer`          | R3F, drei, canvas persistente, mascote e isologo 3D.                                |
| `leovox-shader-artist`        | GLSL e WebGL custom no R3F, dentro da marca (sem neon, sem bloom).                  |
| `leovox-video-pipeline`       | Mascote em webm com alpha: chroma no ffmpeg, VP8, checagem de alpha.                |
| `leovox-ux-microcopy`         | Texto curto na voz Leovox (botoes, estados, headlines).                             |
| `leovox-a11y-auditor`         | WCAG 2.2 AA. SEMPRE antes de entregar.                                              |
| `leovox-performance-watchdog` | Bundle, FPS, peso de asset, smoke.                                                  |
| `leovox-asset-curator`        | Path exato de qualquer asset em `public/`.                                          |
| `leovox-case-builder`         | Cena de cases e paginas de case study.                                              |

## Workflow padrao

1. Rode `npm run agents:route -- --task="resumo do pedido"`. O catalogo em
   `harness/agents/catalog.json` decide especialistas, dependencias e evidencias.
2. Leia o pedido em silencio. Multi-disciplinar? `leovox-conductor`. Um dominio
   so? subagente direto.
3. Antes de cena nova: `leovox-asset-curator` (paths) e `leovox-art-director`
   (Visual Spec).
4. Build estatico primeiro, movimento depois.
5. Depois de implementar: `leovox-brand-guard` e `leovox-a11y-auditor`
   (obrigatorios), `leovox-performance-watchdog` (recomendado).
6. Cada especialista devolve `summary`, `evidence`, `risks` e `followUps`.
7. `npm run validate`. Devolva ao PO o que foi feito, arquivos, auditorias,
   decisoes pendentes e a mensagem de commit proposta. Nao commite.

## Principio editorial

A Leovox descreve, nao promete vazio. Substancia antes de estilo. Frase que pode
ser apagada sem perda e apagada. Na duvida estetica, pergunta ao PO em vez de
inventar. Voce e Leovox enquanto opera neste projeto, e nunca usa travessao nem
palavra vazia na resposta ao PO.
