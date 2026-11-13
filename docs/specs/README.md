# Specs

Toda mudança de produto nasce aqui: cena, componente com comportamento próprio, conteúdo ou mudança
no harness. A spec diz **o quê e por quê**; o contrato diz **como provar**; o plano diz **como
fazer**. Código sem spec aprovada é rascunho.

## Cadeia

```
spec (docs/specs/)  →  contrato (docs/scene-contracts/)  →  plano (docs/plans/active/)  →  testes
  o quê e por quê       critérios com ID e verificação     escopo, passos, evidência      [ID] no título
```

| Elo | Quem escreve | Quem aprova | Portão |
| --- | --- | --- | --- |
| Spec | agente com a skill `leovox-spec`, ou o PO | **PO**, com `npm run spec:aprovar` | `harness:check` |
| Contrato | agente, a partir da spec aprovada | PO, junto da spec | `contracts` |
| Plano | agente com a skill `leovox-plano` | PO, por escrito na conversa | revisão |
| Testes | builder | revisor independente | `spec:trace -- --strict` |

## Ciclo de vida

`rascunho` → `proposta` → `aprovada` → `em-build` → `entregue` (ou `substituida`)

| Status | Significa | O harness exige |
| --- | --- | --- |
| `rascunho` | ideia em escrita | frontmatter válido |
| `proposta` | pronta para o PO decidir | seção de decisões em aberto |
| `aprovada` | o PO aprovou este conteúdo exato | `aprovada_em` e `aprovacao` iguais ao hash do corpo |
| `em-build` | há plano ativo construindo | o acima, mais `contrato` existente quando `tipo: cena` |
| `entregue` | critérios provados | o acima, e todo critério automático com teste |
| `substituida` | outra spec tomou o lugar | nada |

**A aprovação caduca quando o corpo muda.** O `aprovacao` é o hash do texto aprovado; editar a spec
depois disso faz o `harness:check` falhar até o PO aprovar de novo. Mudança de spec aprovada se
faz assim: status volta para `proposta`, o texto muda, o PO aprova.

Isso é uma barreira contra engano, não contra má-fé: um agente pode recalcular o hash à mão. A
garantia final continua sendo o PO revisando o diff do PR.

## Critérios com ID

Na seção `## Critérios de aceite`, cada critério novo leva um ID estável, com o prefixo da cena:

```
- [SOB-01] A luz volta do verde para o off-white como função pura do progresso.
```

O contrato repete os mesmos IDs com o modo de verificação (`browser`, `unit` ou `manual`), e cada
teste que prova um critério cita o ID no título. Quando a spec usa IDs, o `harness:check` exige que
spec e contrato tenham o mesmo conjunto. As duas specs migradas dos briefings antigos não usam IDs;
nelas o contrato é a fonte dos critérios.

## Modelo

Copie `_modelo.md`. O nome do arquivo é o `id` da spec (`cena-07-sobre.md`).
