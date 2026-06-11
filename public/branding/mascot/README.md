# Mascote (totem)

Dropar aqui os arquivos do pipeline do mascote (Seção 7 do contexto):

- `mascote.webm` (WebM VP9 com canal alpha, exportado do ProRes 4444 via FFmpeg)
- `mascote-poster.png` (poster de fallback, com transparência)

Comando de referência para a conversão:

```
ffmpeg -i mascote-prores4444.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 30 mascote.webm
```
