# Harness de engenharia frontend

Este harness transforma intenção visual em contrato, execução reproduzível e evidência de browser. A arquitetura segue quatro ciclos conectados: orientação do agente, implementação isolada, avaliação no browser e governança das referências.

## Fluxo

1. Rodar `npm run agents:route` para selecionar competências e evidências.
2. Criar um plano em `docs/plans/active/` e declarar o contrato afetado.
3. Implementar em branch ou worktree própria.
4. Rodar `npm run check:fast` a cada incremento coerente.
5. Rodar os projetos Playwright exigidos pelo risco da mudança.
6. Anexar o relatório HTML, screenshots e traces quando houver falha.
7. Rodar `npm run validate` antes do commit.
8. Pedir ao Product Owner a aprovação de qualquer baseline novo ou alterado.

## Níveis de validação

| Nível | Comando | Uso |
| --- | --- | --- |
| Rápido | `npm run check:fast` | Laço local, alvo abaixo de 30 segundos |
| Browser principal | `npm run test:browser:chromium` | Toda mudança visual, responsiva ou de movimento |
| Completo | `npm run test:browser` | Antes de PR e em auditoria |
| Legado | `npm run smoke` | Compatibilidade durante a migração |

O catálogo de especialistas, as regras de roteamento e o contrato de handoff ficam em `docs/harness/AGENTS.md`.

## Evidências

O Playwright grava trace, screenshot e vídeo apenas em falha ou retry. O relatório fica em `playwright-report/` e os artefatos brutos em `test-results/`. Esses diretórios não são versionados.

## API determinística

Abra a aplicação com `?harness=1`. Quando o carregamento terminar, `window.__LEOVOX_HARNESS__` expõe:

- `ready()`
- `listScenes()`
- `enterScene(id)`
- `setProgress(id, progress)`
- `settle()`
- `getSceneState(id)`
- `getActiveAnimations()`
- `getScrollTriggers()`
- `collectFrameMetrics(durationMs)`

A API existe para teste e diagnóstico. Ela não substitui a jornada real com wheel, touch, teclado e reverse.
