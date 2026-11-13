---
id: cena-07-sobre
tipo: cena
status: proposta
versao: 1
contrato: null
aprovada_em: null
aprovacao: null
---
# Briefing · Cena 7 · Sobre · "O making-of"

> Briefing de produção, v1 · 2026-11-13. Status e aprovação: ver o frontmatter.
> Vem logo depois da tira dos Pilares e substitui o vão escuro que hoje fecha a página.
> Régua de nível: a mesma da tira (Eduardo Souza como execução, não como visual).

## O papel da cena no filme

O hero promete, o manifesto recusa, a tira prova com trabalho. Faltava quem fez. O
manifesto diz que a Leovox nasceu da recusa de escolher entre criativo e técnico; esta
cena mostra a pessoa que não escolheu. Não é currículo nem "quem somos": é o making-of
do filme que o visitante acabou de ver.

Uma frase guia tudo: **a história como prova da tese, não como biografia.** Cada fato que
entra precisa provar "criativo e técnico ao mesmo tempo". O que não prova, sai.

## Conceito: a folha de contato

No cinema e na fotografia, o making-of mora na **folha de contato**: a folha com as tiras
de negativo reveladas lado a lado, numeradas na borda, onde o diretor circula com lápis de
cera o take que vale. A Leovox circula com o **verde chapado da marca**.

Matéria da cena, toda vinda do que o site já firmou:

- **papel off-white e textura de papel** (a luz volta depois da tira);
- **tiras de negativo em #222222**, com furos de tracionamento e numeração de borda em
  Bebas ("LEOVOX 400 · 07 · 12A");
- **fotos P&B em halftone** (serigrafia, a herança incentivada pelo CONTRIBUTING);
- **círculo verde à mão** marcando o take escolhido, **anotações em Schoolbell** com setas;
- **carimbo** "TAKE BOM" na mesma família do carimbo das capas.

Proibido aqui também: glow, neon, glitch, scanline, travessão, grão digital fake, foto
colorida (só P&B com halftone), e qualquer número sem prova.

## Roteiro em quatro beats

### Beat 0 · A luz volta (chegada)

A tira termina no fecho verde chapado. Quando o pin dos Pilares solta, a cor recua de
volta pra off-white como **função pura do progresso**: o inverso da queda de luz da
decisão 59, o fim do espetáculo e o acender das luzes de trabalho do set. Nada de corte
seco nem fade branco: o verde encolhe até virar a faixa do carimbo da cena.

Na entrada assenta uma **claquete** em papel: "CENA 07 · MAKING-OF · TAKE 1". A haste
fecha uma vez (gesto em tempo real, disparado pelo gatilho de entrada, nunca scrubado) e
o som visual é um tremor seco do palco, o mesmo impacto que o loader já usa.

### Beat 1 · A folha de contato (a trajetória)

Uma folha grande, colada na parede, com **três tiras de negativo**. Cada tira é um ano
que prova a tese, cada fotograma um take daquele ano. A folha fica em sticky e o scroll
anda pelas tiras, de cima pra baixo:

| Tira | Ano | O que os fotogramas mostram (prova, não texto) |
| --- | --- | --- |
| 1 | 2020 | Primeiras camisas e identidades feitas como freelancer |
| 2 | 2023 | O primeiro código escrito sozinho, automações |
| 3 | 2025 | A entrada no CIn/UFPE e o nascimento da identidade Leovox |

Em cada tira, quando ela chega ao centro, o **círculo verde é desenhado à mão** em volta
do take escolhido (traço SVG com `stroke-dashoffset`, como o risco do ato 1 do manifesto)
e uma anotação curta aparece ao lado, com seta: "o primeiro cliente", "aprendi sozinho",
"aqui virou estúdio". O desenho do círculo é gesto: dispara quando a tira assenta e
sempre conclui; voltar o scroll apaga, e passar de novo redesenha.

O que é scrubado é só a câmera: a folha sobe sob uma lupa de revisão (o fotograma ativo
ganha escala e nitidez, os vizinhos ficam no halftone mais grosso). Isso reaproveita o eixo
`--d` da tira: cada tira recebe a distância ao centro e o CSS deriva o resto.

### Beat 2 · A tese em pessoa

A folha sai de quadro e entra o **retrato do fundador**, recortado, P&B em halftone,
grande, sangrando da tela pela direita. À esquerda, a frase-tese em Anton, em duas
linhas que se espelham:

> DESIGNER QUE PROGRAMA.
> ENGENHEIRO QUE DESENHA.

Em volta do retrato, **três anotações à mão com setas**, que entram uma por vez:
"desenha desde 2020", "programa desde 2023", "engenharia de IA". O verde aparece só no
traço das setas e num sublinhado chapado sob "QUE DESENHA". Fecho do beat: a assinatura
manuscrita do fundador se escreve (o mesmo recurso do traço do monograma), e o carimbo
"TAKE BOM" bate no canto do retrato.

### Beat 3 · O elenco (créditos de set)

A equipe entra como **crachás de set pendurados por cordão**, um por pessoa: foto em
halftone, nome, função e uma assinatura à mão. Os crachás são **folhas soltas**: usam a
física da tira (`folhaFisica.ts`), pendurados pelo cordão, balançando com o cursor e com a
inércia da câmera. Com a mão, dá pra puxar e soltar. É a mesma linguagem de interação dos
Pilares, agora num objeto novo, o que dá coerência sem repetir a cena.

Hierarquia: o fundador carrega a tese no beat 2; os crachás provam que a Leovox é um
estúdio, não um one-man show. Abaixo dos crachás, a ficha técnica corre como créditos de
filme, em duas colunas tipográficas (função alinhada à direita, nome à esquerda), em Bebas,
e termina em "a próxima cena é a sua", a ponte pra Cena 8.

## Motion: as leis aplicadas

| O quê | Natureza | Como |
| --- | --- | --- |
| Volta da luz, câmera pela folha, lupa no fotograma | Câmera, scrubada | Função pura do progresso; `--d` por tira |
| Haste da claquete, círculo verde, anotações, carimbo, assinatura | Gesto, tempo real | Disparado por gatilho com histerese; sempre conclui |
| Crachás | Física em tempo real | `folhaFisica` com material próprio (cordão longo, mais lento) |
| Créditos | Câmera, scrubada | Rolam com o scroll, sem pin |

- **Ritmo:** depois de dois pins seguidos (hero e tira), esta cena **não pina a página
  inteira**. Só a folha de contato fica em sticky durante o beat 1; o resto é scroll
  natural. Isso devolve ao visitante a sensação de mão livre antes do clímax do contato.
- **Altura total:** cerca de 4 telas (folha 2, retrato 1, elenco e créditos 1).
- **Reduced motion e telas estreitas:** a folha vem com os três círculos já desenhados e
  todas as anotações visíveis; crachás parados; nenhum sticky.
- **A11y:** fotos com `alt` descritivo; a folha de contato é uma lista ordenada (ano,
  descrição), lida em ordem; anotações à mão também existem como texto; foco visível nos
  crachás, que respondem a Enter abrindo a ficha da pessoa.
- **Desempenho:** halftone pré-processado no pipeline (imagens já serigrafadas, WebP),
  nunca filtro em tempo real; círculos e assinaturas em SVG leve; nada de `filter` animado
  (decisão 70).

## Copy (rascunho, sem travessão)

- Claquete: CENA 07 · MAKING-OF · TAKE 1
- Kicker da folha: COMO A LEOVOX FOI FEITA
- Anotações da folha: "o primeiro cliente" · "aprendi sozinho" · "aqui virou estúdio"
- Tese: DESIGNER QUE PROGRAMA. / ENGENHEIRO QUE DESENHA.
- Setas do retrato: "desenha desde 2020" · "programa desde 2023" · "engenharia de IA"
- Créditos, fecho: "a próxima cena é a sua"

## Regras de conteúdo (vêm do dossiê do PO)

- Só fatos que provam a tese e que o PO liberou como públicos.
- Fora: projetos sociais e empregos que o PO mantém fora do material público, nomes de
  clientes sem aprovação, qualquer número sem prova, detalhes de trabalho sob NDA.
- A história de esforço pessoal (como o primeiro notebook foi comprado) é forte e prova a
  tese, mas é íntima: **entra só se o PO decidir**, e nunca como drama.

## Assets necessários

| Asset | De quem | Observação |
| --- | --- | --- |
| 9 a 12 fotogramas da trajetória (3 a 4 por ano) | PO | Fotos ou capturas reais: camisas, primeiras telas, rascunhos do logo |
| Retrato do fundador | PO | Fundo limpo pra recorte; P&B é feito no pipeline |
| Assinatura manuscrita do fundador | PO | Escaneada ou desenhada em vetor |
| Nome, função, foto e assinatura de cada pessoa do elenco | PO | As duas pessoas ativas na Leovox |
| Halftone dos retratos e fotogramas | Pipeline | Script de serigrafia no `scripts/`, saída WebP |

Até os assets chegarem, a cena roda com **placeholders declarados**, como a tira:
fotogramas e retratos em papel com a âncora "TAKE" e a legenda "placeholder".

## Integração com o resto

- O fecho verde da tira deixa de levar a um vão escuro: o `scene-spacer` sai.
- O link **Sobre** do menu passa a apontar pra esta cena (hoje aponta pro primeiro ato
  do manifesto). É só trocar o destino registrado em `lib/navegar`.
- A cena registra destino próprio (`sobre`) e entra no harness com contrato
  (`docs/scene-contracts/sobre.contract.json`): estados chegada, folha, tese, elenco;
  critérios de aceite para os três círculos, a física dos crachás e o modo estático.

## Plano de construção

1. Aprovação deste briefing e das decisões em aberto.
2. Build estático com placeholders: folha, retrato, crachás, créditos, em laptop.
3. Câmera: volta da luz, sticky da folha, `--d` por tira, lupa.
4. Gestos: claquete, círculos, anotações, carimbo, assinatura.
5. Crachás com `folhaFisica` (material "cracha").
6. Contrato, testes de browser, smoke, QA do PO no laptop.
7. Assets reais, depois responsividade.

## Decisões em aberto pro PO

1. **Conceito:** folha de contato (making-of de cinema) aprovado?
2. **Elenco:** nomes, funções e se cada pessoa topa foto e assinatura.
3. **História pessoal:** entra o episódio do primeiro notebook, ou fica só a trajetória
   profissional?
4. **Engenharia de IA:** o site do estúdio cita a engenharia de IA de forma genérica
   (sem empregador), como proposto, ou prefere outra formulação?
