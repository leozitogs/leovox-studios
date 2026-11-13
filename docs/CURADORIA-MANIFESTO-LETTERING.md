# Curadoria · Manifesto · o lettering em plano-sequência

> v1 · 2026-11-13. Status: **três direções, aguardando o PO.** Substitui a proposta "a mão no
> texto" (`PROPOSTA-MANIFESTO-E-CENA-8.md`), reprovada junto com a Cena 8.
> Protótipos, vídeos e quadros em `C:\Design\Leovox\curadoria\manifesto-lettering\` (fora do
> repositório).

## As regras desta rodada (do PO)

- **Plano-sequência sem corte, sobre papel.** O manifesto e os Pilares vivem no mesmo papel; a
  câmera nunca corta entre um ato e outro. A frase seguinte nasce do movimento da anterior.
- **Lettering potente, pensado para o motion.** O tipo é o protagonista, não o texto de apoio.
- **Noise no fundo**, na linha da referência do PO: manchas macias feitas de retícula de
  halftone (pontos que engrossam e afinam), com um leve verde. Só que **vivo**: as manchas andam
  devagar sozinhas e correm junto com a câmera, nunca estáticas.

## O que foi estudado

**Conhecimento de base (títulos de cinema).**

- **Saul Bass** popularizou a tipografia cinética no cinema. Em *Intriga Internacional*, as linhas
  dos créditos deslizam em faixas até virar a grade das janelas de um prédio: o texto vira a
  arquitetura da cena.
- **Kyle Cooper** (*Se7en*) mostrou o oposto: o tipo feito à mão, sujo e fragmentado, a serviço
  da história, mesmo quebrando regras de legibilidade.
- **Lição para a Leovox:**
  - o movimento do tipo precisa dizer alguma coisa da frase, não só enfeitá-la;
  - a marca já tem o prédio (o hero) e o filme (a Cena 7), e o manifesto pode falar essa língua.

**Referências vistas ao vivo (Awwwards e Codrops):**

| Referência | O que ela ensina |
| --- | --- |
| [Manifesto Page Scroll (WGB)](https://www.awwwards.com/inspiration/manifesto-page-scroll-wgb) | O manifesto como página própria, conduzido pelo ScrollTrigger |
| [Type transformation, kinetic type](https://www.awwwards.com/inspiration/type-transformation-kinetic-type-animation) | Números e palavras do tamanho da tela, empilhados e transformados (Area 17) |
| [Tim Grover, brutalista tipográfico](https://www.awwwards.com/inspiration/tim-grovers-brutalist-typographic-site) | Letra cheia e letra vazada na mesma composição, em escala gigante |
| [Stanley Kubrick, scroll](https://www.awwwards.com/inspiration/scroll-triggered-animation-stanley-kubrick) | Título de filme como cartaz que se move com o scroll |
| [Big headlines scroll](https://www.awwwards.com/inspiration/big-headlines-scroll) | Uma manchete por tela, sem texto de apoio disputando |
| [Codrops, On-Scroll Typography](https://tympanus.net/Development/OnScrollTypographyAnimations/index2.html) | Parágrafo que ganha tinta palavra por palavra com a rolagem |
| [Codrops, ghost trails (out/2026)](https://tympanus.net/codrops/2026/10/13/scroll-driven-ghost-trails/) | Letras que deixam cópias vazadas para trás conforme a velocidade da rolagem |

## As três direções

Nas três, o conteúdo é o mesmo:
- a mesma Extenda, em escala de cartaz;
- o verde só na palavra-chave de cada frase (RECUSA, FEIO, DIVISÃO, AUTENTICIDADE, LEOVOX);
- o mesmo noise vivo no fundo;
- nenhuma cursiva, adesivo ou nota.

### A · Abertura de filme (Saul Bass)

**Movimento:**
- cada linha da frase é uma **faixa** que entra por um lado da tela e sai pelo outro;
- linhas alternadas viram tarja preta com letra clara, como as barras dos créditos de Bass;
- as faixas de uma frase se cruzam e, no meio da passagem, alinham e formam a frase;
- a câmera não para: as faixas da frase seguinte já estão entrando enquanto as da anterior saem.

**Por que serve:** é a língua do cinema que o site já fala (o hero filmado, a Cena 7 de
making-of), e ecoa as fitas cruzadas da Cena 7.

**Risco:** é a mais "gráfica" das três; com frases longas, o alinhamento dura pouco na tela.

### B · Rastro

**Movimento:**
- a frase atravessa a tela de baixo para cima, freando no meio, onde o cartaz assenta para ser
  lido;
- a **velocidade da rolagem deixa cópias vazadas para trás**: rolou rápido, a frase arrasta
  quatro ecos em contorno (verdes na palavra-chave);
- parou de rolar, os ecos voltam para dentro da letra e fica só o cheio;
- uma frase por vez, sem sobreposição.

**Por que serve:** é o tipo reagindo a quem lê, em tempo real. Impressiona logo no primeiro
gesto e não depende de interação extra.

**Risco:** o efeito é muito reconhecível em portfólios recentes; o diferencial da Leovox fica no
papel, no noise e no verde só na chave.

### C · Através da letra

**Movimento:**
- a câmera **mergulha no miolo de uma letra** de cada frase (o O de LEOVOX, o O de MERCADO, o O
  de IGNORA);
- lá dentro é papel de novo, e a frase seguinte já está no centro, pequena, chegando;
- o manifesto inteiro vira um único zoom contínuo, de frase em frase.

**Por que serve:** é o plano-sequência literal, sem corte nenhum, e o mais cinematográfico das
três. Passar por dentro da letra é o tipo de movimento que se lembra.

**Risco:**
- a Extenda é condensada e o miolo é estreito, então a mira precisa ser exata para o mergulho
  não cair num traço preto;
- é a mais cara de ajustar em telas diferentes.

## O noise

- **Técnica:** um shader leve (WebGL) gera manchas macias de ruído e as desenha como retícula
  de halftone a 45 graus, com células de 3,6px, em cinza com um leve verde onde a mancha é mais
  densa, como na referência.
- **Movimento:** o tempo do shader anda devagar sozinho e soma o progresso da câmera, então as
  manchas correm junto com o plano-sequência.
- **Fallback:** sem WebGL (o site já prevê esse caso), a mesma retícula entra como imagem
  parada.

## Decisões para o PO

1. Qual direção segue para o protótipo fino, A, B ou C (ou uma mistura)?
2. O noise vivo entra só no manifesto ou em todo o papel (manifesto e Pilares)?
3. Os três textos de recusa do ato 1 ficam como uma frase própria (como nos protótipos) ou saem?
