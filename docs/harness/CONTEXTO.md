# Engenharia de contexto

Contexto é orçamento. Tudo que entra em toda sessão compete com a tarefa pela atenção do modelo, e
tudo que fica de fora precisa ser achável na hora certa. O harness divide o contexto em quatro
camadas e mede as duas primeiras.

## Camadas

| Camada | Quando entra | O que tem | Onde | Orçamento |
| --- | --- | --- | --- | --- |
| 0 · Sempre | toda sessão, em toda ferramenta | identidade, regras que não regridem, protocolo, comandos, mapa | `AGENTS.md` | até 160 linhas |
| 1 · Por pasta | quando o agente toca a pasta | regras locais de cena e de harness | `src/scenes/AGENTS.md`, `harness/AGENTS.md` | soma de todos abaixo de 32 KiB |
| 2 · Sob demanda | quando o fluxo pede | skills, papéis, specs, contratos, docs de disciplina | `.agents/skills/`, `harness/roles/`, `docs/` | skill abaixo de 500 linhas |
| 3 · Estado | ao retomar trabalho | plano ativo, estado das cenas, decisões | `docs/plans/active/`, `docs/PIPELINE.md`, `docs/DECISOES.md` | o plano diz onde parou em 4 linhas |

O `harness:check` falha se a camada 0 ou a soma da camada 1 passarem do orçamento. O limite de
32 KiB é o padrão do Codex para a soma dos `AGENTS.md`; acima disso ele corta o que sobra.

## Regras de escrita

- **Camada 0 diz o que nunca muda e aponta o resto.** Se uma regra vale só para uma pasta, ela desce
  para o `AGENTS.md` da pasta. Se é procedimento, vira skill. Se é referência, vira doc.
- **Uma fonte por fato.** Ponte de ferramenta (`CLAUDE.md`, `GEMINI.md`) não repete regra: aponta
  o `AGENTS.md` e diz só o que é daquela ferramenta.
- **Gerado não se edita.** Quando uma ferramenta exige formato próprio (subagentes do Claude, pasta
  de skills do Claude, instruções do Copilot), o arquivo sai de `npm run harness:sync` e o
  `harness:check` acusa divergência.
- **Skill se descreve pelo gatilho.** A `description` diz quando usar, porque é só ela que o
  modelo vê até decidir abrir a skill.
- **Estado se escreve, não se lembra.** Memória de ferramenta é presa a máquina e conta. O plano
  ativo é a memória da tarefa; o `docs/PIPELINE.md`, a do projeto.
- **Todo caminho citado existe.** O `harness:check` confere cada caminho entre crases nos
  `AGENTS.md`.

## Ordem de autoridade

Quando duas fontes discordam, vale a primeira desta lista:

1. palavra do PO na sessão;
2. spec aprovada (com o hash de aprovação válido);
3. contrato da cena;
4. ADR (`docs/decisions/`) e registro criativo (`docs/DECISOES.md`, local);
5. `AGENTS.md` e os aninhados;
6. demais docs. O código vence o SDD, e o SDD se atualiza.

Divergência achada vira correção na fonte de menor autoridade, no mesmo trabalho, ou item de
`followUps`.

## Termos privados

O repositório é público. Nomes de projetos e clientes sob sigilo nunca entram nele, nem em
comentário. O `harness:check` lê uma lista local em `.harness/local/termos-privados.txt` (fora do Git,
uma expressão por linha) e falha se algum arquivo versionado a contiver. A lista existe só na
máquina do PO; no CI, a checagem é pulada.
