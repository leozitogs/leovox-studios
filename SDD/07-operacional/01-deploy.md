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

**Bloqueio de publicação:** produção aberta só depois de resolver as licenças de
fonte. Lost in South é demo para uso pessoal; a família Extenda está sob CC BY-NC e
dois cortes são trial.

### Domínio fechado (2026-11-13)

Decisão do PO: até as licenças, o site roda no domínio, mas fechado por senha. O
Cloudflare Access foi descartado porque o Zero Trust Free exige cartão cadastrado.

- `leovoxstudios.com.br` e `www` são custom domains do Worker `worker/index.ts`,
  que roda antes de qualquer arquivo (`run_worker_first`) e pede usuário e senha
  (HTTP Basic). Usuário em `vars` (`PREVIEW_USER`); a senha é segredo do Worker,
  cadastrado pelo PO com `npx wrangler secret put PREVIEW_PASSWORD`, e nunca vai
  pro repositório.
- Falha fechado: sem a senha cadastrada, tudo responde 503. Senha errada, 401.
  Tudo sai com `X-Robots-Tag: noindex` e cache privado.
- `workers_dev` e `preview_urls` desligados: sem isso, o `*.workers.dev` e as URLs
  de preview seriam portas abertas ao redor da senha.
- `compatibility_date` acompanha o runtime da versão fixada do Wrangler (o
  `wrangler dev` recusa data mais nova que o binário).
- Abrir ao público, depois das licenças: tirar `main`, `vars`, `binding` e
  `run_worker_first` do `wrangler.jsonc`; a Cloudflare volta a servir o `dist/`
  direto.

## CI/CD

O GitHub Actions roda `validate` e `smoke` em push e PR para a main. O Workers
Builds da Cloudflare, ligado ao repositório, faz o build (`npm run build`) e o
deploy (`npx wrangler deploy`) a cada push na main; branch que não é a main ganha
uma URL de preview.

## Pendências de lançamento

Licença comercial da Extenda (CC BY-NC e cortes trial) e da Lost in South (demo), conversão de fontes para woff2 e de
imagens 4K para WebP ou AVIF.

Relacionado: [02-monitoramento](02-monitoramento.md), [../06-testes/01-estrategia-testes](../06-testes/01-estrategia-testes.md).
