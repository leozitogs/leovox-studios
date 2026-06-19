# 4.2 Design de módulos

Estrutura real em `src/`.

## scenes/<Cena>/

Cada cena é uma pasta com `index.tsx` (composição e DOM) e `<cena>.css` (estilo
puro com tokens). Cenas: Hero, Manifesto, Pilares, SelectedProjects, CaseIndex,
Sobre, Contato, Footer. A 404 vive em `src/notfound/` com entry próprio.

## components/

Reutilizáveis e transversais: Header, Loader, Cursor, ContourField,
ErrorBoundary, ErrorHud.

## canvas/

`PersistentCanvas.tsx` (o R3F único e fixo) e `Totem.tsx` (o objeto que viaja no
canvas entre cenas).

## lib/

Runtime compartilhado, sem JSX:

- `gsap.ts`: registra e exporta gsap e ScrollTrigger.
- `lenis.ts`: instância única do smooth scroll, com `start` e `stop`.
- `barba.ts`: transições de rota.
- `reveal.ts`: barramento que desacopla o loader da entrada de cena.
- `errors.ts`: captura global de erro, rejeição e console.error.

## hooks/, data/ e styles/

Hooks tipados com cleanup e respeito a reduced-motion (ex `useReducedMotion`).
`data/projects.ts` guarda o conteúdo. `styles/` tem `tokens.css` (cores, fontes,
escala, z-index, durações) e `global.css` (reset e o palco).

## Regras de módulo

- Um componente por arquivo, PascalCase. Acima de 200 linhas é suspeito, refatore.
- Estilo por classe e variável de `tokens.css`, nunca hex solto fora da paleta.
- A animação de scroll mora junto da cena (ex `useHeroScroll`), não espalhada.

Relacionado: [03-interfaces](03-interfaces.md), [../03-arquitetura/01-visao-arquitetural](../03-arquitetura/01-visao-arquitetural.md).
