// O Worker do site enquanto ele roda fechado (decisão do PO de
// 2026-11-13, até as licenças de fonte). Roda antes de qualquer arquivo
// (run_worker_first): sem usuário e senha certos, nada do dist/ sai.
// Abrir ao público depois: apagar este Worker do wrangler.jsonc (main e
// run_worker_first) e a Cloudflare volta a servir o dist/ direto.

import { autorizado } from './acesso'

type Ativos = { fetch(request: Request): Promise<Response> }

type Env = {
  ASSETS: Ativos
  PREVIEW_USER?: string
  PREVIEW_PASSWORD?: string
}

const SEM_INDICE = 'noindex, nofollow'

function fechado(status: 401 | 503): Response {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': SEM_INDICE,
  })
  if (status === 401)
    headers.set('WWW-Authenticate', 'Basic realm="Leovox Studios", charset="UTF-8"')
  const corpo = status === 401 ? 'Leovox Studios: acesso restrito.' : 'Leovox Studios: em breve.'
  return new Response(corpo, { status, headers })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // sem senha cadastrada, o site não abre pra ninguém
    if (!env.PREVIEW_PASSWORD) return fechado(503)
    if (
      !(await autorizado(
        request.headers.get('Authorization'),
        env.PREVIEW_USER,
        env.PREVIEW_PASSWORD,
      ))
    )
      return fechado(401)

    const resposta = await env.ASSETS.fetch(request)
    const saida = new Response(resposta.body, resposta)
    saida.headers.set('X-Robots-Tag', SEM_INDICE)
    // conteúdo atrás de senha não fica em cache compartilhado
    const cache = saida.headers.get('Cache-Control')
    if (cache?.includes('public'))
      saida.headers.set('Cache-Control', cache.replace('public', 'private'))
    return saida
  },
}
