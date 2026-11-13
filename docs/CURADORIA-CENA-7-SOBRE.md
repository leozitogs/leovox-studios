# Curadoria de direção de arte · Cena 7 · Sobre

> v1 · 2026-11-13. Complementa o `BRIEFING-CENA-7-SOBRE.md` (conceito "folha de contato").
> Status: **proposta, aguardando o PO.**
> Os quadros de referência e a amostra de matéria ficam fora do repositório, porque são
> capturas de sites de terceiros: `C:\Design\Leovox\curadoria\cena-7-sobre\`.

## O que foi visto

Sites e elementos vistos ao vivo, em 1440x900, na entrada e em duas ou três rolagens:

| # | Referência | Por que entrou |
| --- | --- | --- |
| 01 | [Jason Bergh](https://www.jasonbergh.com/) | A fita de 35mm como interface: numeração de borda, marcas de registro, timecode, rótulos em mono |
| 02 | [People's Audit, índice de arquivos](https://www.awwwards.com/inspiration/subjects-index-documented-files-peoples-audit) | Retrato P&B tratado como documento numerado ("FILE 01/03") |
| 03 | [Tux Creative House, créditos de filme](https://www.awwwards.com/inspiration/team-page-with-movie-credits-tux-creative-house) | Função alinhada à direita, nome à esquerda, rolando com a página |
| 04 | [35mm, galeria em rolo](https://www.awwwards.com/inspiration/film-roll-gallery-35mm) | A matéria do negativo (furos, base, texto técnico) |
| 05 | [Lydia Leiwang, filtro halftone](https://www.awwwards.com/inspiration/halftone-video-filter-lydia-leiwangs-portfolio) | Halftone como linguagem, não como efeito |
| 06 | [Eduardo Souza, "Sobre mim"](https://eduardosouza-tech.github.io/EduardoDev/) | A régua de nível da Leovox, e um alerta (abaixo) |
| 07 | [Vercel Ship, crachá 3D](https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber) | Referência técnica de física de cordão |
| 08 | [Naked City Films](https://www.nakedcityfilms.com/) | Contenção: um bloco de texto grande e muito vazio |

Também vistos e descartados: Lusion (3D pesado, fora da linguagem da marca), First Frame da
Beaucoup (grade de quadrados, sem relação com o filme), Bullion Productions (só tipografia,
sem matéria).

## O que a curadoria mostrou

1. **O filme funciona como interface, não como fantasia.** No Bergh, a fita de 35mm aparece só
   nos detalhes (números de borda, cantos de registro, timecode) e nunca vira caricatura de
   cinema. É esse o tom da folha de contato: o negativo é a moldura, o conteúdo é a prova.
2. **Um retrato numerado vira documento, não "quem somos".** O People's Audit trata cada
   pessoa como arquivo. Isso casa com a frase-guia do briefing: a história como prova da tese.
3. **Contenção vale mais que decoração.** Depois do hero, que você acabou de deixar "mais
   simples e eficiente", a cena precisa de uma ideia por tela. O Naked City faz isso com um
   único bloco de texto e muito vazio.
4. **Alerta: o elenco em crachás de cordão colide com a régua.** O "Sobre mim" do Eduardo
   já usa um crachá pendurado num cordão verde. Os crachás do beat 3 do briefing seriam lidos
   como cópia da referência de nível, mesmo com outra física. Precisa trocar o objeto.

## Direção recomendada: a folha de contato, revelada pela mão

O briefing fica, com quatro regras de direção de arte e quatro cortes.

### Regras

1. **Verde é a mão.** O verde da marca aparece só no que a mão faz: o círculo em volta do take
   escolhido, as setas e o sublinhado sob "QUE DESENHA". É a mesma mão que escreve o pixo no
   hero, com a mesma técnica (traços por máscara, `src/scenes/Hero/pixo.ts`). Assim a cena
   continua o hero em vez de começar do zero.
2. **Nenhuma cursiva tipográfica.** O hero acabou de vetar a cursiva no meio do editorial. As
   anotações à mão devem ser a **letra real do Leonardo**, escaneada e escrita pela máscara,
   como o pixo. Até o asset chegar, as anotações são etiquetas em Bebas verde.
3. **Tipografia da casa, em três vozes.** Extenda para as afirmações, em continuidade com o
   hero. Bebas para código de borda, números de fotograma e créditos. Montserrat para o texto
   corrido.
4. **Matéria: papel, negativo e halftone.** Off-white com textura de papel; tiras de negativo
   em #222222, com furos e código de borda ("LEOVOX 400 · 2023 · 12A"); fotos P&B em
   halftone pré-processado, da mesma família do fundo novo do hero.

### Cortes e trocas no briefing

| No briefing | Proposta | Motivo |
| --- | --- | --- |
| Elenco em crachás de set pendurados por cordão | **Provas fotográficas no varal de secagem**, presas por pregador, com a física da folha solta | Evita a colisão com o crachá do Eduardo e é o objeto real da câmara escura, coerente com o making-of |
| Anotações em Schoolbell | Letra real escaneada, escrita pela máscara; até lá, Bebas verde | Sem cursiva tipográfica (regra 2) |
| Claquete na chegada | **Cortar** | O fecho verde dos Pilares já faz a passagem; um gesto a menos |
| Carimbo "TAKE BOM" | **Cortar** | O círculo da mão já é a escolha do take; dois sinais dizem a mesma coisa |

### Uma ideia nova de motion: a revelação

Cada fotograma nasce **branco, como papel fotográfico na bandeja**, e o halftone aparece à
medida que a tira chega ao centro. É a câmara escura sem escurecer a cena: a revelação é
função pura do progresso (câmera), e o círculo verde continua gesto, disparado quando a tira
assenta. Na volta do scroll a foto "desrevela". O halftone é pré-processado; o que anima é só
a opacidade de duas camadas (papel e foto), sem `filter` animado (decisão 70).

### Amostra de matéria

A amostra `curadoria-cena7-amostra.png`, na pasta da curadoria, mostra os materiais juntos, não
o layout final:
- folha com três tiras;
- círculo e seta da mão;
- retrato numerado e a tese com o sublinhado verde;
- varal do elenco;
- créditos.

As fotos são placeholders em halftone (prédios do hero e o mascote).

## Assets necessários (do PO)

- 9 a 12 fotos ou capturas reais da trajetória, 3 a 4 por ano (2020, 2023, 2025).
- Retrato do fundador, com fundo limpo para recorte.
- **Letra e assinatura do Leonardo, escaneadas** (novo: as anotações e a assinatura usam a
  mão real).
- Elenco: nome, função, foto e o ok de cada pessoa.

## Decisões para o PO

1. A direção "folha de contato, revelada pela mão" está aprovada?
2. O varal de secagem entra no lugar dos crachás de cordão?
3. Corta a claquete e o carimbo?
4. As anotações usam a sua letra real (escaneada)?
5. Seguem abertas as quatro decisões do briefing: conceito, elenco, história pessoal e como
   citar a engenharia de IA.

Com essas respostas, o próximo passo é o protótipo de motion com os assets reais (ou
placeholders), como foi feito no hero, antes de qualquer código na cena.
