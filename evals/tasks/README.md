# Tarefas de avaliação

Cada tarefa mede se um agente, um modelo ou uma ferramenta resolve um problema real do portfólio
dentro das regras dele. O mesmo conjunto serve para comparar Claude Code, Codex, Gemini e
Antigravity, ou para provar que uma mudança no harness não piorou nada. Toda tarefa precisa ter
solução, ficar isolada, ser calibrada por humano e representar uma falha real ou um requisito útil.

## Formato

| Campo        | O que é                                                                            |
| ------------ | ---------------------------------------------------------------------------------- |
| `id`         | igual ao nome do arquivo                                                           |
| `tipo`       | `bug`, `feature`, `marca`, `movimento` ou `harness`                                |
| `origem`     | `historico` (minerada de uma correção real) ou `sintetica`                         |
| `base`       | commit de onde a tarefa parte                                                      |
| `pedido`     | o texto entregue ao agente, sem dica da solução                                    |
| `contexto`   | opcional; vai junto no pedido, então nunca revela a solução                        |
| `calibracao` | nota para quem calibra a tarefa; nunca chega ao agente                             |
| `oraculo`    | arquivos de teste copiados só na hora de avaliar (de `commit`, ou da árvore atual) |
| `avaliar`    | comandos que precisam passar; `{ "cmd", "espera": "falha" }` para o inverso        |
| `naoTocar`   | prefixos de caminho que o agente não pode mudar                                    |
| `proibido`   | atalhos que invalidam a solução, entregues ao agente como regra                    |

## Rodar

```bash
npm run evals -- listar
npm run evals -- preparar webgl-ausente
# abra a ferramenta em evals/.trabalho/webgl-ausente, rode npm ci e entregue o PEDIDO-EVAL.md
npm run evals -- avaliar webgl-ausente --ferramenta=codex --modelo=<modelo>
```

`preparar` exporta a base com `git archive`, sem histórico, para o agente não achar a correção no
log. O resultado vai para `evals/resultados/` (fora do Git) com comandos, tempo, diff e arquivos
fora do escopo. A nota de qualidade pela rubrica `evals/rubrics/frontend-scorecard.json` é do PO.

## Minerar uma tarefa nova

1. Ache uma correção que veio com teste (`git log -- harness/browser tests`).
2. `base` é o pai do commit; `oraculo.commit` é o commit; `oraculo.arquivos` são os testes dele.
3. Escreva o `pedido` como o PO descreveria o sintoma, sem citar a solução.
4. Rode `preparar` e `avaliar` sem mexer em nada: tem que **falhar**. Se passar, o oráculo não
   mede o problema.
