# 3.3 Tecnologias e justificativas

Confirme as versões reais no `package.json` antes de assumir.

| Tecnologia                            | Papel              | Por que                                                     |
| ------------------------------------- | ------------------ | ----------------------------------------------------------- |
| React 19 + TypeScript estrito         | UI e tipos         | Componentização das cenas; `strict` pega erro cedo          |
| Vite                                  | Build e dev server | Rápido, com build multipágina (home e 404)                  |
| CSS puro com variáveis (`tokens.css`) | Estilo             | Controle total da marca, sem peso nem abstração de Tailwind |
| GSAP 3 + ScrollTrigger                | Animação           | Timeline e pin scrubado, o coração do movimento             |
| Lenis                                 | Smooth scroll      | Scroll orgânico que alimenta o ScrollTrigger                |
| Barba.js                              | Transição de rota  | Plano-sequência entre páginas, sem reload                   |
| React Three Fiber + drei              | 3D                 | Mascote e isologo no canvas persistente                     |
| FLIP                                  | Elemento-âncora    | Miniatura que vira página sem corte                         |
| Vitest                                | Testes unitários   | Matemática das cenas, marca, existência de asset            |
| Playwright                            | Smoke de browser   | Percorre o filme inteiro e falha com erro de console        |
| ESLint + Prettier                     | Lint e formato     | Qualidade e estilo consistentes                             |

## Banidos por decisão

- Tailwind e Framer Motion: o projeto usa CSS puro e GSAP. Sugerir qualquer um deles é erro.
- Fontes fora das 7 oficiais (Inter, Roboto, Geist e afins).
- Efeitos de luz no verde (glow, neon, bloom, glitch, scanline).

Relacionado: [01-visao-arquitetural](01-visao-arquitetural.md), `CONTRIBUTING.md`.
