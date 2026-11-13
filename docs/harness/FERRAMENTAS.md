# Ferramentas de IA neste repositório

Uma fonte, várias ferramentas. Esta tabela diz o que cada uma lê aqui. Levantado na documentação
oficial em 13/11/2026; a coluna "Verificado" separa o que foi rodado de verdade do que só foi
configurado conforme a documentação.

## Contexto e skills

| Ferramenta | Instruções | Skills | Papéis | Verificado |
| --- | --- | --- | --- | --- |
| Claude Code | `CLAUDE.md` importa `AGENTS.md`; `CLAUDE.md` gerados nas subpastas | `.claude/skills/` (cópia gerada) | subagentes em `.claude/agents/` (gerados) | sim |
| Codex | `AGENTS.md` da raiz até a pasta de trabalho, o mais próximo vence | `.agents/skills/` | lê `harness/roles/<id>.md` | só configuração |
| Gemini CLI | `AGENTS.md` e `GEMINI.md` via `.gemini/settings.json`, inclusive de subpastas | `.agents/skills/` | lê `harness/roles/<id>.md` | só configuração |
| Antigravity | `AGENTS.md` e `GEMINI.md` da raiz (não carrega subpastas) | `.agents/skills/` | lê `harness/roles/<id>.md` | só configuração |
| Cursor | `AGENTS.md`, inclusive aninhados | `.agents/skills/` (também vê `.claude/skills/`) | lê `harness/roles/<id>.md` | só configuração |
| Copilot | `AGENTS.md` no agente de nuvem, CLI e VS Code; `.github/copilot-instructions.md` (gerado) no github.com | `.agents/skills/` | lê `harness/roles/<id>.md` | só configuração |

Observações:

- O Claude Code só lê `AGENTS.md` sozinho quando não existe `CLAUDE.md`. Por isso o `CLAUDE.md`
  importa o `AGENTS.md` com `@AGENTS.md`, e não o copia.
- O `GEMINI.md` não importa o `AGENTS.md`: o Antigravity já lê os dois, e o Gemini CLI também,
  pelo `context.fileName`. Importar duplicaria o conteúdo.
- O Gemini CLI foi substituído pelo Antigravity CLI em junho de 2026 para parte dos planos. A
  configuração do Gemini CLI fica para quem ainda o usa.
- Cursor e Copilot enxergam `.agents/skills/` e `.claude/skills/`, então podem listar as skills
  duas vezes. É o mesmo conteúdo; escolha qualquer uma.

## Hooks

Todos chamam o mesmo `scripts/guard.mjs`. Ele bloqueia (saída 2) edição de arquivo gerado, edição
da lista local de termos privados, `--no-verify`, push forçado, `reset --hard`, `git clean -f`,
deploy ou segredo da Cloudflare e `spec:aprovar`; e avisa travessão logo depois de uma edição.
Evento em formato desconhecido passa, para um hook mal lido nunca travar a ferramenta.

| Ferramenta | Arquivo | Eventos | Observação |
| --- | --- | --- | --- |
| Claude Code | `.claude/settings.json` | `PreToolUse`, `PostToolUse` | ativo ao abrir o projeto |
| Codex | `.codex/hooks.json` | `PreToolUse`, `PostToolUse` | só em projeto confiável e depois de aprovar em `/hooks` |
| Gemini CLI | `.gemini/settings.json` | `BeforeTool`, `AfterTool` | nomes de ferramenta `run_shell_command`, `write_file`, `replace` |
| Antigravity, Cursor, Copilot | nenhum | | a garantia é o hook de git e o CI |

## Garantia que não depende de ferramenta

```bash
npm run harness:install
```

Liga `.githooks/` neste clone. O `pre-commit` roda travessão, `harness:check` e contratos; o
`pre-push` roda o `validate` inteiro. O CI repete tudo e acrescenta o browser.

## Trocar de ferramenta no meio de uma tarefa

1. Na ferramenta que sai: skill `leovox-sessao`, parte "Ao parar".
2. Na que entra: skill `leovox-sessao`, parte "Ao começar".

O que atravessa a troca é só o repositório: plano ativo, spec, contrato, commits. Nada da
conversa.

## Comparar ferramentas e modelos

`npm run evals -- preparar <id>`, rode a ferramenta na pasta preparada e
`npm run evals -- avaliar <id> --ferramenta=<nome> --modelo=<nome>`. Detalhes na skill `leovox-eval`.
