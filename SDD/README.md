# SDD · Leovox Studios (portfólio SEM CORTE)

> Software Design Document do portfólio web da Leovox Studios.
> Documento vivo: acompanha o código, não o substitui. Onde divergir do
> código, o código vence e o SDD é atualizado.

## Objetivo

Registrar como o portfólio é desenhado e construído: visão, requisitos,
arquitetura, design detalhado, segurança, testes e operação. Serve pra quem
entra no projeto entender as decisões sem ler todo o código, e pra defender as
escolhas técnicas (o repositório é público, então o SDD também é prova de
processo).

## Escopo

O site da Leovox tratado como um filme em plano-sequência: uma home contínua
(Hero, Manifesto, Pilares, Selected Projects, Sobre, Contato, Footer), a
abertura com loader, a 404 tratada como cena, e as páginas de case study. A v1
é desktop. Fora de escopo nesta versão: responsividade fina de mobile (v2),
backend e autenticação.

## Stakeholders

- Leonardo Gonçalves: fundador, Product Owner, designer e dev. Dirige e faz QA.
- Agente Cowork: engenheiro de prompts, designer de produto, analista de código.
- Claude Code (squad de subagentes Leovox): execução de código.

## Documentos de referência (fonte da verdade)

- `docs/PIPELINE.md`: o roteiro do filme, as cenas e o estado de cada uma.
- `CONTRIBUTING.md`: fluxo, git, regras de marca, leis de animação, pipelines de asset.
- `docs/DECISOES.md`: registro de decisões (local, fora do versionamento).
- `CLAUDE.md`: memória do projeto lida pelo Claude Code.
- Identidade completa (brand manual, tom de voz, mascote): vive fora do repo, na
  pasta de identidade da Leovox.

## Como navegar

| Pasta | O que tem |
| --- | --- |
| `01-visao-geral/` | Contexto, motivação, objetivos, restrições |
| `02-requisitos/` | Requisitos funcionais e não funcionais |
| `03-arquitetura/` | Visão arquitetural, diagramas, tecnologias |
| `04-design-detalhado/` | Modelo de dados, módulos, interfaces, fluxos |
| `05-seguranca/` | Autenticação e controles de segurança |
| `06-testes/` | Estratégia e casos de teste |
| `07-operacional/` | Deploy, monitoramento, backup e recuperação |
| `08-anexos/` | Exemplos, referências e glossário |

Princípio editorial deste SDD: arquivos curtos, objetivos e referenciados entre
si. Frase que pode ser apagada sem perda é apagada.
