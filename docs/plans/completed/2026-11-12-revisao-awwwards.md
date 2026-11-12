# Plano concluído: revisão contra o nível Awwwards

## Objetivo

Aplicar as correções da revisão estética de 2026-11-12 (UI comparada ao padrão Site of the Day),
rever as letras vazadas que disputavam atenção com o conteúdo e dar às folhas da tira uma física de
papel solto com o cursor. Laptop primeiro; placeholders mantidos.

## Escopo entregue

- Manifesto sem tela vazia: atos com a altura do conteúdo e entrada disparando quando o texto pisa em
  quadro (decisão 65).
- Trabalho: cartão de 21% para cerca de 40% da tela, etiqueta preta do nome sobre a borda do cartão,
  ordem, tipo e ano no escuro, anotação ao lado (decisão 66).
- Letras vazadas fora do fundo: marca d'água chapada, número da capa em tinta cheia, placeholder sem
  contorno (decisão 67).
- Capas como cartaz, menu fora de cena durante a tira (decisão 68).
- Física de folha solta em `folhaFisica.ts` e `useFolhas.ts` (decisão 69).
- Papel variando por painel, trilho com marca atual alta e contador em display, inclinação do texto
  por velocidade em 4,5 graus.
- Sombras sem filtro (decisão 70).
- Correção: o índice do Manifesto reaparecia sobre os Pilares depois de um salto direto do topo,
  porque o gatilho atravessado inteiro não dispara onToggle; a visibilidade agora lê o progresso a
  cada atualização.

## Segunda rodada: a ficha de parede (decisão 71)

- O nome do trabalho saiu de cima do cartão e foi pra uma ficha presa embaixo dele: recolhida enquanto
  a câmera anda, à mostra quando a tira assenta, marca-texto verde no hover, sempre à mostra sem pin.
- Cartão limitado também pela altura da tela; conferido em 1366x768, 1440x900 e 1850x880.
- O settle tenta de novo se a rolagem de assentamento for interrompida; depois de duas tentativas a
  ficha sai assim mesmo.
- Contador do trilho some quando o fecho verde espia na beirada.

## Evidências

- `npm run validate`: 33 testes de unidade (11 novos da física), contratos, tipos, lint, formato e
  build.
- `npx playwright test` em chromium-desktop, chromium-compact, chromium-mobile,
  chromium-reduced-motion e webkit-mobile, com o teste novo das folhas (sopro, pega, solta e volta ao
  prumo).
- `npm run smoke`: console limpo e fluxo íntegro.
- Quadros no Edge com GPU integrada em 1440x900: a máquina estava limitada a cerca de 30 fps nesta
  rodada (média de 33 ms em todas as cenas, inclusive no Hero), então só a comparação entre variantes
  vale. Com sombra em filtro, o p95 dos Pilares subia de 37,7 para 51 ms; com box-shadow ficou em
  41,7 ms, dentro do ruído da variante sem sombra.

## Riscos e limites

- O teste de navegação pelo trilho falhou uma vez em chromium-compact com cinco projetos em paralelo
  e passou nas sete repetições seguintes; instabilidade sob carga, a observar no CI.
- Firefox segue coberto só pelo CI.
- Medir os quadros de novo com a máquina na tomada e com os trabalhos reais.
- Responsividade fina da tira continua para a rodada final.

## Trabalho restante

- QA do PO no :5173, em especial o peso do balanço (giro, amortecimento e vento).
- Cena de contato ou rodapé depois do fecho.
- Trabalhos reais em `frentes.ts`.
