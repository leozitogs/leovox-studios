# ADR 0002: harness multiferramenta, orientado por spec

- Status: proposto (aguarda o PO)
- Data: 2026-11-13

## Contexto

O harness do ADR 0001 provava cenas no browser, mas o resto estava preso ao Claude Code: os papéis
viviam só em `.claude/agents/`, o `CLAUDE.md` repetia e contradizia o `AGENTS.md`, as specs de
produto estavam vazias (os briefings faziam esse papel sem ciclo de vida), os evals não tinham
tarefa e nenhuma regra valia fora da ferramenta. O PO quer desenvolver com Codex, Gemini e
Antigravity também, sem perder garantia na troca.

## Decisão

1. **Uma fonte, gerados por ferramenta.** `AGENTS.md` é canônico. Papéis em `harness/roles/`,
   fluxos em `.agents/skills/` (padrão Agent Skills). `npm run harness:sync` gera o que cada
   ferramenta exige (`.claude/agents/`, `.claude/skills/`, `CLAUDE.md` das subpastas,
   `.github/copilot-instructions.md`), e o `harness:check` falha com qualquer divergência.
2. **Contexto em camadas com orçamento medido** (`docs/harness/CONTEXTO.md`): raiz até 160 linhas,
   soma dos `AGENTS.md` abaixo de 32 KiB, regra local descendo para a pasta.
3. **Spec com ciclo de vida e aprovação presa ao conteúdo.** `docs/specs/` substitui os briefings
   soltos e o `docs/product-specs/` vazio. Aprovar grava o hash do corpo; editar depois caduca a
   aprovação. Só o PO aprova, e os hooks bloqueiam o comando para agentes.
4. **Rastreio spec → contrato → teste.** Critérios com ID (`PIL-04`) e modo de verificação; teste cita
   o ID no título; `spec:trace -- --strict` entra no `check:fast` e no `validate`.
5. **Plano como memória da tarefa**, com escopo de escrita, passos que dizem quando estão prontos e
   a seção `Estado para a próxima sessão`, para trocar de ferramenta no meio.
6. **Garantia em camadas.** Uma guarda só (`scripts/guard.mjs`) atende aos hooks de Claude, Codex e
   Gemini. O que não pode passar fica também nos hooks de git (`.githooks/`) e no CI, porque hook
   de ferramenta não atravessa ferramenta.
7. **Evals como código**, com tarefa minerada do histórico (oráculo = testes da correção real,
   copiados só na hora de avaliar) e tarefa sintética de marca. Servem para comparar ferramentas e
   para provar que mudança no harness não piorou nada.
8. **Brand lint de CSS** (`tests/marca-css.test.ts`): sombra de texto desfocada, halo verde,
   animação de glow, `transition: all` e fonte fora do sistema falham no teste.
9. **Git.** O `CLAUDE.md` antigo dizia que agente nunca commita; na prática os agentes commitavam
   em branch com o ok do PO. A regra passa a ser: commit só em branch de trabalho e quando o PO
   pedir; push, PR, merge, deploy e aprovação de spec só com o ok dele.

## Consequências

- Editar papel ou skill exige `npm run harness:sync`; esquecer quebra o CI, de propósito.
- Os hooks de Codex e Gemini estão configurados conforme a documentação, mas ainda não rodaram
  numa sessão real dessas ferramentas. A garantia efetiva fora do Claude são os hooks de git, que
  dependem de o PO rodar `npm run harness:install` em cada clone.
- O hash de aprovação barra engano, não má-fé: o diff do PR continua sendo revisado pelo PO.
- As specs migradas (Pilares e Sobre) mantêm os critérios sem ID; nelas o contrato é a fonte dos
  critérios. Specs novas usam IDs desde o início.
