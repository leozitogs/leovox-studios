---
name: leovox-plano
description: Transforma uma spec aprovada do portfólio Leovox em plano de execução em docs/plans/active, com escopo de escrita, rota de especialistas, passos que dizem quando estão prontos e critérios do contrato. Use depois que o PO aprovar uma spec e antes de tocar em código, ou quando uma tarefa de manutenção tiver mais de um passo.
---
<!-- GERADO por npm run harness:sync a partir de .agents/skills/leovox-plano/SKILL.md. Edite a fonte, não este arquivo. -->

# Plano

Plano diz como fazer e o que prova que ficou feito. Ele é também a memória da tarefa: outra
ferramenta continua o trabalho lendo só ele.

## Pré-condições

- Spec em `aprovada` ou `em-build` (`npm run harness:check` confirma a aprovação). Sem spec, só
  manutenção que não muda comportamento; diga no plano por que não precisa de uma.
- Contrato existente quando é cena.

## Montar

1. Copie `docs/plans/_modelo.md` para `docs/plans/active/AAAA-MM-DD-<assunto>.md`.
2. Rode `npm run agents:route -- --task="<objetivo>"` e cole papéis, ordem e evidências em `Rota`.
3. `Escopo de escrita`: os caminhos (globs) que podem mudar. Pequeno de propósito. Tudo fora dele
   vira `Trabalho restante`.
4. `Passos`: no máximo oito, cada um cabe numa sessão e termina em "Pronto quando: <comando verde
   ou evidência>". Ordem da casa: assets e Visual Spec, build estático, movimento, microcopy,
   revisão independente.
5. `Critérios`: os IDs do contrato que o plano fecha, com o teste que vai provar cada um. Critério
   automático sem teste previsto é buraco no plano.
6. Peça ao PO o ok do plano por escrito antes de construir. Passe a spec para `em-build` só com
   esse ok.

## Regras

- Um plano ativo por branch. Dois planos não escrevem nos mesmos arquivos.
- Plano grande demais (mais de oito passos ou mais de uma cena) se divide.
- Decisão do PO durante o trabalho entra no plano na hora.

## Saída

Caminho do plano, a rota, o escopo de escrita e a pergunta de aprovação ao PO.
