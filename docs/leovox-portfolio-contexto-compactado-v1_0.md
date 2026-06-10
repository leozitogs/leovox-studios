# Leovox Studios · Portfólio · Contexto Compactado para Build

> Marca autêntica, execução técnica, resultado real.
>
> Desenvolva seus sonhos. Isso é Leovox.

**Versão:** 1.0
**Data:** Junho de 2026
**Mantenedor:** Leonardo Gonçalves, fundador da Leovox Studios
**Status:** Documento de contexto autossuficiente para a conversa de construção. Consolida o Roteiro SEM CORTE v1.0 mais as decisões revisadas em briefing. Onde este documento diverge do roteiro original, este documento vence.

---

## 0. Como usar este documento

Este é o briefing compactado do portfólio. Ele dispensa a leitura do roteiro longo. Cole este arquivo na abertura de uma nova conversa e o time assume os papéis da Seção 1. As cenas já briefadas (Hero e Manifesto) têm spec pronta. As demais seguem o resumo da Seção 6 e serão briefadas cena a cena.

---

## 1. Papéis e contrato de trabalho

- **Claude Fable 5:** designer de produto, engenheiro de prompt e assistente pessoal. Define direção de produto, escreve os prompts do Claude Code, organiza o trabalho cena a cena, explica cada decisão.
- **Claude Code:** programador efetivo. Escreve o código contra o servidor de desenvolvimento.
- **Leonardo:** Product Owner. Aprova cada etapa, faz o design dos protótipos.
- **Git:** somente o Product Owner faz commits e pushes. O Claude Code nunca executa `git commit` nem `git push`. Ele pode propor uma mensagem de commit (imperativo em inglês) para o Product Owner usar.

**Regras de execução do Claude Code (inegociáveis):**
1. Um prompt por entregável. Nada de prompt gigante multi-camada, isso faz o Code pular item complexo.
2. Pausa obrigatória antes de codar: apresenta o plano (arquivos, libs, versões) e espera aprovação por escrito.
3. Valida no servidor existente em `:5173`. Nunca sobe uma instância Vite própria.
4. Screenshot automatizado é evidência, não aprovação. Só avança com a aprovação explícita do Product Owner por escrito.
5. Prototipagem antes de codar quando a cena for visual e dependente de movimento.
6. Sem travessão em nenhuma string, comentário ou copy. Grep obrigatório antes de propor commit.

---

## 2. Conceito-mãe: SEM CORTE

O portfólio é um plano-sequência: uma cena só, do primeiro scroll ao contato. Nenhuma transição é recarregamento de página. Toda passagem entre seções é movimento de câmera contínuo, um elemento que se transforma e leva ao próximo enquadramento. Conectividade deixa de ser valor abstrato e vira a mecânica literal do site.

A espinha técnica do efeito: FLIP mais Barba.js mais cena WebGL persistente. Um `<canvas>` R3F único e fixo sobrevive às trocas de rota, e o totem viaja dentro dele.

---

## 3. Decisões travadas (divergências do roteiro original)

1. **Totem = o mascote, não o monólito.** O mascote é o fio condutor do filme inteiro. Ele já é a marca, tem atitude e é autêntico. O monólito 3D foi descartado por ser linguagem genérica de agência tech. Onde o roteiro original disser monólito (divide em 4 nos pilares, vira porta no contato), adaptar para o mascote como presença narrativa ou para um elemento de marca que o mascote conduz.
2. **Hero define o tom.** Brutalismo mais streetwear: fundo de prédio brutalista P&B mantido como assinatura street, mascote centralizado em vídeo, headline DESENVOLVA SEUS SONHOS. O rótulo Creative Portfolio foi removido (genérico, e tinha erro de grafia).
3. **v1 é desktop apenas.** Adaptação mobile fica para a v2 da entrega oficial. Lembrete para a v2: no mobile o scroll precisa ser o gatilho garantido de toda revelação, já que toque não tem hover.
4. **Manifesto.** Graffiti spray clássico banido (usar condensado, marcador ou anotação à mão). O visual detalhado vai para a produção por ser dependente de movimento. A home usa a versão espinha do texto, o texto completo fica numa página de manifesto dedicada.

---

## 4. Marca aplicada (regras para o código)

**Cores:**
- `#19BC00` verde vivo (primária, identidade)
- `#FBFBFB` off-white (nunca `#FFFFFF`)
- `#000000` preto
- `#222222` cinza escuro
- `#C5F49D` verde pastel

**Regra de inversão de contraste:** fundo verde leva texto e logo pretos. Fundo escuro leva texto e logo verdes. A nav inverte conforme o fundo da seção.

**Regra de ouro:** o site vive em preto. O verde é a luz da cena por cor, nunca por efeito. Inversões pontuais para off-white funcionam como cena diurna e criam ritmo.

**Efeitos banidos por padrão:** glow, neon glow, bloom, halo, glitch, scanline, RGB split, holograma, código binário decorativo, ruído digital, graffiti spray clássico. **Permitido e incentivado:** halftone e serigrafia (herança de impressão).

**Tipografia:**
- **Anton:** display primária, headlines, statements monumentais, palavra-âncora por cena
- **Bebas Neue:** numeração (01, 02), métricas, kickers, labels
- **Extenda:** display especial para momentos-assinatura (cortes licenciados 30/40/60)
- **Montserrat:** corpo institucional
- **Poppins:** corpo conversacional, formulário, microcopy próximo
- **Lost in South:** selo Isso é Leovox
- **Schoolbell:** anotação à mão (voz humana)

**Regra absoluta:** travessão banido em todo e qualquer conteúdo Leovox, sem exceção.

---

## 5. Stack técnico

React mais Vite mais TypeScript. GSAP mais ScrollTrigger. Lenis (smooth scroll). Barba.js (transições de rota). React Three Fiber e WebGL (canvas persistente). FLIP para o elemento-âncora compartilhado.

Movimento padrão: `power4.inOut` para câmera longa, `expo.out` para entradas, `circ.inOut` para parallax. Durações: microinteração 0.2 a 0.4s, entrada de elemento 0.6 a 0.9s, transição entre cenas 0.9 a 1.4s. Corte proibido: nenhum fade branco ou reload visível. Respiro entre blocos é uma lâmina de verde chapado cruzando a tela.

---

## 6. As 9 cenas mais o footer (mapa compacto)

O site trata cada página como uma cena do mesmo filme.

| # | Cena | Papel em uma linha | Onde vive |
| --- | --- | --- | --- |
| 1 | Hero · A primeira tomada | Abre já em movimento, sem loading. O mascote totem em cena. | Home |
| 2 | Manifesto · A recusa em 4 atos | Coração verbal, inversão de luz preto a off-white. | Home |
| 3 | Pilares / Serviços · As 4 frentes | Prova ecossistema, não serviços soltos. Um ecossistema. Não quatro serviços. | Home |
| 4 | Selected Projects · O trailer | Recorte curado de 3 a 4 trabalhos para seduzir. | Home |
| 5 | Case Index · O acervo | Lista completa e navegável, filtros pelas 4 frentes. | Home |
| 6 | Case Study · O close-up | Página dedicada de cada projeto, faixa de resultado em destaque. | Página dedicada |
| 7 | Sobre / Fundador · O making-of | A história do fundador como prova viva da tese. Foto P&B mais halftone. | Home |
| 8 | Contato · A próxima cena é a sua | Clímax comercial, a tagline vira CTA, fecha o círculo com o hero. | Home |
| 9 | 404 · Fora do roteiro | Erro tratado como cena, não como página quebrada. | Estado especial |
| + | Footer mais easter egg | Despedida monumental (Obrigado.) e o mascote como recompensa. | Home |

Home é uma rota só em scroll contínuo (cenas 1, 2, 3, 4, 5, 7, 8 mais footer). Case Study (cena 6) é página dedicada, mas a entrada e saída são movimento de câmera sobre a miniatura.

---

## 7. Cena 1 · Hero (briefada, pronta para build)

**Conceito.** O site não abre com loading, abre com uma cena já em movimento. O mascote totem já está lá. A tese inteira em poucos segundos: a Leovox não te faz esperar, te coloca dentro da cena.

**Fundo.** Prédio brutalista P&B mais textura de papel e halftone. Manter bom contraste para a tipografia branca e verde respirarem. O prédio é palco, o mascote é protagonista.

**Mascote (totem).** Centralizado, vídeo com canal alpha. Pipeline: After Effects com Keylight, export ProRes 4444 RGB mais Alpha, conversão para WebM VP9 com alpha via FFmpeg para a web. Autoplay em loop, com poster de fallback.

**Headline: DESENVOLVA SEUS SONHOS.** Dois estados que são o mesmo elemento em momentos diferentes:
- Abertura: estado fantasma, o texto integrado ao céu e ao prédio como marca d'água.
- Resolvido: estado sólido, DESENVOLVA em off-white e SEUS SONHOS. em verde.

A animação revela o texto do fantasma ao sólido. O verbo desenvolver performa o próprio sentido: o texto se desenvolve na tela. Gatilho: no desktop, hover dá um preview antecipado, e o scroll faz a revelação total. (v1 desktop apenas.)

**Sem Creative Portfolio.** Kicker opcional no topo: `AGÊNCIA CRIATIVA DIGITAL · RECIFE` em Bebas.

**Header.** Não aparece no hero. Surge depois do hero como nav pill flutuante (mascote como marca, itens Projetos, Sobre, Serviços, e Contato como botão CTA). A nav inverte conforme o fundo da seção. Indicador de progresso vertical à direita.

**Saída.** A câmera acompanha o mascote e entrega a Cena 2 sem corte.

**QA.** Conferir a grafia do texto fantasma. O alvo é DESENVOLVA SEUS SONHOS, não variações com erro.

**Reduced-motion.** Vai direto ao estado resolvido, sem animação de revelação.

---

## 8. Cena 2 · Manifesto (briefada, visual detalhado para produção)

**Conceito.** Logo após o hero, o site para de mostrar e começa a falar. Estrutura fixa de 4 atos. Emoção alvo: identificação.

**Mecânica-assinatura: inversão de luz.** Ato 1 fundo preto, Ato 2 fundo cinza `#222`, Ato 3 inverte para off-white (o clímax, onde vive a frase-âncora), Ato 4 volta ao preto com peso máximo. Luz por cor, nunca por glow.

**Transição entre atos.** Lâmina de verde chapado cruzando a tela, rápida (`power4.inOut`, cerca de 0.5s). Nunca flash nem fade branco.

**Dispositivos visuais (herança serigrafia, referência streetwear aprovada).** Stack de repetição de linha, palavra-chave circulada à mão em verde, e riscar-e-corrigir (a palavra errada cortada, a certa do lado). O riscado executa o argumento do manifesto na tela. Graffiti spray clássico banido: usar condensado, marcador ou anotação à mão.

**Scroll.** Pinned cinematográfico curto (4 beats, saída fácil) ou scroll-snap. Decidir na produção. Reduced-motion vira 4 blocos empilhados, sem wipe, cores mantidas.

**Mascote.** Em aberto. Opção: presença via quadro-vídeo nas pontas (Ato 1 Recusa e Ato 4 Assinatura), sumindo no meio para a tipografia dominar. A tipografia é a protagonista da cena.

**Mantidos do protótipo aprovado:** header e nav pill, indicador de progresso com 4 pontos (um por ato), e o L da assinatura Leovox como marca d'água sutil.

**Texto-espinha para a home (palavra canônica, zero paráfrase):**

> Ato 1 · Recusa (preto)
> A LEOVOX NASCEU DE UMA RECUSA.
> stack: A recusa de se encaixar. / A recusa de escolher entre criativo ou técnico. / A recusa de achar que marca boa é só logo bonito.

> Ato 2 · Diagnóstico (cinza)
> O MERCADO ERROU FEIO.
> riscado: criativo OU técnico vira CRIATIVO E TÉCNICO

> Ato 3 · Solução (off-white, DIVISÃO circulada, amplificar em verde)
> A LEOVOX É O QUE ACONTECE QUANDO VOCÊ IGNORA ESSA DIVISÃO.
> EM VEZ DE SE ADEQUAR, A GENTE DECIDIU AMPLIFICAR.

> Ato 4 · Assinatura (preto, peso máximo)
> stack: A GENTE FAZ COM INTENÇÃO. / A GENTE FAZ COM CÓDIGO. / A GENTE FAZ COM AUTENTICIDADE.
> DESENVOLVA SEUS SONHOS. / ISSO É LEOVOX.

O texto completo do manifesto (com os parágrafos explicativos) vive numa página de manifesto dedicada, fora do fluxo da home.

---

## 9. Primeira iteração: o que o designer de produto entrega primeiro

Antes de qualquer cena, estruturar o repositório. Abaixo a proposta inicial do designer de produto para o Product Owner aprovar ou ajustar.

### A) Nome

- **Repositório:** manter o existente `leozitogs/leovox-studios`, ou criar `leovox-portfolio` (mais específico). Recomendação: manter `leovox-studios` para não fragmentar.
- **Codinome do projeto:** SEM CORTE (recomendado, reflete o conceito-mãe). Alternativas: ONE SHOT, PLANO-SEQUENCIA.
- **Title do site:** Leovox Studios · Desenvolva seus sonhos.

### B) Estrutura do repositório (proposta)

```
leovox-studios/
  public/
    fonts/            Anton, Bebas Neue, Extenda, Montserrat, Poppins, Lost in South, Schoolbell
    mascote/          video webm vp9 alpha mais poster
    textures/         halftone, papel, fundo de predio
  src/
    main.tsx
    App.tsx
    styles/
      tokens.css      cores, escala tipografica, espacamento, font-face
      global.css      reset, fundo preto base
    lib/
      gsap.ts         registro de ScrollTrigger
      lenis.ts        smooth scroll
      barba.ts        transicoes de rota
    canvas/
      PersistentCanvas.tsx   canvas R3F unico e fixo
      Totem.tsx              o mascote totem (placeholder por ora)
    scenes/
      Hero/
      Manifesto/
      Pilares/
      SelectedProjects/
      CaseIndex/
      Sobre/
      Contato/
      Footer/
    components/
      Header/         nav pill, aparece apos o hero, inverte por secao
      ScrollProgress/ indicador vertical
      Cursor/         cursor custom com colchetes
    hooks/
    data/
      projects.ts
  index.html
  vite.config.ts
  tsconfig.json
```

### C) Primeiro prompt para o Claude Code (entregável 1: scaffolding)

```
CONTEXTO: Voce e o Claude Code, programador do portfolio Leovox. Eu sou o
Product Owner. Leia o documento de contexto compactado que colei acima. Voce
NAO executa git commit nem git push em nenhuma hipotese.

ENTREGAVEL 1, somente scaffolding, nenhuma cena ainda:
- Vite mais React mais TypeScript.
- Dependencias: gsap, @studio-freight/lenis, @barba/core, three,
  @react-three/fiber, @react-three/drei.
- Crie a estrutura de pastas conforme a Secao 9B do documento.
- src/styles/tokens.css com as variaveis de marca: cores #19BC00, #FBFBFB,
  #000000, #222222, #C5F49D, e @font-face para as 7 fontes (placeholders em
  public/fonts).
- src/styles/global.css: reset, fundo preto base, off-white nunca #FFFFFF.
- src/lib/gsap.ts registrando ScrollTrigger. src/lib/lenis.ts. src/lib/barba.ts (stub).
- src/canvas/PersistentCanvas.tsx: um Canvas R3F unico e fixo, vazio por ora,
  preparado para sobreviver as trocas de rota.
- App.tsx renderiza o PersistentCanvas mais um placeholder "SEM CORTE"
  centralizado, so para validar que o projeto sobe.

REGRAS:
1. Primeiro me apresente o PLANO (arquivos que vai criar, versoes das libs) e
   ESPERE minha aprovacao por escrito. Nao escreva codigo antes.
2. Depois de aprovado e implementado, rode o dev server na porta 5173 e tire um
   screenshot. Valide em :5173, nao suba outra instancia Vite.
3. Sem travessao em nenhum arquivo. Rode grep para confirmar.
4. NAO faca commit nem push. Ao final, proponha UMA mensagem de commit em
   imperativo em ingles para eu usar.
5. Pare e espere minha aprovacao explicita por escrito antes de qualquer proximo passo.
```

---

## 10. Sequência sugerida de build

1. Entregável 1: scaffolding (Seção 9C).
2. Cena 1 Hero, fundo e layout estático primeiro, depois o vídeo do mascote, depois a revelação da headline.
3. Header mais nav (aparece após o hero) e indicador de progresso.
4. Cena 2 Manifesto, em produção, validando a inversão de luz e a lâmina verde.
5. Demais cenas, briefadas uma a uma antes de cada build.

Cada item é um prompt próprio, com pausa para plano e screenshot antes de avançar.

---

**Leovox Studios · Portfólio · Contexto Compactado v1.0**
**© 2026 Leovox Studios. Todos os direitos reservados.**
