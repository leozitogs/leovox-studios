# animation

Animações em vídeo do site. Por enquanto só o mascote do hero.

- `animated-404.webm`: o mascote saindo do zero da cena 404 (busto,
  maos na borda, olha pros lados, boné de mao, shrug e volta). Fonte
  mp4 verde 0x1CA40A do PO, 30fps, mesmo pipeline de chroma.
- `mascote-hero.webm`: animação do personagem no hero. VP8 com canal
  alpha, 1920x1080, 24fps, 5.04s, ~4.8MB. Autoplay em loop até o scroll;
  no estado final do hero entra o png estático de `branding/mascot/`.

## Pipeline oficial do mascote (After Effects fora do circuito)

A fonte é o mp4 com fundo verde (`Motion/hero-animation.mp4`), 1080p. O
key é feito direto no ffmpeg, sem After. O granulado da versao antiga
vinha de duas coisas somadas: ruido de compressao do VP8 com crf alto e
franja de chroma. A correcao e crf baixo (mata o ruido de compressao) e
verde MEDIDO do arquivo, nao o nominal, pro key fechar limpo sem comer a
borda do personagem.

```
ffmpeg -r 24 -i hero-animation.mp4 -vf "chromakey=0x14AF02:0.12:0.08,despill=type=green:mix=0.12:expand=0,format=yuva420p" -c:v libvpx -crf 6 -b:v 8M -qmin 0 -qmax 24 -auto-alt-ref 0 -an mascote-hero.webm
```

- `0x14AF02` é o verde MEDIDO dos quatro cantos do frame (a media bate
  nesse valor; o nominal 0x12AD01 ficava fora e deixava franja).
- `-r 24` antes do input: o mp4 vem rotulado 60fps mas a animação é 24.
- similarity 0.12: acima disso o key come o personagem.
- blend 0.08: maior que isso o corpo inteiro fica semi-transparente,
  porque o chromakey mede distância só no plano de cor e os cinzas do
  mascote ficam "perto" do verde nessa régua.
- despill mix 0.12: tira a franja verde da borda sem avermelhar o branco.
- crf 6 com teto `-b:v 8M` e `-qmax 24`: qualidade alta que apaga o
  granulado de compressao, sem estourar nos frames cheios.

## Regras aprendidas em 10/06/2026, na ordem em que doeram

1. Browser só decodifica VP9 até Profile 0. Export 10 bits/4:4:4 vira
   Profile 3 e o vídeo é ignorado sem erro.
2. `alpha_mode=1` no container não garante alpha nos pixels. Checar com
   alphaextract: mínimo perto de 0 E máximo em 255.
3. VP9 com alpha buga no decode por hardware de algumas GPUs (flicker
   preto/azul). VP8 com alpha decodifica por software e é imune.
4. fps quebrado (24,12) causa judder. Cravar 24.
5. Vídeo com alpha se valida no browser, nunca em player comum.
6. Manter a saida em 1920x1080. Upscale do webm com alpha pra 2560x1440
   apareceu correto no ffmpeg (alphaextract 0 a 255) mas decodificou
   corrompido no browser (frames preto/azul/magenta, personagem
   invertendo). VP8 com alpha em resolucao grande nao e confiavel no
   decode por software. Nitidez no 2K se resolve no CSS, nao inflando o
   webm.
7. A fonte e o mp4 verde `hero-animation.mp4`. O `mascote-hero-mestre.mov`
   (ProRes 4444 com alpha) nao e a tomada do hero usada em producao.
