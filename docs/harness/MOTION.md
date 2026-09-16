# Contrato de movimento

## Invariantes

1. O mesmo progresso produz o mesmo estado visual.
2. Ida, reverse e interrupção terminam em estados válidos.
3. Nenhuma timeline, listener ou estilo inline órfão sobrevive ao teardown.
4. Opacidade scrubada é calculada como função pura.
5. Reduced motion remove pin e movimento não essencial sem esconder conteúdo.
6. Saltos deliberados não deixam o palco entre beats.

## Cenários obrigatórios

- Scroll lento, rápido e alternando direção.
- Reverse durante uma travessia.
- Resize em cada estado de descanso.
- Aba perde e recupera foco.
- Fonte, vídeo ou imagem chegam com atraso.
- Teclado durante pin.
- Entrada direta por URL e reload no meio da página.

Um teste de movimento deve observar estado final e resíduos. Duração exata e caminho interno só entram no contrato quando forem parte da experiência aprovada.
