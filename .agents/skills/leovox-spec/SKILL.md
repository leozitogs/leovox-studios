---
name: leovox-spec
description: Escreve ou revisa a spec (briefing) de uma cena, componente, conteúdo ou mudança do harness Leovox, com critérios de aceite com ID e decisões em aberto para o PO, e deriva o contrato executável depois da aprovação. Use antes de qualquer código de comportamento novo, quando o PO pedir "briefing", "spec", "proposta" ou "cena nova".
---

# Spec primeiro

Spec diz o quê e por quê. Não escreva código nesta skill.

## 1. Entender antes de propor

- Leia `docs/PIPELINE.md` (papel da cena no filme), as specs vizinhas em `docs/specs/` e o
  `CONTRIBUTING.md` (marca e leis de animação).
- Confirme assets com o papel `leovox-asset-curator` (`harness/roles/leovox-asset-curator.md`).
- Direção visual nova passa pelo papel `leovox-art-director`, que devolve a Visual Spec.
- Pergunte ao PO o que só ele sabe (conteúdo, clientes, aprovações). Não invente fato, número nem
  depoimento.

## 2. Escrever

1. Copie `docs/specs/_modelo.md` para `docs/specs/<id>.md`. O `id` é o nome do arquivo
   (`cena-08-contato`).
2. `status: rascunho` enquanto escreve; `proposta` quando estiver pronta para o PO.
3. Critérios de aceite com ID estável e prefixo da cena (`[CON-01]`). Cada critério é observável:
   um teste ou o QA do PO responde sim ou não.
4. Toda escolha que é do PO vai em `Decisões em aberto pro PO`, com opções e recomendação.
5. Sem travessão, sem clichê vazio, sem número sem prova.

## 3. Aprovar (não é você)

Só o PO aprova, com `npm run spec:aprovar -- <id>`. O hook das ferramentas bloqueia esse comando
para agentes. A aprovação grava o hash do corpo: se o texto mudar depois, o `harness:check` falha
até o PO aprovar de novo.

## 4. Contrato, depois da aprovação

Para `tipo: cena`, crie `docs/scene-contracts/<cena>.contract.json` seguindo
`harness/schemas/scene-contract.schema.json`:

- `spec` aponta a spec; `acceptance` repete os mesmos IDs da spec;
- `verify` de cada critério é `browser`, `unit` ou `manual` (manual só quando nenhum teste
  consegue julgar, como gosto visual);
- `forbidden` lista o que a cena não pode ter.

Preencha `contrato:` no frontmatter da spec. `npm run contracts` e `npm run harness:check` validam.

## Saída

Spec em `proposta`, decisões em aberto listadas, e a pergunta direta ao PO sobre cada uma.
