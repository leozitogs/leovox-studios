---
name: leovox-construir
description: Executa um passo do plano ativo do portfólio Leovox (React, Vite, TypeScript, CSS puro, GSAP, ScrollTrigger, Lenis) dentro do escopo de escrita, com laço curto de verificação e testes que citam os IDs dos critérios. Use para implementar cena, componente, animação ou correção já planejada.
---

# Construir

## Antes da primeira linha

- Leia o plano ativo e o passo da vez. Sem plano, pare e use `leovox-plano`.
- Leia o papel dono do domínio em `harness/roles/` (frontend, animação, scroll, transições, 3D,
  shader, vídeo, cases) e o contrato comum em `harness/agents/contrato-comum.md`. Onde houver
  subagentes (Claude Code), despache o papel; onde não houver, assuma o papel você mesmo.
- Leia o `AGENTS.md` da pasta que vai tocar (`src/scenes/AGENTS.md` para cenas).
- Stack fechada: nada de Tailwind, Framer Motion ou dependência nova sem o PO.

## Laço

1. Escreva só dentro do `Escopo de escrita`.
2. Build estático primeiro; movimento numa segunda passada.
3. Teste novo cita o critério no título: `test('[PIL-04] parado no meio ...')`.
4. `npm run check:fast` a cada incremento coerente (alvo: abaixo de 30 segundos).
5. Mudança visual, responsiva ou de movimento: `npm run test:browser:chromium`.
6. Bug de movimento: use a skill `leovox-bug-de-movimento` antes de mexer no código.
7. Marque o passo no plano e registre a evidência.

## Pare e pergunte ao PO quando

- a spec não responde uma dúvida estética;
- o passo exige tocar fora do escopo;
- um teste existente precisa mudar de expectativa (isso muda o contrato);
- uma baseline visual precisa ser criada ou trocada.

## Saída

O handoff do contrato comum (`summary`, `evidence`, `risks`, `followUps`) e o plano atualizado.
