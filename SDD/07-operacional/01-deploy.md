# 7.1 Deploy

## Estado atual

Ainda não publicado. Roda em dev (`npm run dev`, porta fixa 5173).

## Build

`npm run build` gera o `dist/` multipágina (home e 404). O `validate` completo
passa antes; o CI repete e roda o smoke.

## Hospedagem proposta

Estática em Vercel ou Netlify: deploy automático por push, e preview deploy por
PR (cada `cena/*` ganha uma URL pra avaliar no ar). A `404.html` é servida por
convenção em qualquer URL quebrada.

## CI/CD

O GitHub Actions já roda `validate` e `smoke` em push e PR para a main. No
deploy, o merge na main vira o gatilho de publicação.

## Pendências de lançamento

Licença comercial da Extenda (cortes trial), conversão de fontes para woff2 e de
imagens 4K para WebP ou AVIF.

Relacionado: [02-monitoramento](02-monitoramento.md), [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md).
