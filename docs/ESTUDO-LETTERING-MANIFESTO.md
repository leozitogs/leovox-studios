# Estudo · o lettering do manifesto

> v1 · 2026-11-13. Status: **estudo, antes de qualquer protótipo.** O PO reprovou o protótipo
> C refinado ("o O desproporcional misturado com as fontes editoriais") e pediu um estudo com
> referências de lettering. A direção de movimento escolhida continua a C (através da letra,
> plano-sequência sobre papel); aqui se decide só **como o tipo se mistura**.
> Lâminas e referências em `C:\Design\Leovox\curadoria\manifesto-lettering\estudo\`.

## O que deu errado (estudo 0)

O protótipo trocou uma letra de uma palavra por um O de outra família (Bodoni Moda dentro da
Extenda). A lâmina 0 mede o problema, que são quatro desencontros numa letra só:

1. **Altura:** o O passa da altura de maiúscula da Extenda.
2. **Largura:** a Extenda é condensada e a Bodoni é larga; o O pesa mais que a palavra.
3. **Contraste de traço:** fino e grosso, numa palavra em que todas as outras letras têm traço
   uniforme.
4. **Ritmo:** o espaço entre as letras quebra em volta dele.

Trocar uma letra de família só funciona quando ela é **desenhada para aquela palavra**
(lettering de verdade, como numa marca). Vinda de outra fonte, ela vira um remendo.

## As referências

| Referência | O que ensina |
| --- | --- |
| **Paula Scher, The Public Theater** (Pentagram, desde 1994) | Mistura de tipos de madeira em pesos e larguras diferentes, em **faixas horizontais**, "sem pudor", herdada dos cartazes de teatro do século 19. A mistura é de peso e tamanho dentro de uma estrutura parecida (grotescas), e cada faixa ocupa a largura do cartaz. Fontes: [Typeroom](https://www.typeroom.eu/war-lust-type-paula-scher-the-public-theater-pentagram), [Cooper Hewitt](https://www.cooperhewitt.org/2018/04/05/everyones-public-theater/), [Poster House](https://collection-open.posterhouse.org/?p=21119), [Fonts In Use](https://fontsinuse.com/uses/35811/pericles-the-public-theater) |
| **Gráfica Fidalga, São Paulo** | O lambe-lambe de tipo de madeira entalhado, que sobrevive em São Paulo: a mesma lógica de faixas, com a nossa rua. Fontes: [Tristan Manco](https://www.tristanmanco.com/tag/grafica-fidalga), [Cool Hunting](https://coolhunting.com/culture/cool-hunting-vi-31/) |
| **Fonts In Use, "Hardmix"** | Misturas fortes que dão certo porque cada família tem um papel (News Gothic com Cooper Black, Bureau Grot com Letter Gothic). Fonte: [Fonts In Use](https://fontsinuse.com/sets/365/hardmix) |
| **Princípios de combinação** (FontShop, Ellen Lupton) | Alinhar a altura (x ou maiúscula) antes de tudo; combinar fontes **muito diferentes ou idênticas**, nunca quase iguais; no máximo duas ou três famílias. Fontes: [FontShop](https://www.fontshop.com/content/how-to-mix-type), [SitePoint](https://www.sitepoint.com/considerations-when-mixing-typefaces/) |

## As regras que saem do estudo

1. **A mistura acontece por palavra ou por linha, nunca por letra.**
2. **Cada família tem um papel fixo**, e o leitor aprende esse papel na primeira frase.
3. **A altura de maiúscula é a mesma na linha.** A palavra de outra família é escalada até a
   altura das maiúsculas encostar na da grotesca, sobre a mesma linha de base.
4. **Contraste forte ou nenhum.** Grotesca condensada com serifada itálica é contraste forte;
   duas grotescas parecidas lado a lado brigam.
5. **No máximo três vozes**, e a terceira aparece pouco.
6. **O verde marca a palavra-chave**; a cor não é mais uma voz.

## Os três sistemas (lâminas 1 a 3)

### Sistema 1 · Bandas de madeira (Scher, Fidalga)

- **Vozes:** só as grotescas condensadas da casa (Extenda, Anton, Bebas), em pesos e
  espaçamentos diferentes.
- **Regra de composição:** cada linha ocupa a medida do bloco, com o corpo mudando linha a linha,
  e a tarja preta faz o papel da faixa do cartaz.
- **Por que funciona:** o contraste vem do tamanho e do peso, e o parentesco vem da estrutura.
  É o mais próximo do lambe-lambe que já esteve em pauta.

### Sistema 2 · Duas vozes, papéis fixos (Hardmix)

- **Vozes:** a grotesca condensada afirma (MERCADO, FEIO, IGNORA); a serifada itálica
  (Instrument Serif) conversa (errou, divisão, os conectivos).
- **Por que funciona:** as duas são estreitas, então dividem a linha sem brigar; a itálica é
  escalada até a altura das maiúsculas da grotesca.
- **É a mais editorial das três.**

### Sistema 3 · O tipo é a tese (criativo × técnico)

- **Vozes:**
  - a grotesca da casa é a voz da Leovox;
  - a serifada itálica é o lado criativo ("criativo");
  - a monoespaçada (IBM Plex Mono) é o lado técnico ("TÉCNICO.").
- **Por que funciona:** trocar de fonte já diz alguma coisa, porque o manifesto é sobre a
  divisão entre criativo e técnico.
- **Risco:** três vozes pedem disciplina. A mono nunca passa de uma palavra por frase.

## Como isso conversa com a direção C

O mergulho "através da letra" continua possível sem remendo nenhum: a câmera mira no **miolo
de uma letra da própria fonte da frase**. Em vez de trocar o O, o sistema escolhe, em cada
frase, a palavra mais pesada (em Anton ou Extenda, no corpo maior da composição) e mergulha no
miolo dela.

Com o corpo grande que o Sistema 1 dá às linhas curtas (o "RECUSA." ou o "FEIO."), o miolo fica
grande o bastante para a câmera atravessar sem cair no traço.

## Decisão para o PO

1. Qual sistema de mistura segue para o protótipo de movimento: **1, 2 ou 3** (ou uma combinação
   de dois)?
2. Na C, o mergulho pode ser no miolo de uma letra da própria fonte, na palavra mais pesada de
   cada frase?
