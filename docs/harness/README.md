# Harness de engenharia

O portfólio é software feito com IA sob direção humana. O harness é o que torna isso confiável:
transforma intenção em spec, spec em contrato executável, trabalho de agente em evidência
reproduzível, e faz isso igual em qualquer ferramenta (Claude Code, Codex, Gemini, Antigravity,
Cursor, Copilot).

## As seis partes

| Parte | Pergunta que responde | Onde |
| --- | --- | --- |
| Contexto | o que o agente sabe ao começar, e o que só lê quando precisa | `AGENTS.md`, `docs/harness/CONTEXTO.md` |
| Specs | o que vamos construir e quem aprovou este texto exato | `docs/specs/` |
| Contratos | como provar que ficou certo | `docs/scene-contracts/`, `harness/schemas/` |
| Execução | quem faz, em que ordem, dentro de que escopo | `harness/roles/`, `.agents/skills/`, `docs/plans/` |
| Prova | o que barra a entrega sem depender de opinião | `harness/browser/`, `tests/`, `scripts/`, CI |
| Avaliação | se o agente, o modelo ou o próprio harness melhorou ou piorou | `evals/`, `docs/harness/EVALUATION.md` |

## Fluxo

1. `leovox-sessao`: retomar o plano ativo ou começar do pedido.
2. `leovox-spec`: spec com critérios de ID; o PO aprova com `npm run spec:aprovar`.
3. Contrato da cena com os mesmos IDs e o modo de verificação de cada um.
4. `leovox-plano`: plano em `docs/plans/active/` com escopo de escrita, rota e passos.
5. `leovox-construir`: build estático, depois movimento, `npm run check:fast` a cada incremento.
6. `leovox-verificar`: portões, `spec:trace -- --strict` e revisão independente.
7. PO aprova a entrega e qualquer baseline nova ou alterada.

## Camadas de garantia

Cada camada pega o que a de cima deixa passar. Só as duas últimas valem para qualquer ferramenta.

| Camada | Exemplo | Alcance |
| --- | --- | --- |
| Instrução | `AGENTS.md`, papéis, skills | o agente pode ignorar |
| Fluxo | skills com passos e critérios de pronto | depende do agente seguir |
| Hook da ferramenta | `scripts/guard.mjs` via Claude, Codex e Gemini | só nas ferramentas com hook |
| Hook de git | `.githooks/pre-commit` e `pre-push` | qualquer ferramenta e humano, depois de `npm run harness:install` |
| CI | `.github/workflows/ci.yml` | incontornável no PR |

Regra de projeto: o que não pode passar nunca fica só nas camadas de cima.

## Níveis de validação

| Nível | Comando | Uso |
| --- | --- | --- |
| Rápido | `npm run check:fast` | laço local, alvo abaixo de 30 segundos |
| Entrega | `npm run validate` | antes de commit; o pre-push roda este |
| Browser principal | `npm run test:browser:chromium` | toda mudança visual, responsiva ou de movimento |
| Completo | `npm run test:browser` | antes de PR e em auditoria |
| Legado | `npm run smoke` | filme inteiro num Chromium real |

`check:fast` e `validate` incluem `harness:check` (o harness verificando a si mesmo) e
`spec:trace -- --strict` (todo critério automático com teste).

## Documentos

| Arquivo | Assunto |
| --- | --- |
| `CONTEXTO.md` | camadas de contexto, orçamento e ordem de autoridade |
| `FERRAMENTAS.md` | o que cada ferramenta lê e o que foi verificado |
| `PAPEIS.md` | catálogo de papéis, roteamento e handoff |
| `MOTION.md`, `VISUAL.md`, `ACCESSIBILITY.md`, `PERFORMANCE.md`, `SECURITY.md`, `FRONTEND.md` | contratos de engenharia por disciplina |
| `EVALUATION.md` | scorecard, benchmark e métricas |

## Evidências

O Playwright grava trace, screenshot e vídeo apenas em falha ou retry. O relatório fica em
`playwright-report/` e os artefatos brutos em `test-results/`. Esses diretórios não são versionados.

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

A API existe para teste e diagnóstico. Ela não substitui a jornada real com wheel, touch, teclado e
reverse.
