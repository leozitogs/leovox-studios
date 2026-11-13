---
name: leovox-eval
description: Prepara, roda e avalia tarefas de avaliação do portfólio Leovox para comparar modelos e ferramentas (Claude Code, Codex, Gemini, Antigravity) ou provar que uma mudança no harness, num papel ou numa skill não piorou o resultado. Use quando o PO pedir para medir, comparar modelos, testar o harness ou minerar uma tarefa nova do histórico.
---

# Eval

Mudança no harness (AGENTS.md, papel, skill, hook, contrato) se prova com tarefa, não com opinião.

## Rodar uma tarefa

```bash
npm run evals -- listar
npm run evals -- preparar <id>
```

1. `preparar` cria `evals/.trabalho/<id>` a partir da base, sem histórico do Git.
2. Rode `npm ci` nessa pasta.
3. Abra a ferramenta avaliada nessa pasta, numa sessão nova, e entregue o `PEDIDO-EVAL.md` como
   pedido, sem ajuda extra.
4. Quando ela terminar:

```bash
npm run evals -- avaliar <id> --ferramenta=<claude|codex|gemini|antigravity> --modelo=<nome>
```

O oráculo entra só agora; o resultado vai para `evals/resultados/`.

## Comparar

- Rode cada tarefa mais de uma vez por ferramenta quando o objetivo é medir capacidade (pass@1 e
  pass@3, como em `docs/harness/EVALUATION.md`).
- Compare também o que o número não mostra: arquivos fora do escopo, tamanho do diff, se o agente
  pediu ao PO o que devia pedir.
- A nota de qualidade pela rubrica `evals/rubrics/frontend-scorecard.json` é do PO.

## Minerar tarefa nova

Siga `evals/tasks/README.md`. A regra que não pode faltar: com a base intacta, `avaliar` tem que
falhar. Tarefa que passa sem trabalho não mede nada.
