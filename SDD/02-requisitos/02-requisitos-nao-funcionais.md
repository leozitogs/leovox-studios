# 2.2 Requisitos não funcionais

## Performance (RNF-P)

- Lighthouse Performance maior ou igual a 90 no desktop. LCP abaixo de 1.8s. CLS abaixo de 0.1. FPS de animação maior ou igual a 55.
- Bundle JS inicial enxuto; Three.js e cenas pesadas entram em lazy. O vídeo do mascote só decodifica quando visível.

## Acessibilidade (RNF-A)

- WCAG 2.1 AA. Contraste validado: verde sobre off-white não serve para texto (o verde vira fundo ou borda).
- `prefers-reduced-motion` em toda cena, caindo num estado estático sem pin.
- Foco visível, semântica correta, e canvas decorativo com `aria-hidden`.

## Marca (RNF-M)

- Sem travessão em nenhum arquivo (`npm run check:travessao`). Acentuação pt-BR correta na copy.
- Paleta fechada: `#000000`, `#222222`, `#19BC00`, `#FBFBFB`, `#FFFFFF`, mais o pastel `#C5F49D`. Branco puro é liberado.
- Verde só chapado; banido glow, neon, bloom, glitch e scanline. Corte branco ou reload visível é proibido.
- Apenas as 7 fontes oficiais, com exceção pontual aprovada pelo PO (por exemplo Brush Up na 404).

## Compatibilidade e manutenção

- Alvo desktop em Chromium e Firefox atuais; a v1 não garante mobile.
- TypeScript estrito; componente acima de 200 linhas é suspeito; CSS puro com tokens.
- O portão `npm run validate` passa antes de todo commit, e o CI repete e roda o smoke.

Relacionado: [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md), `CONTRIBUTING.md`.
