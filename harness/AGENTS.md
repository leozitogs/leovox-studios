# Harness · regras locais

Vale para quem mexe no próprio harness: papéis, skills, contratos, roteador, gerador, hooks e
evals. Soma-se ao `AGENTS.md` da raiz.

## Fonte e gerado

| Edite a fonte                                        | Gera                                |
| ---------------------------------------------------- | ----------------------------------- |
| `harness/roles/*.md` e `harness/agents/catalog.json` | `.claude/agents/*.md`               |
| `harness/agents/contrato-comum.md`                   | o fim de cada `.claude/agents/*.md` |
| `.agents/skills/<nome>/`                             | `.claude/skills/<nome>/`            |
| `AGENTS.md` (seções de regras e comandos)            | `.github/copilot-instructions.md`   |
| cada `AGENTS.md` de subpasta                         | o `CLAUDE.md` ao lado dele          |

Depois de editar uma fonte: `npm run harness:sync`, confira o diff dos gerados e rode
`npm run harness:check`.

## Regras

- Papel novo: arquivo em `harness/roles/`, entrada no catálogo (fase, domínios, caminhos,
  palavras-chave, evidência e o bloco `claude`) e `npm run agents:validate`. Revisor obrigatório
  nunca ganha escrita em produção.
- Skill nova: pasta com `SKILL.md` em `.agents/skills/`, `name` igual ao nome da pasta, em
  minúsculas e hífens, e `description` dizendo quando usar. Só `name` e `description` no
  frontmatter: campo de uma ferramenta só quebra as outras.
- Mudança em `AGENTS.md`, papel, skill, hook ou contrato se prova com eval (`npm run evals`), não
  com opinião. Regressão em tarefa que passava bloqueia a mudança.
- Hook de ferramenta é conveniência, não garantia: o que não pode passar fica também nos hooks de
  git (`.githooks/`) e no CI.
- Decisão que muda o harness ganha ADR em `docs/decisions/`.
- O `AGENTS.md` da raiz fica abaixo de 160 linhas e a soma dos `AGENTS.md` abaixo de 32 KiB.
