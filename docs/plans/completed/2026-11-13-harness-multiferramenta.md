# Plano concluído: harness multiferramenta, orientado por spec

## Spec

Mudança de harness, decidida no ADR `docs/decisions/0002-harness-multiferramenta-por-spec.md`
(status proposto, aguarda o PO). Não muda comportamento do site.

## Objetivo

O mesmo harness funcionar em Claude Code, Codex, Gemini, Antigravity, Cursor e Copilot, com specs
de ciclo de vida, rastreio spec → contrato → teste, garantias que não dependem de ferramenta e
evals para comparar modelos.

## Escopo de escrita

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `src/scenes/AGENTS.md`, `harness/AGENTS.md`
- `harness/roles/`, `harness/agents/`, `harness/lib/`, `harness/schemas/`, `.agents/skills/`
- gerados: `.claude/agents/`, `.claude/skills/`, `.github/copilot-instructions.md`, `CLAUDE.md` das
  subpastas
- `.claude/settings.json`, `.codex/hooks.json`, `.gemini/settings.json`, `.githooks/`
- `scripts/` (novos: `harness-sync`, `harness-check`, `spec-trace`, `spec-aprovar`, `evals`, `guard`)
- `docs/specs/`, `docs/plans/_modelo.md`, `docs/harness/`, `docs/decisions/0002-*`,
  `docs/scene-contracts/`
- `evals/tasks/`, `tests/marca-css.test.ts`, títulos de testes existentes (só os IDs)
- `package.json` (scripts), `.gitignore`, `.prettierignore`, `.gitattributes`

## Entregue

- Papéis movidos de `.claude/agents/` para `harness/roles/`, neutros; metadados do Claude no
  catálogo; regras comuns em `harness/agents/contrato-comum.md`.
- Sete skills no padrão Agent Skills: sessão, spec, plano, construir, verificar, bug de movimento,
  eval.
- Gerador com modo `--check`, que acusa gerado divergente ou órfão.
- `harness:check`: orçamento de contexto, caminhos citados, sincronia, ciclo das specs, planos
  ativos, evals e termos privados de uma lista local.
- Specs: briefings da Cena 3 e da Cena 7 migrados para `docs/specs/` com frontmatter; aprovação
  presa ao hash do corpo; `spec:aprovar` só para o PO.
- Contratos com critérios de ID e modo de verificação; 12 testes marcados; `spec:trace`.
- Guarda única para os hooks de Claude, Codex e Gemini; hooks de git; `.gitattributes` com LF.
- Brand lint de CSS e duas tarefas de eval (uma minerada do histórico, uma armadilha de marca).

## Evidências

- `npm run validate`: travessão, harness, 2 contratos com 18 critérios, 15 agentes, rastreio 12/12,
  tipos, lint, formato, 42 testes de unidade e build.
- `npm run test:browser:chromium`: 52 aprovados e 27 skips deliberados da matriz, em 4,7 min.
- Guarda: bloqueia `--no-verify`, edição de gerado (inclusive pelo `apply_patch` do Codex) e deixa
  passar comando comum; evento ilegível passa.
- Brand lint: pega as cinco violações plantadas num CSS de teste e passa limpo no código real.
- Eval `cta-chamativo` preparado e avaliado sem trabalho: não passa, como deve.
- Termos privados: nenhum nos 280 arquivos versionados.

## Estado para a próxima sessão

- Onde parou: entrega completa no branch `harness/multiferramenta`, sem push.
- Próximo passo exato: o PO revisa o ADR 0002 e decide sobre push e PR.
- Decisões pendentes do PO: aceitar o ADR 0002 (inclui a regra nova de Git); rodar
  `npm run harness:install` no clone principal; criar a lista local de termos privados nele.
- Branch e último commit: `harness/multiferramenta`.

## Riscos e trabalho restante

- Hooks de Codex e Gemini configurados pela documentação, sem rodar numa sessão real dessas
  ferramentas. Primeiro uso: confirmar que a guarda dispara.
- Antigravity, Cursor e Copilot não têm hook aqui; dependem dos hooks de git e do CI.
- Specs migradas sem IDs nos critérios; a próxima versão de cada uma deve adotar IDs.
- O benchmark alvo do `docs/harness/EVALUATION.md` tem 30 tarefas; há 2.
