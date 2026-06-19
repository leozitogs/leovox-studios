# 1.2 Objetivos, requisitos de alto nível e restrições

## Objetivos do sistema

1. Provar a tese Leovox (criativo mais técnico) numa página que impressiona em movimento.
2. Atingir nível Awwwards: direção de arte forte, animação impecável, performance e acessibilidade.
3. Sustentar o plano-sequência: transição como movimento de câmera, nunca reload visível.
4. Converter: levar o visitante ao contato com fricção mínima.
5. Servir de prova de processo: repositório público com commits, branches e CI limpos.

## Requisitos de alto nível

- Home em cena contínua com Hero, Manifesto, Pilares, Selected Projects, Sobre, Contato e Footer.
- Abertura com loader de identidade, 404 tratada como cena, e case studies dedicados.
- Mascote vivo (vídeo com alpha) e isologo, sempre dentro da marca.
- Microinteração em tudo que o olho toca, e reversibilidade total do scroll.

## Restrições e premissas

- A v1 é desktop. Responsividade de mobile é v2; no mobile o scroll vira o gatilho garantido de toda revelação.
- A stack é travada (ver [../03-arquitetura/03-tecnologias](../03-arquitetura/03-tecnologias.md)): sem Tailwind, sem Framer Motion.
- As regras de marca são inegociáveis (ver `CONTRIBUTING.md`): sem travessão, paleta fechada, verde só chapado, fontes oficiais.
- Os cortes Extenda 40 e 80 são trial; a licença comercial é bloqueio de lançamento.
- Dev solo assistido: o Product Owner faz todo o git e o QA visual no dev server.

Relacionado: [01-contexto](01-contexto.md), [../02-requisitos/01-requisitos-funcionais](../02-requisitos/01-requisitos-funcionais.md).
