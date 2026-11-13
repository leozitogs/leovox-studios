# Plano: título curto

## Spec

`docs/specs/<id>.md` (status `aprovada` ou `em-build`) e contrato `docs/scene-contracts/<id>.contract.json`.
Trabalho de manutenção sem spec diz aqui por que não precisa de uma.

## Objetivo

Uma ou duas frases: o que fica verdadeiro quando o plano terminar.

## Escopo de escrita

Só estes caminhos podem mudar. O resto vira item em `Trabalho restante`.

- `src/scenes/Nome/**`
- `harness/browser/nome.spec.ts`

## Rota

Saída de `npm run agents:route -- --task="..."`: papéis, ordem e evidência que cada um deve.

## Passos

Cada passo cabe numa sessão e diz quando está pronto.

- [ ] 1. Build estático. Pronto quando: `npm run check:fast` verde e captura em 1440x900.
- [ ] 2. Movimento. Pronto quando: `npm run test:browser:chromium` verde com os critérios marcados.
- [ ] 3. Revisão independente (marca e acessibilidade). Pronto quando: os dois handoffs sem bloqueio.

## Critérios

Os IDs do contrato que este plano promete fechar, com o teste que prova cada um.

## Evidências

Comandos rodados e resultados, preenchidos ao longo do trabalho.

## Estado para a próxima sessão

Atualize ao parar, mesmo no meio. Outra ferramenta ou outro modelo continua daqui sem a conversa.

- Onde parou:
- Próximo passo exato:
- Decisões pendentes do PO:
- Branch e último commit:

## Riscos e trabalho restante
