# CLAUDE.md · ponte para o Claude Code

As instruções deste repositório são independentes de ferramenta e vivem no `AGENTS.md`, importado
abaixo. Este arquivo só acrescenta o que é do Claude Code.

@AGENTS.md

## Específico do Claude Code

- **Subagentes:** os 15 papéis estão em `.claude/agents/`, gerados de `harness/roles/`. Despache
  pelo nome (`leovox-brand-guard`, `leovox-scroll-storyteller`...) com o contexto mínimo, o
  resultado esperado e os arquivos que o papel pode tocar. Revisores sempre com contexto novo.
- **Skills:** `.claude/skills/` é cópia gerada de `.agents/skills/`. Chame por `/leovox-sessao`,
  `/leovox-spec`, `/leovox-plano`, `/leovox-construir`, `/leovox-verificar`,
  `/leovox-bug-de-movimento` e `/leovox-eval`.
- **Hooks:** `.claude/settings.json` liga `scripts/guard.mjs` antes e depois das ferramentas. Ele
  bloqueia edição em arquivo gerado, `--no-verify`, push forçado, deploy e aprovação de spec, e
  avisa travessão logo depois da edição. Permissões pessoais ficam em `.claude/settings.local.json`.
- **Preview:** `.claude/launch.json` sobe o dev server `leovox-dev` na porta 5173.
- **Memória automática** do Claude Code fica presa a uma máquina e a uma conta. Estado de tarefa vai
  para o plano ativo, nunca só para ela.
