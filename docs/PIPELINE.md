# Leovox Studios · Pipeline de Produção

> Desenvolva seus sonhos. Isso é Leovox.

Este é o roteiro do portfólio. O site é tratado como um filme em
plano-sequência: a home é uma tomada contínua, cada seção é uma cena
com mecânica própria, e nenhuma transição parece reload. Este documento
é vivo: cada briefing fechado atualiza a cena correspondente.

## Estado da produção

| # | Cena | Papel em uma linha | Status |
| --- | --- | --- | --- |
| 1 | Hero · A primeira tomada | Abre já em movimento, sem loading | Entregue |
| 2 | Manifesto · A recusa em 4 atos | O coração verbal, a luz se apagando | Entregue |
| 3 | Pilares · As 4 frentes | Um ecossistema. Não quatro serviços. | Roteirizada |
| 4 | Selected Projects · O trailer | 3 a 4 trabalhos curados pra seduzir | Roteirizada |
| 5 | Case Index · O acervo | Lista completa com filtros | Em revisão (ver nota) |
| 6 | Case Study · O close-up | Página dedicada de cada projeto | Roteirizada |
| 7 | Sobre · O making-of | A história como prova viva da tese | Roteirizada |
| 8 | Contato · A próxima cena é a sua | A tagline vira CTA | Roteirizada |
| 9 | 404 · Fora do roteiro | Erro tratado como cena | Roteirizada |
| + | Footer · Obrigado. | Despedida monumental + easter egg | Roteirizada |

## Cena 1 · Hero · A primeira tomada · ENTREGUE

O site não abre com loading, abre com uma cena já em movimento. Prédio
brutalista P&B com papel amassado, grafite autêntico da assinatura, e o
mascote vivo em vídeo com alpha, rodando em loop. A headline DESENVOLVA
SEUS SONHOS vive como fantasma no céu, com varredura de luz ocasional e
revelação que segue o cursor.

No scroll, a frase mergulha por trás do mascote e renasce por baixo, na
frente, como claim carimbado (DESENVOLVA em Anton, seus sonhos. em Lost
in South). No último ato a cena encolhe pra um card sobre palco
off-white, e o header nasce de uma bola com a isologo que desce e se
expande em nav pill, com barra de progresso interna e comportamento
inteligente por direção de scroll.

O que essa cena estabeleceu pro resto do filme: vídeo com alpha via
chroma key no ffmpeg (VP8, regras no README de public/animation),
opacidades como função pura do progresso de scroll, entradas de cena em
CSS puro, e QA de animação com reprodução em browser antes de qualquer
correção.

## Cena 2 · Manifesto · A recusa em 4 atos · ENTREGUE

O coração verbal do site. Depois do impacto visual do hero, a Leovox
fala. Estrutura fixa de 4 atos, tipografia protagonista, e a
mecânica-assinatura da inversão de luz, agora partindo de onde o hero
parou: o manifesto começa no palco off-white e escurece ato a ato. A
transição entre atos é a lâmina de verde chapado cruzando a tela.

Direção visual travada em briefing: continuação direta do palco do
hero; fundo minimamente interativo (linhas finas que reagem ao cursor);
mistura criativa de fontes dentro da mesma frase (peso Anton com
acentos em Lost in South, kickers em Bebas, anotações em Schoolbell);
estética streetwear com sensibilidade de composição Y2K (sem as
texturas Y2K banidas); microinterações em tudo que o olho toca.
Referências de régua: landonorris.com (cadeia de textos simples muito
bem feita, fundo vivo discreto, assinatura sobre o conteúdo) e
niccolomiranda.com (capítulos com mudança de clima).

Texto canônico (zero paráfrase, revisado em briefing):

> Ato 1 · Recusa
> A LEOVOX NASCEU DE UMA RECUSA.
> stack: A recusa de se encaixar. / A recusa de escolher entre criativo
> ou técnico. / A recusa de achar que marca boa é só logo bonito.

> Ato 2 · Diagnóstico
> O MERCADO ERROU FEIO.

> Ato 3 · Solução (DIVISÃO circulada, amplificar em destaque)
> A LEOVOX É O QUE ACONTECE QUANDO VOCÊ IGNORA ESSA DIVISÃO.
> EM VEZ DE SE ADEQUAR, A GENTE DECIDIU AMPLIFICAR.

> Ato 4 · Assinatura (peso máximo)
> AQUI SE FAZ COM INTENÇÃO, COM TÉCNICA E COM AUTENTICIDADE.
> DESENVOLVA SEUS SONHOS. / ISSO É LEOVOX.

A atribuição de luz por ato sai do protótipo aprovado, não do roteiro
antigo. Mecânica de scroll e participação do mascote idem.

## Cena 3 · Pilares · As 4 frentes · ROTEIRIZADA

Prova que a Leovox entrega o ecossistema inteiro, não serviços soltos.
Headline: "Um ecossistema. Não quatro serviços."

Nota de produção sobre a dúvida de texto: portfólio não é leitura, é
demonstração. A regra desta cena vai ser o teste dos 5 segundos: cada
frente precisa se provar com uma palavra-âncora e uma evidência visual,
não com parágrafo. A headline carrega o argumento inteiro; o resto é
mostrar. Texto de apoio: no máximo uma linha por frente, e se a
evidência visual for boa o suficiente, nem isso. O briefing da cena
decide o formato (painéis, cartões ou faixas), mas o princípio está
travado: explicação perde pra prova.

## Cena 4 · Selected Projects · O trailer · ROTEIRIZADA

Recorte curado de 3 a 4 trabalhos no fluxo da home. Cada projeto entra
como uma tomada: thumb grande, título seco, frente a que pertence, e
movimento no hover (preview em vídeo ou sequência). A função da cena é
seduzir, não catalogar. Cada item é a porta de entrada do seu case
study: a miniatura vira a própria transição de página (FLIP), mantendo
o plano-sequência mesmo na troca de rota.

## Cena 5 · Case Index · O acervo · EM REVISÃO

Roteiro original: lista completa e navegável com filtros pelas 4
frentes. Risco identificado em produção: peso, navegação confusa e
utilidade questionável; ninguém contrata depois de auditar o histórico
completo de alguém, contrata depois de ver 3 trabalhos fortes e uma
história bem contada.

Posição atual da direção: a cena sai da home. O acervo completo
sobrevive como página de arquivo discreta (texto leve, sem mídia
pesada), linkada no footer e no fim do Selected Projects pra quem
realmente quiser cavar. O fluxo principal vira: trailer (cena 4) leva
direto pro close-up (cena 6). Decisão final no briefing da cena 4.

## Cena 6 · Case Study · O close-up · ROTEIRIZADA

Continuação direta do Selected Projects: a entrada é a miniatura
expandindo em página, sem corte. Estrutura de cada case: contexto em
duas frases, processo em poucas imagens fortes, e a faixa de resultado
em destaque (número, impacto, prova). No fim, a ponte pro próximo case
mantém o usuário dentro do filme em vez de devolvê-lo ao limbo.

## Cena 7 · Sobre · O making-of · ROTEIRIZADA

A história do fundador como prova viva da tese: não precisou se
encaixar pra ter espaço. Foto P&B com halftone, anotações à mão
(Schoolbell) como voz humana.

Atualização de elenco: a cena passa a incluir as duas pessoas que fazem
parte ativa da Leovox. A hierarquia narrativa se mantém: a história do
fundador carrega a tese, e a equipe entra como prova de que a Leovox é
um estúdio de verdade, não um one-man show. Formato provável: making-of
do fundador + cards de elenco com função e assinatura à mão. Nomes,
fotos e funções entram no briefing da cena.

## Cena 8 · Contato · A próxima cena é a sua · ROTEIRIZADA

O clímax comercial. "Desenvolva seus sonhos" deixa de ser headline e
vira CTA: o botão que o filme inteiro construiu. Fecha o círculo com o
hero (o mascote reaparece, a composição ecoa a primeira tomada).
Fricção mínima: contato direto em um clique, formulário só se provar
que merece existir.

## Cena 9 · 404 · Fora do roteiro · ROTEIRIZADA

Erro tratado como cena, não como página quebrada. O mascote perdido
fora do set, uma linha de humor na voz da marca, e um caminho único e
óbvio de volta pra primeira tomada.

## Footer · Obrigado. · ROTEIRIZADA

Despedida monumental: a palavra Obrigado. em escala de cena, e o
mascote como recompensa escondida pra quem chegou até o fim. O easter
egg é o aperto de mão da marca com quem assistiu o filme inteiro.

## Como cada cena é produzida

O processo que o hero estabeleceu e que vale pra todas as cenas:

1. **Briefing**: protótipo visual + intenção de movimento, aprovados
   antes de qualquer código.
2. **Build estático**: a cena parada, com layout e assets reais.
3. **Movimento**: scroll, microinterações e transições, com a regra de
   ouro: o que é movimento de câmera é scrubado pelo scroll; o que é
   gesto de elemento roda em tempo real disparado por gatilho.
4. **QA de cena**: ida e volta de scroll em todos os ritmos, cliques em
   tudo, reduced-motion, e reprodução em browser pra qualquer bug de
   animação antes de corrigir.
5. **PR**: um por cena, com checklist de marca e CI verde.

**Leovox Studios · Pipeline de Produção · v1.0 · Junho 2026**
