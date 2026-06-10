# Leovox Studios · Portfólio

> Desenvolva seus sonhos. Isso é Leovox.

Codinome do projeto: **SEM CORTE**. O portfólio é um plano-sequência:
uma cena só, do primeiro scroll ao contato. Nenhuma transição é
recarregamento de página.

## Stack

React + Vite + TypeScript. GSAP + ScrollTrigger. Lenis (smooth scroll).
Barba.js (transições de rota). React Three Fiber (canvas WebGL persistente).
FLIP para o elemento-âncora compartilhado.

## Rodar

```
npm install
npm run dev
```

O dev server sobe em `http://localhost:5173` (porta fixa, strictPort).

## Qualidade

```
npm run validate
```

Roda, nesta ordem: checagem de travessão, typecheck, lint, checagem de
formatação, testes de marca e build. É o portão obrigatório antes de
qualquer commit, e o CI repete tudo em cada push e PR.

Scripts individuais: `lint`, `format`, `format:check`, `typecheck`,
`test`, `check:travessao`.

## Documentação

| Onde                                                | O que                                             |
| --------------------------------------------------- | ------------------------------------------------- |
| `docs/leovox-portfolio-contexto-compactado-v1_0.md` | Briefing canônico do build (papéis, cenas, specs) |
| `docs/DECISOES.md`                                  | Registro de decisões travadas durante o build     |
| `CONTRIBUTING.md`                                   | Contrato de trabalho e regras de execução         |

A documentação completa da identidade Leovox (brand manual, tom de voz,
mascote, direção criativa) vive fora deste repositório.

## Assets

Antes da Cena 1, dropar os assets conforme os READMEs de
`public/fonts/`, `public/mascote/` e `public/textures/`.

## Regras inegociáveis

1. Travessão banido em todo e qualquer conteúdo. `npm run check:travessao` antes de commit.
2. Off-white é `#FBFBFB`, nunca branco puro.
3. O site vive em preto; o verde é luz por cor, nunca por efeito
   (glow, neon, bloom, glitch e afins são banidos).
4. Somente o Product Owner faz commit e push.

## Licença

Código visível, não aberto. Este repositório é público para avaliação
técnica e demonstração de processo; todos os direitos reservados.
Veja o arquivo `LICENSE`.

© 2026 Leovox Studios. Todos os direitos reservados.
