# 7.3 Backup e recuperação

## Fonte da verdade

O código vive no GitHub (`leovox-studios`). Clonar do remoto recupera o projeto
inteiro. Lição de produção: nunca rodar operações de git pelo ambiente isolado
(corrompe o `.git`); o git é 100% da máquina do PO.

## Ativos fora do repo

A identidade (brand manual, tom de voz) e os masters (mascote em mov, fontes
trial) vivem na pasta de identidade e na pasta Motion, fora do repo.
Recomendação de backup: cópia versionada desses diretórios (nuvem ou disco
externo), porque não estão no GitHub.

## DECISOES.md

É local e fora do versionamento. Recomendação: backup manual junto dos ativos de
identidade, já que é o histórico canônico de decisões.

## Recuperação rápida

1. `git clone` do remoto.
2. `npm install`.
3. Repor os assets de `public/` a partir das pastas de identidade e Motion.
4. `npm run validate` para confirmar.

Relacionado: [01-deploy](01-deploy.md), [02-monitoramento](02-monitoramento.md).
