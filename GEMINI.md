# GEMINI.md · ponte para Gemini CLI e Antigravity

As instruções deste repositório vivem no `AGENTS.md`. O Antigravity lê `AGENTS.md` e este arquivo
sozinho; o Gemini CLI lê os dois porque `.gemini/settings.json` declara
`context.fileName: ["AGENTS.md", "GEMINI.md"]`. Por isso este arquivo não importa o `AGENTS.md`:
importar faria o conteúdo entrar duas vezes.

## Específico de Gemini e Antigravity

- **Skills:** os fluxos estão em `.agents/skills/`, lidos pelos dois. Comece por `leovox-sessao`.
- **Papéis:** não há subagente por arquivo aqui. Quando um fluxo mandar usar um papel, leia
  `harness/roles/<id>.md` e o `harness/agents/contrato-comum.md` e assuma o papel. Para revisar, abra
  uma conversa nova ou releia só o diff, sem o histórico da construção.
- **Regras por pasta:** o Antigravity não carrega `AGENTS.md` de subpastas. Antes de tocar uma cena,
  leia `src/scenes/AGENTS.md`; antes de tocar o harness, `harness/AGENTS.md`.
- **Hooks:** `.gemini/settings.json` liga `scripts/guard.mjs` em `BeforeTool` e `AfterTool` no
  Gemini CLI. No Antigravity a garantia são os hooks de git (`npm run harness:install`) e o CI.
- **Estado:** o plano ativo em `docs/plans/active/` é a memória da tarefa, não o histórico do chat.
