# 8.1 Exemplos e referências

## Referências visuais (régua, não cópia)

- leoleo.studio: coreografia do header (a bola que vira pill).
- landonorris.com: fundo vivo discreto, mistura de fontes na mesma frase.
- niccolomiranda.com: capítulos com mudança de clima.
- suparistudios.com e fielddaysound.tv: fechamento-statement e tipografia que reage ao cursor (ato 4 do Manifesto).

## Pipeline de vídeo com alpha (comando canônico)

Fonte mp4 com fundo verde, chroma no ffmpeg, saída VP8 com alpha. Detalhe em
`public/animation/README.md`:

```
ffmpeg -r 24 -i fonte.mp4 -vf "chromakey=0xGREEN:0.12:0.08,despill=type=green:mix=0.12:expand=0,format=yuva420p" -c:v libvpx -crf 10 -b:v 4M -qmin 0 -qmax 32 -auto-alt-ref 0 -an saida.webm
```

Checklist de aceite: profile 0, `alpha_mode` 1 e alphaextract com mínimo perto de 0.

## Squad de subagentes Leovox

15 agentes em `.claude/agents/`, orquestrados pelo `leovox-conductor`, com o
`CLAUDE.md` na raiz. O squad executa o código a partir dos prompts do PO.

## Aprendizados de ferramenta

O glyph "0" da fonte Lost in South é vazio (usar a letra O nos dígitos, por
exemplo "4O4"); texturas tratadas pelo PO entram como camada normal, sem
mesclagem.

Relacionado: [glossario](glossario.md), `public/animation/README.md`.
