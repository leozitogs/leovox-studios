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

Configuração pronta em `vercel.json` (2026-11-12): build do Vite, `dist/` como
saída, cabeçalhos de segurança (nosniff, frame DENY, referrer e permissions
policy) e cache imutável para `assets/`, que têm hash no nome. A CSP fica de fora
até o inventário de origens fechar: GSAP escreve estilo inline e o Three pode usar
workers por blob.

**Bloqueio de publicação:** produção só depois de resolver as licenças de fonte.
Lost in South é demo para uso pessoal; a família Extenda está sob CC BY-NC e dois
cortes são trial. Até lá, só preview com Deployment Protection ligada.

## CI/CD

O GitHub Actions já roda `validate` e `smoke` em push e PR para a main. No
deploy, o merge na main vira o gatilho de publicação.

## Pendências de lançamento

Licença comercial da Extenda (cortes trial), conversão de fontes para woff2 e de
imagens 4K para WebP ou AVIF.

Relacionado: [02-monitoramento](02-monitoramento.md), [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md).
