# animation

Animações em vídeo do site. Por enquanto só o mascote do hero.

- `mascote-hero.webm`: animação do personagem no hero. VP8 com canal
  alpha, 24fps, 5.04s, ~2.6MB. Autoplay em loop até o scroll; no estado
  final do hero entra o png estático de `branding/mascot/`.

## Pipeline oficial do mascote (After Effects fora do circuito)

A fonte é o mp4 com fundo verde (`Motion/hero-animation.mp4`). O key é
feito direto no ffmpeg, sem After:

```
ffmpeg -r 24 -i hero-animation.mp4 -vf "chromakey=0x12AD01:0.12:0.08,despill=type=green:mix=0.12:expand=0,format=yuva420p" -c:v libvpx -crf 10 -b:v 4M -qmin 0 -qmax 32 -auto-alt-ref 0 -an mascote-hero.webm
```

- `0x12AD01` é o verde exato do fundo (amostrado dos cantos do frame).
- `-r 24` antes do input: o mp4 vem rotulado 60fps mas a animação é 24.
- similarity 0.12: acima disso o key come o personagem.
- blend 0.08: maior que isso o corpo inteiro fica semi-transparente,
  porque o chromakey mede distância só no plano de cor e os cinzas do
  mascote ficam "perto" do verde nessa régua.
- despill 0.12: tira a franja verde da borda sem avermelhar o branco.

## Regras aprendidas em 10/06/2026, na ordem em que doeram

1. Browser só decodifica VP9 até Profile 0. Export 10 bits/4:4:4 vira
   Profile 3 e o vídeo é ignorado sem erro.
2. `alpha_mode=1` no container não garante alpha nos pixels. Checar com
   alphaextract: mínimo perto de 0 E máximo em 255.
3. VP9 com alpha buga no decode por hardware de algumas GPUs (flicker
   preto/azul). VP8 com alpha decodifica por software e é imune.
4. fps quebrado (24,12) causa judder. Cravar 24.
5. Vídeo com alpha se valida no browser, nunca em player comum.
