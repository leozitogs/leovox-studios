---
id: cena-03-pilares
tipo: cena
status: em-build
versao: 4
contrato: docs/scene-contracts/pilares.contract.json
aprovada_em: 2026-11-12
aprovacao: 2311f5703332
---
# Briefing · Cena 3 · Pilares · "A tira"

> Briefing de produção, v4 · 2026-11-12. Substitui a v3 de 2026-09-14
> (está no histórico do Git). Status e aprovação: ver o frontmatter.
> Os critérios executáveis vivem no contrato; os desta seção são os da proposta.
> Régua de nível: o portfólio de Eduardo Souza (eduardosouza-tech.github.io/EduardoDev),
> analisado em vídeo e no código. Ele é régua de execução, não de visual.

## Por que refazer

A v3 pedia uma graphic novel: linha de tinta costurando os quadros,
mascote em três poses, emendas de papel rasgado e uma palavra-âncora
por quadro, sem copy. O build entregou outra coisa:

1. **Quadros de template, não de Leovox.** Fundo #222222 liso, caixinhas
   de interface com borda fina e rótulos pequenos. A matéria que o hero
   e o manifesto firmaram (papel, serigrafia, carimbo, grafite, mão)
   some justo na cena que devia provar a marca.
2. **Copy que a v3 proibia.** "Seu projeto de identidade", "Sua campanha
   em movimento", "Seu produto em funcionamento", mais um parágrafo por
   quadro. Fala do cliente hipotético em vez de mostrar trabalho.
3. **Título estourando a coluna** nos três quadros (medido em 1440x810:
   "Seu produto em funcionamento" ocupa 586px numa coluna de 381px e
   aparece cortado como FUNCIONAM).
4. **Nada real.** Dez slots de "ASSET SOLICITADO". Nenhum movimento salva
   uma cena sem prova, e o próprio PIPELINE diz: explicação perde pra
   prova.
5. **A travessia briga com quem rola.** Pedir 7900px de scroll devolve a
   página pra 7490: o gatilho segura e puxa de volta. Com só 3 quadros, a
   travessia acaba antes de virar experiência, e o fim cai num vão escuro
   de 324px.

## O que fica (aprovado, não se discute aqui)

- O **cartaz PILARES DA LEOVOX** de abertura (decisão 58) e a **queda de
  luz** do off-white pro #222222 com o papel entrando (decisão 59).
- As **3 frentes oficiais**: 01 Identidade & Design, 02 Presença Digital
  (produção de conteúdo e edição de vídeo entram aqui), 03 Tecnologia &
  Automação. Nenhuma quarta frente.
- A headline "Um ecossistema. Três frentes integradas."
- Regras da marca: paleta oficial, verde chapado e estrutural, sem glow,
  neon, bloom, glitch ou scanline, nenhum travessão, nenhum reload
  visível.
- Regra do PO desde a decisão 35: **a tela nunca descansa no meio de uma
  transição.**

## Conceito

A cena vira a **tira de trabalhos da Leovox**: uma faixa horizontal de
papel colado na parede, com trabalhos reais agrupados nas 3 frentes. O
scroll vertical move a câmera pela tira. Cada frente abre com uma capa de
capítulo (número, nome, âncora carimbada) e segue com os trabalhos dela.
O que costura tudo é a matéria: o mesmo papel, a mesma tinta, o mesmo
carimbo, e as emendas rasgadas entre capítulos. A prova de "ecossistema"
deixa de ser um texto e vira o fato de um mesmo estúdio ter feito tudo
aquilo.

## Mecânica (o que a referência ensina, traduzido pra regra Leovox)

### 1. Câmera scrubada com gravidade

- A posição da tira é **função pura do progresso do pin**:
  `x = -progresso * distância`. Isso cumpre a regra de ouro do
  PIPELINE (movimento de câmera é scrubado) e o invariante 1 do
  `MOTION.md` (mesmo progresso, mesmo estado).
- A tira anda um pouco mais rápido que o scroll (proporção de partida
  1,25 px horizontal por px vertical; ajustar no QA).
- **Gravidade de painel** (padrão da decisão 47): 150ms sem scroll, o
  Lenis assenta no descanso do painel mais próximo do centro. Durante o
  gesto a câmera é livre; quando o gesto para, a tela nunca fica no meio.
  Isso substitui o gatilho da decisão 60 e acaba com o puxão de volta.

### 2. Um eixo de estado por painel

Cada painel calcula `d`, a distância normalizada do seu centro ao centro
da tela (0 no centro, 1 a uma tela de distância). Tudo o que o painel faz
sai desse número, então ida e volta saem de graça e nada fica órfão:

| Camada | Comportamento em função de `d` |
| --- | --- |
| Fundo de papel | parallax lento, 0,2 da câmera |
| Âncora fantasma (contorno, enorme) | atravessa atrás a 0,25 da câmera |
| Evidência (imagem ou vídeo) | parallax interno de até 40px dentro da moldura, papel abre por máscara rasgada conforme `d` cai |
| Título do trabalho | entra 1 a 2 graus torto e assenta reto no centro, como cartaz colado |
| Carimbo da frente | estampa quando `d` cruza 0,3 (gesto em tempo real, não scrub) |
| Anotação à mão (Schoolbell) | aparece perto do centro, uma linha no máximo |

### 3. Velocidade vira matéria

A velocidade do scroll inclina levemente o papel dos painéis (até 2
graus, limitado) e solta quando o gesto para. É papel balançando na
parede, não distorção digital: sem RGB split, sem tremor, sem glitch.

### 4. Trilho de orientação

Fixo na base enquanto a cena está pinada, em Bebas:

- capítulo `01 · IDENTIDADE & DESIGN`, com o verde chapado passando de
  capítulo em capítulo como bastão;
- nome do trabalho ativo, que troca **por carimbo** (o nome novo estampa
  por cima);
- uma régua com uma marca por painel, que se preenche conforme a câmera
  passa por ele.

Tudo clicável: marca leva ao painel com a travessia normal, capítulo leva
à capa. Setas esquerda e direita navegam com a cena pinada. Botões reais,
focáveis, com o rolo de texto no hover (mecânica getquoti aprovada na v3).

### 5. Celular, touch e reduced motion

Abaixo de 900px de largura, em telas touch ou com `prefers-reduced-motion`,
**a cena não pina**: os capítulos empilham na vertical, cada painel
revela por entrada em CSS puro, nenhum vídeo toca sozinho. Mesmo
conteúdo, mesma ordem de leitura.

## Os painéis

- **Só entra trabalho real.** Painel sem trabalho aprovado não existe.
  Nada de slot vazio no ar.
- Mínimo de 1 trabalho por frente para abrir a cena; o ideal é 2 a 3 por
  frente (7 a 9 painéis no total, contando as 3 capas).
- Cada painel tem: **uma evidência dominante** (imagem ou vídeo curto),
  o nome do trabalho em Anton, a frente em Bebas, uma anotação à mão
  opcional e, mais tarde, a porta para o case study (Cena 6).
- Sem parágrafo. Se o trabalho precisa de texto pra se explicar, ele
  ainda não é a melhor evidência.

### Candidatos

A lista de trabalhos candidatos por frente fica fora deste repositório,
que é público: nome de cliente só entra aqui depois da aprovação dele.
Duas ideias que não dependem de cliente: o próprio portfólio rodando como
evidência de Presença Digital (ideia meta da v3) e o loader e o harness
deste site como prova de Tecnologia & Automação.

## Capas de capítulo

Uma por frente: número grande, nome da frente e a âncora carimbada
(placeholders CARA., PALCO. e MOTOR. continuam valendo até o PO decidir).
O mascote de contorno do cartaz pode reaparecer em uma pose por capa; se
as poses não estiverem prontas, a capa funciona sem ele.

## Emendas e fecho

- Entre capítulos, **rasgo de papel** (ousadia 1 da v3): a borda rasgada
  do capítulo seguinte entra por cima com parallax próprio.
- No fim da tira, a headline **UM ECOSSISTEMA. TRÊS FRENTES INTEGRADAS.**
  assume o quadro como fecho monumental, e o despine leva direto pra
  próxima cena. Nada de vão escuro.

## Decisões que são do PO

1. **Gravidade em vez de gatilho.** Reabre a decisão 60 por fato novo: a
   referência nova e o puxão medido no build atual. A regra "nunca
   descansar no meio" continua garantida pela gravidade.
2. **Pilares e Selected Projects viram uma cena só?** Se a tira já mostra
   os trabalhos por frente, a Cena 4 repete o mesmo papel. Recomendação:
   juntar. A tira faz o trailer, e cada painel vira a porta do seu case
   study. O PIPELINE já tinha tirado o Case Index da home pelo mesmo
   motivo.
3. **Quais trabalhos entram** e com que aprovação de cliente.
4. **Âncoras finais** das 3 capas.

## O que preciso de você (produção)

Por trabalho escolhido:

- **Evidência principal:** imagem de 2400px de largura ou mais (16:10 ou
  4:5), ou vídeo mp4 de 6 a 10s, 1920x1080, 30fps, sem áudio. Eu converto
  pra web.
- **Nome curto do trabalho** e a frente a que pertence.
- **Anotação à mão** (opcional): uma frase sua, de até 6 palavras.
- **Aprovação do cliente** para mostrar.

Para a cena: as 2 bordas de papel rasgado (spec da v3, item 4, continua
valendo) e, se quiser o mascote nas capas, as poses da v3.

## Fora de escopo nesta versão

- Fonte com eixo de largura animado (a Extenda tem cortes de largura,
  mas a licença está pendente).
- Som.
- Canvas ou WebGL novo: a cena é DOM, CSS e GSAP.
- Copiar a referência: nada de rosto virando código, scramble de letras,
  amarelo-limão ou faixa de fita listrada. A Leovox tem as dela.

## Critérios de aceite (viram o contrato novo da cena)

- A cena só mostra trabalhos reais; nenhum placeholder em produção.
- Mesmo progresso, mesmo estado (inclusive `d` de cada painel).
- Parou o scroll em qualquer ponto, a tela assenta num painel em até
  600ms. Nunca descansa entre dois.
- Reverse, resize e reload no meio terminam em estado válido.
- Teclado navega painel a painel; o trilho informa capítulo e trabalho
  ativos.
- Celular, touch e reduced motion: fluxo vertical completo, sem pin.
- Desempenho: p95 de quadro abaixo de 20ms na travessia em desktop
  (medido por `collectFrameMetrics` do harness); mídia carrega só quando
  o painel está a até duas telas; vídeo toca só no painel ativo.
- Nenhum título estoura a coluna em 1024, 1440, 1920 e 2560 de largura.

## Execução

1. PO decide os 4 pontos acima e escolhe os trabalhos.
2. Protótipo de movimento em HTML isolado, com imagens provisórias, só
   pra aprovar a sensação da câmera e da gravidade antes de mexer no
   site.
3. Build estático com os trabalhos reais e o contrato novo em
   `docs/scene-contracts/pilares.contract.json`.
4. Movimento em segunda passada.
5. Auditorias: leovox-brand-guard, leovox-a11y-auditor e
   leovox-performance-watchdog. `npm run validate`, harness completo e QA
   do PO no :5173.
