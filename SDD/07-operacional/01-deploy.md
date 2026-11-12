# 7.1 Deploy

## Estado atual

Ainda não publicado. Roda em dev (`npm run dev`, porta fixa 5173).

## Build

`npm run build` gera o `dist/` multipágina (home e 404). O `validate` completo
passa antes; o CI repete e roda o smoke.

## Hospedagem

Cloudflare Workers com assets estáticos, plano free, no domínio
`leovoxstudios.com.br` (decisão de 2026-11-12). Sem código de Worker: a Cloudflare
serve o `dist/` direto, e requisição a asset estático é gratuita e ilimitada.
Limites do free que importam aqui: 20.000 arquivos por versão e 25 MiB por
arquivo (o build tem cerca de 100 arquivos e o maior passa pouco de 6 MB).

| Arquivo                | Papel                                                                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `wrangler.jsonc`       | Nome do Worker, `dist/` como assets e a `404.html` servida com status 404 em qualquer URL quebrada                                 |
| `public/_headers`      | Cabeçalhos de segurança (nosniff, frame DENY, referrer e permissions policy) e cache imutável para `assets/`, que têm hash no nome |
| `public/.assetsignore` | O que fica fora do site no ar: READMEs das pastas e PDFs, TXTs e prévias de licença das fontes                                     |

A CSP fica de fora até o inventário de origens fechar: GSAP escreve estilo inline
e o Three pode usar workers por blob.

**Bloqueio de publicação:** produção só depois de resolver as licenças de fonte.
Lost in South é demo para uso pessoal; a família Extenda está sob CC BY-NC e dois
cortes são trial. Até lá, o domínio não aponta para o site, e o preview fica
fechado com Cloudflare Access.

## CI/CD

O GitHub Actions roda `validate` e `smoke` em push e PR para a main. O Workers
Builds da Cloudflare, ligado ao repositório, faz o build (`npm run build`) e o
deploy (`npx wrangler deploy`) a cada push na main; branch que não é a main ganha
uma URL de preview.

## Pendências de lançamento

Licença comercial da Extenda (CC BY-NC e cortes trial) e da Lost in South (demo), conversão de fontes para woff2 e de
imagens 4K para WebP ou AVIF.

Relacionado: [02-monitoramento](02-monitoramento.md), [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md).
