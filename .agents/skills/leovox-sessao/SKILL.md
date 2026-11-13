---
name: leovox-sessao
description: Abre e fecha uma sessão de trabalho no portfólio Leovox e faz a passagem entre ferramentas, modelos ou contas (Claude Code, Codex, Gemini, Antigravity). Use no começo de qualquer tarefa, ao parar no meio, ao trocar de ferramenta e quando o PO disser "continua de onde parou".
---

# Sessão e passagem

O estado do trabalho vive no repositório, nunca na memória de uma ferramenta. Quem chega depois
(outro modelo, outra ferramenta, você amanhã) continua só com o que está escrito aqui.

## Ao começar

1. `git status -sb` e `git log --oneline -5`: branch, sujeira e último commit.
2. Leia `docs/plans/active/`. Se houver plano, a seção `Estado para a próxima sessão` diz onde
   parou e qual é o próximo passo exato. Continue dali; não replaneje sem motivo novo.
3. Leia a linha da cena em `docs/PIPELINE.md` e a spec dela em `docs/specs/`.
4. Rode `npm run harness:check`. Aviso de hooks não instalados: peça ao PO
   `npm run harness:install`.
5. Sem plano ativo e com pedido novo: siga a skill `leovox-spec` (comportamento novo) ou
   `leovox-plano` (spec já aprovada).

## Durante

- Atualize o plano quando um passo fechar, não no fim.
- Decisão do PO na conversa vai para o plano na hora, com a data. Decisão que muda regra de marca,
  contrato, agente ou CI ganha ADR em `docs/decisions/`.

## Ao parar (mesmo no meio)

1. Preencha `Estado para a próxima sessão` no plano ativo:
   - onde parou;
   - próximo passo exato (comando ou arquivo);
   - decisões pendentes do PO;
   - branch e último commit.
2. Registre em `Evidências` os comandos rodados e o resultado.
3. `npm run check:fast`. Se falhar, escreva a falha no plano em vez de esconder.
4. Proponha a mensagem de commit (inglês, imperativo, sem prefixo). Commit só em branch de trabalho
   e quando o PO pedir; push, PR, merge e deploy só com o ok dele.

## Ao terminar

Todos os critérios do plano provados: mova o plano para `docs/plans/completed/`, atualize a linha da
cena no `docs/PIPELINE.md` e, se a spec fechou, peça ao PO para passar o status para `entregue`.

## Trocando de ferramenta

Nada além do repositório atravessa a troca. Antes de sair, faça "Ao parar". Ao entrar na ferramenta
nova, faça "Ao começar". Diferenças entre as ferramentas: `docs/harness/FERRAMENTAS.md`.
