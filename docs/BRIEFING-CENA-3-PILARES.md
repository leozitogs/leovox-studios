# Briefing · Cena 3 · Pilares · "Três quadros, um traço"

> Briefing de produção, v3 · 2026-09-14. Substitui a v2 de 2026-07-05.
> Referência de mecânica: ten.375.studio (graphic novel interativa).
> Status: aprovado em ideação; execução via Claude Code (decisão 55),
> com prompt autocontido escrito pelo agente (decisão 56).

## O que está travado (não se discute aqui)

1. Headline de apoio: "Um ecossistema. Três frentes integradas."
2. Teste dos 5 segundos: cada frente se prova com palavra-âncora e
   evidência visual. Explicação perde pra prova.
3. As 3 frentes: 01 Identidade & Design | 02 Presença Digital |
   03 Tecnologia & Automação.
4. Mecânica: travessia por gatilho (o padrão do Manifesto, decisões 35
   e 47, rotacionado pra horizontal). Cruzou o limiar, o slide dispara
   em tempo real e sempre conclui. Nunca descansa no meio.
5. Fio da integração: híbrido A + C. A linha-cara costura os 3 quadros
   e o mascote percorre a cena por cima dela.
6. Copy de apoio: NENHUMA. Só âncora + evidência (decisão do PO,
   2026-07-05). Se alguma frente não se provar em QA, rebriefing pontual.
7. Mascote: produção híbrida. 3 poses em PNG 4K com alpha; a pose 03
   pode ganhar webm com alpha em loop.
8. Palavras-âncora: EM ABERTO. As propostas abaixo valem como
   placeholder de build; o PO bate o martelo antes do PR.

## Conceito

A Cena 3 é uma tira de graphic novel lida na horizontal. O scroll
vertical do usuário vira travessia lateral por 3 quadros, um por
frente. Cada quadro tem composição própria, vida interna e um ponto
focal único. O que impede a leitura de "menu de serviços" é o fio
duplo: um único traço serigráfico contínuo atravessa os 3 quadros se
redesenhando pra descrever cada frente, e o mascote viaja junto,
interagindo com o objeto de cada uma. A linha é a prova estrutural
(tudo conectado), o mascote é a prova quente (tudo com a sua cara).

## Referências decodificadas (o que entra e o que fica de fora)

### ten.375.studio (mecânica-mãe, travada)

Entra: quadros de graphic novel com composição fechada, transição
entre quadros com parallax de camadas, navegação por capítulos 01 a
03 sempre visível, vida interna própria em cada quadro (nada parado).
Fica de fora: a paleta e o clima deles. A tira é Leovox: serigrafia,
halftone, traço de tinta, verde chapado.

### sbs.com.au/theboat (profundidade e atmosfera)

Entra: cada quadro com no mínimo 3 camadas de profundidade real
(fundo, evidência, primeiro plano) andando em ritmos diferentes na
travessia; atmosfera contínua que nunca congela (lá é chuva e mar,
aqui é halftone respirando e a linha viva); a tipografia como parte da
cena, assentada NO quadro, não flutuando sobre ele.
Fica de fora: som (fora do escopo da v1) e o ritmo contemplativo. A
Leovox atravessa com atitude, não com melancolia.

### landonorris.com (régua tipográfica, já aprovada na Cena 2)

Entra: mistura de fontes na mesma composição (âncora em Anton, número
de capítulo em Bebas, anotações em Schoolbell), fundo vivo discreto
que não compete com o conteúdo, e a assinatura por cima do conteúdo no
fecho (a linha resolvendo em flecha é a nossa versão disso).

### getquoti.ai (microinteração de botão e matéria de papel)

O PO destacou a estética e especificamente a animação dos botões.
Decodificado no código-fonte: os botões empilham o mesmo rótulo em
camadas e no hover o texto visível sobe pra fora da máscara enquanto a
cópia entra por baixo, com leve troca de cor do fundo. É rolo de texto
com overflow escondido, 100% reproduzível em CSS puro.

Entra: (a) essa mecânica de rolo de texto em TODO elemento clicável da
cena (números de capítulo, rótulo de frente no hover, futura ponte pro
Selected Projects), em Bebas, com o rolo entrando em verde chapado
sobre off-white ou o inverso; (b) o papel rasgado como matéria de
divisa, detalhado na ousadia 1 abaixo, herdeiro direto do papel
amassado que o hero já estabeleceu.
Fica de fora: o layout SaaS e qualquer literalidade de landing page.

## Arquitetura da cena (beats)

A seção pina em altura cheia. Beats:

- **Beat 0 · Abertura.** Palco herda o fundo onde o Manifesto termina
  (#222222, linhas de contorno vivas). Headline monumental: UM
  ECOSSISTEMA. em Anton, acompanhado por "três frentes integradas".
  A linha-cara nasce aqui, saindo de trás da headline
  como uma pincelada que aponta pra direita. O mascote entra pelo
  canto e "puxa" a linha.
- **Beats 1 a 3 · Os quadros.** Um por frente, detalhados abaixo.
  Durante os quadros, um carimbo pequeno UM ECOSSISTEMA persiste fixo
  num canto, segurando o argumento o tempo todo.
- **Fecho (dentro do beat 3).** Sem beat extra pra não inchar: no
  quadro 3 o mascote assina e, na saída do pin, a linha mergulha pra baixo conduzindo o
  olho pro Selected Projects. A linha vira a ponte entre cenas.

## Mecânica de scroll (herda o motor do Manifesto)

- Acúmulo de scroll com banda morta (generalizar o actMath já testado
  em 17 testes). Cruzou o limiar: timeline GSAP em tempo real desliza
  o palco um quadro. Reverse volta pelo mesmo caminho. Teleporte real
  (âncora/drag) aplica estado direto, sem animação.
- Gravidade de quadro: parou o scroll, a cena assenta no quadro
  corrente (padrão da decisão 47).
- Travessia com parallax: durante o slide, as camadas de cada quadro
  (fundo, emenda de papel, evidência, tipografia, linha, mascote)
  andam em ritmos diferentes. Como a travessia é timeline por gatilho,
  o parallax roda inteiro sem picote pelo ritmo do usuário (lei 1:
  isso é gesto, não câmera scrubada).
- Elementos que atravessam a emenda: linha e mascote cruzam de um
  quadro pro outro DURANTE a travessia, nunca somem e reaparecem.
- Leis de animação em vigor: tudo fromTo com valores explícitos (lei
  5), alvos por referência de elemento (lei 4), entrada de conteúdo
  de quadro em CSS puro com fill backwards (lei 3), bug se reproduz
  em browser antes de corrigir (lei 6).

## O fio híbrido (como linha e mascote convivem sem competir)

Hierarquia fixa: a linha é estrutural e vive ATRÁS do conteúdo, numa
faixa horizontal constante da tira inteira (proposta: baseline da
linha em 62% da altura do viewport, tolerância de ondulação de ±8%),
nunca cortada pela borda. O mascote é pontual e vive num único ponto
focal por quadro, sempre em contato com a linha (ela é o chão, o
corrimão ou a ferramenta dele).

Técnica da linha, decisão de engenharia mantida da v1: NADA de
MorphSVG (plugin pago do Club GSAP). A linha se redesenha por
stroke-dashoffset: durante a travessia, o estado do quadro N se apaga
enquanto o estado do quadro N+1 se desenha, com as duas pontas
coincidindo na emenda. A geometria dos 5 estados (nascimento + 4
quadros) eu especifico em SVG; a textura de tinta que veste o traço é
  asset do PO (item 1 da lista de produção). Efeito de pincelada
contínua, custo zero de licença, controle total na timeline.

## Os 3 quadros

Palavras-âncora abaixo são placeholder aprovado pra build; o martelo
final é do PO antes do PR. Nenhum quadro leva copy de apoio.

### Quadro 01 · Identidade & Design

- Âncora (placeholder): **CARA.** (alternativas: IDENTIDADE. |
  ASSINATURA.)
- Evidência: marca aplicada em objeto real. Candidata forte: jersey
  e-sports (categoria Apparel é especialidade declarada do pilar no
  brand manual, seção 9.2). P&B com halftone, tratamento de
  serigrafia, verde só chapado se entrar.
- Linha: o traço desenha um contorno de assinatura/logo.
- Mascote: pose 01, mão na linha, como quem acabou de pintá-la.
- Vida interna: o halftone respira (deslocamento sutil por CSS), o
  carimbo da âncora estampa na entrada do quadro.
- Camadas de parallax: fundo texturizado (lento), jersey (médio),
  âncora carimbada (rápido), linha e mascote (ritmo da travessia).

### Quadro 02 · Presença Digital

- Âncora (placeholder): **PALCO.** (alternativas: PRESENÇA. |
  VITRINE.)
- Evidência: moldura de navegador com um site vivo dentro. Ousadia 2
  abaixo: o site é o próprio portfólio Leovox rodando, gravado em
  vídeo pelo PO.
- Produção de conteúdo e edição de vídeo entram como entregas
  complementares, sugeridas por pequenos recortes visuais. Não viram
  lista extensa nem disputam protagonismo com a evidência principal.
- Linha: o traço se dobra e vira a moldura do navegador.
- Mascote: pose 02, apresentando a tela, gesto de "olha isso".
- Vida interna: o vídeo do site roda em loop dentro da moldura, com
  cursor real navegando; a barra de progresso da moldura avança
  sincronizada com o loop.
- Camadas: fundo (lento), moldura+vídeo (médio), âncora (rápido),
  linha e mascote.

### Quadro 03 · Tecnologia & Automação

- Âncora (placeholder): **MOTOR.** (alternativas: MÁQUINA. |
  AUTOMÁTICO.)
- Evidência: fluxo serigráfico, entrada vira saída (formas passando
  por um mecanismo desenhado a traço). Atenção de marca: sem circuito
  neon, sem binário decorativo, sem glow. É desenho de traço, não
  interface de filme hacker.
- Linha: o traço vira o próprio fluxo, passa por dentro do mecanismo.
- Mascote: pose 03 EM WEBM, acionando uma alavanca em loop; quando ele
  liga, a vida interna do quadro começa.
- Vida interna: as formas percorrem o fluxo em loop, carimbo "feito."
  estampa na saída do mecanismo de tempos em tempos.
- Ousadia 3 (interação): a alavanca também é clicável pelo usuário.
  Clicou, o fluxo acelera por 2s e o carimbo "feito." estampa na hora.
  Botão real no DOM, focável, rótulo "acionar o motor".

## As 3 ousadias (explícitas, com o que dependem de você)

1. **Emendas de papel rasgado.** As divisas entre os 3 quadros não são
   linhas retas: são rasgos verticais de papel, no espírito do papel
   amassado do hero e do uso que o getquoti faz da matéria. Durante a
   travessia, a borda rasgada do quadro seguinte entra por cima do
   atual com parallax próprio, como página de zine sobreposta. A linha
   e o mascote cruzam POR CIMA do rasgo, provando que a divisa é
   cenografia e a integração é real. Depende de você: 3 texturas de
   borda rasgada (item 4 da produção). Risco baixo, ganho alto de
   matéria.
2. **O quadro 02 é meta.** A evidência de Presença Digital é o próprio
   portfólio rodando: você grava a tela navegando o filme (hero,
   manifesto) e o vídeo vive dentro da moldura de navegador desenhada
   pela linha. O site prova o site. Depende de você: screen recording
   limpo (item 5). Se preferir não ser meta, grava um projeto de
   cliente no lugar, mesma spec.
3. **A alavanca é sua também.** O quadro 03 aceita clique do usuário
   na alavanca, com resposta imediata do fluxo. Microinteração pura,
   sem asset extra além do webm da pose 03 (o clique acelera o fluxo
   SVG, não o vídeo). Depende de você: nada além da pose 03; a decisão
   de manter ou cortar é sua no QA.

## Navegação por capítulos

- Numeração 01 02 03 em Bebas, fixa na base da cena enquanto
  pinada, com o número ativo em verde chapado. O verde viaja de
  número em número como bastão.
- Microinteração getquoti em todos os números: rolo de texto no hover
  (rótulo sobe pra fora da máscara, cópia entra por baixo, fundo
  troca pra verde chapado com rótulo preto pela regra de inversão).
  CSS puro, overflow hidden, duas cópias do rótulo empilhadas.
- Clicável: salto pra quadro adjacente usa a travessia normal; salto
  distante usa a lâmina vestindo a cor do destino (padrão da decisão
  42). Fatiada iniciada é fatiada concluída, sempre.
- Teclado: setas esquerda/direita navegam os quadros com a cena
  pinada. Botões reais no DOM, focáveis, com rótulo da frente.

## Entrada, saída e acessibilidade

- Entrada: emenda direta com o ato 4 do Manifesto (fundo #222222,
  linhas de contorno já vivas). Sem corte, obviamente.
- Saída: a linha conduz o despine pro Selected Projects.
- Reduced motion: a cena não pina. Os 3 quadros empilham na vertical
  com scroll normal, linha em estado estático por quadro, mascote em
  PNG parado (os webm nem carregam), rasgos como divisa estática.
- Leitor de tela: cada quadro é uma região com heading próprio
  (número + nome da frente + âncora), ordem de leitura 01 a 03
  independente do visual. A alavanca do quadro 03 é botão com rótulo.
- Tipo `Frente` fecha no código com as 3 frentes oficiais:
  'identidade' | 'digital' | 'tecnologia'.
- Performance: orçamento da cena em 1 webm novo (~2MB, teto),
  3 PNGs de pose servidos como WebP no lançamento, e SVGs de linha e
  mecanismo. Nada de canvas novo; o R3F persistente não participa
  desta cena.

## O QUE EU PRECISO DE VOCÊ (produção do PO, spec completa)

Ordem de produção sugerida: itens 1 e 2 destravam o build estático;
3 destrava o movimento; 4, 5 e 6 entram depois sem retrabalho.
Entrega: masters na sua pasta de identidade; versões web nos paths de
`public/` indicados. Placeholders seguram o build até cada item chegar.

### 1. Pincelada master (a pele da linha-cara)

- O quê: textura de tinta serigráfica pra vestir a linha. A geometria
  dos 4 estados eu especifico em SVG; você produz a matéria do traço.
- Formato: PNG 4K com alpha (tileável na horizontal) OU o brush
  vetorial exportado. Traço encorpado, imperfeição de serigrafia real,
  sem suavização artificial.
- Cor: off-white #FBFBFB sobre transparente (a cor final é aplicada
  no código; produza em tom único).
- Destino: `public/textures/pincelada-linha.png`.
- Aceite: em zoom de 200% a borda parece tinta, não vetor liso.

### 2. Objeto-símbolo de Identidade & Design

Masters 4K, P&B com halftone, tratamento de serigrafia. Verde só
chapado, se entrar. Sem glow, neon, glitch ou ruído digital.

- **Quadro 01, marca aplicada:** jersey e-sports (ou objeto de
  apparel que você preferir) com identidade fictícia ou de cliente
  real aplicada. Recorte com alpha, sombra dura se quiser, fundo
  transparente. Destino: `public/components/pilares/obj-identidade.png`
  (master 4K, conversão WebP pré-lançamento).
Os quadros 02 e 03 não têm objeto raster seu: a moldura de navegador
é a própria linha (SVG) e o mecanismo do 03 eu especifico em SVG a
traço, com você validando o desenho antes do código.

### 3. Mascote, 3 poses (o coração da produção)

Regra de ouro das 3: o ponto de contato com a linha fica documentado
por pose (a linha vive na baseline de 62% do viewport). Mesma escala
de personagem nas 3, mesmo peso de traço, expressões dentro do
sistema (guia do mascote, seção 2.1): confiante no 01, provocadora no
02 e resolutiva no 03.

- **Pose 01 · O pintor (PNG).** Mão em contato com a linha, postura de
  quem acabou de assinar. Expressão confiante. PNG 4K com alpha.
  Destino: `public/components/pilares/mascote-pose-01.png`.
- **Pose 02 · O apresentador (PNG).** Corpo meio de perfil, braço
  estendido apresentando a moldura, "olha isso". Expressão
  provocadora. PNG 4K com alpha.
  Destino: `public/components/pilares/mascote-pose-02.png`.
- **Pose 03 · O operador (PNG + WEBM).** Acionando alavanca. O PNG é o
  frame de repouso (mão na alavanca, pré-acionamento) e serve de
  poster/fallback/reduced-motion. O webm é o loop do gesto: puxa,
  segura, solta, volta. Loop perfeito, 3 a 5s.
Spec do webm (pipeline canônico, decisões 24 e 25):

- Fonte: mp4 com fundo verde, 24fps EXATO (24.12 causou judder no
  hero), loop perfeito de 3 a 5s, sem motion blur pesado na borda.
- Meça o verde real do arquivo antes do chroma (no 404 o nominal
  0x12AD01 saiu 0x1CA40A do render).
- Conversão: chroma key direto no ffmpeg, saída VP8 `yuva420p`,
  comando canônico em `public/animation/README.md`.
- Aceite (checklist inegociável): profile 0, `alpha_mode` 1, E
  `alphaextract` com mínimo perto de 0. Validação de transparência
  sempre no browser. Teto de peso: ~2MB por webm.
- Destino: `public/animation/mascote-pilar-03.webm`.

### 4. Bordas de papel rasgado (ousadia 1)

- O quê: 2 rasgos verticais de papel (divisas entre os quadros 1|2 e
  2|3), cada um diferente do outro, rasgo real fotografado ou
  escaneado, não filtro.
- Formato: PNG 4K com alpha, altura cheia, largura da faixa do rasgo
  (~400 a 600px no master). Papel off-white com a fibra aparecendo.
- Destino: `public/textures/rasgo-01.png` e `rasgo-02.png`.
- Aceite: em tela, o rasgo lê como matéria (fibra, sombra própria),
  não como zigue-zague vetorial.

### 5. Screen recording do portfólio (ousadia 2, quadro 02)

- O quê: gravação de tela navegando o filme (abertura, hero, scroll
  até o manifesto), ritmo de quem mostra com orgulho, sem pressa e
  sem tremor de scroll.
- Formato: mp4 h264, 1920x1080 ou maior, 8 a 15s, cursor visível,
  60fps na captura (eu converto pra web). Sem alpha, roda dentro da
  moldura.
- Destino: `public/components/pilares/site-vivo.mp4` (converto pra
  webm/av1 no aperto de peso).
- Alternativa sua: gravar um projeto de cliente no lugar do meta.

### 6. Decisões que continuam com você (não são asset)

- **Palavras-âncora finais** das 3 frentes (placeholders: CARA.,
  PALCO. e MOTOR.). Prazo natural: antes do PR da cena.
- **Validação do desenho do mecanismo** do quadro 03 (eu entrego a
  proposta em SVG antes de codar a vida interna).
- **Manter ou cortar a ousadia 3** (alavanca clicável) no QA.
- **QA final da cena** no dev server, como sempre.

## Riscos e mitigação

- **Leitura de menu:** mitigada pelo fio duplo, pelo carimbo
  persistente da headline, pela numeração de capítulos e agora pelos
  rasgos (linguagem de zine e de história, não de catálogo).
- **Peso:** 1 webm no teto de 2MB, poses em WebP no lançamento,
  screen recording comprimido. O performance-watchdog audita antes
  do PR.
- **Competição linha x mascote:** hierarquia fixa (linha atrás,
  estrutural; mascote num ponto focal único por quadro, sempre
  tocando a linha).
- **Scroll horizontal e usabilidade:** a travessia por gatilho elimina
  o pior caso (usuário preso no meio de um pan). Gravidade de quadro
  cobre o resto.
- **Consistência das 3 poses:** regra de ouro documentada (escala,
  traço, ponto de contato na baseline). Se uma pose chegar fora, o
  quadro dela segura no placeholder sem travar os outros.
- **Squad desatualizado:** qualquer prompt pro Claude Code desta cena
  crava o stack real no corpo (decisão 56): CSS puro com tokens,
  GSAP/Lenis, sem Tailwind, sem Framer Motion, branco puro liberado.

## Fluxo de execução (decisões 55 e 56)

1. PO produz itens 1 e 2 (ou aprova placeholders) e bate o martelo
   nas âncoras quando quiser.
2. Eu escrevo o prompt autocontido pro Claude Code: build estático
   primeiro (layout dos 3 quadros com assets ou placeholders), com
   leovox-asset-curator e leovox-art-director no papel.
3. Movimento em segunda passada: travessia, linha, parallax, rolos de
   botão, vida interna. leovox-scroll-storyteller e
   leovox-animation-engineer.
4. Auditorias obrigatórias: leovox-brand-guard e leovox-a11y-auditor;
   leovox-performance-watchdog recomendado.
5. `npm run validate` + QA do PO no dev server. PR único da
   cena/pilares com mensagem proposta, commit sempre seu.
