# Leovox Studios · Portfólio

> Desenvolva seus sonhos. Isso é Leovox.

Codinome: **SEM CORTE**. O portfólio nasceu do conceito de
plano-sequência e mantém o espírito: transição é movimento de câmera,
nunca reload na cara do usuário. Sem dogma: cada cena nasce com
autenticidade, na ordem que fizer sentido. v1 é desktop; a
responsividade vem depois.

## Stack

React + Vite + TypeScript. GSAP + ScrollTrigger. Lenis (smooth scroll).
Barba.js (transições de rota). React Three Fiber (canvas WebGL
persistente). FLIP pro elemento-âncora compartilhado.

## Rodar

```
npm install
npm run dev
```

Dev server em `http://localhost:5173` (porta fixa, strictPort).

## Qualidade

```
npm run validate
```

Roda em sequência: checagem de travessão, typecheck, lint, formatação,
testes (marca, matemática das cenas, existência de assets) e build. É o
portão antes de qualquer commit, e o CI repete tudo em cada push e PR,
mais o smoke de browser (`npm run smoke`): Chromium real percorrendo o
filme inteiro e falhando com qualquer erro de console ou asset quebrado.

Scripts individuais: `lint`, `format`, `format:check`, `typecheck`,
`test`, `check:travessao`, `smoke`.

## Documentação

| Onde               | O que                                                |
| ------------------ | ---------------------------------------------------- |
| `docs/PIPELINE.md` | O roteiro do filme: cenas, estados e como são feitas |
| `CONTRIBUTING.md`  | Como o trabalho acontece neste repositório           |

A identidade completa da Leovox (brand manual, tom de voz, mascote,
direção criativa) vive fora deste repositório.

## Assets

Cada pasta de `public/` tem README próprio explicando o que mora nela:
`animation/`, `background/`, `branding/`, `commons/`, `components/`,
`fonts/`, `models/`, `textures/`.

## Regras da marca no código

1. Travessão banido em qualquer conteúdo. `npm run check:travessao` pega.
2. Paleta oficial: `#000000`, `#222222`, `#19BC00`, `#FBFBFB`, `#FFFFFF`
   (mais o verde pastel `#C5F49D` de apoio). A paleta orienta, não
   aprisiona: marca criativa usa cor com intenção.
3. O verde é cor estrutural, chapada. Nunca efeito: glow, neon, bloom,
   glitch, scanline e afins continuam banidos.
4. Grafite genérico não entra; assinatura própria autêntica entra.
5. Só o Product Owner faz commit e push.

## Licença

Código visível, não aberto. Repositório público pra avaliação técnica
e demonstração de processo; todos os direitos reservados. Ver `LICENSE`.

© 2026 Leovox Studios. Todos os direitos reservados.
