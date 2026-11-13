// A física das folhas soltas da tira (capas e cartões). Cada folha é um
// pêndulo de papel pendurado pelo topo: a gravidade a puxa de volta ao
// prumo, o ar a amortece devagar (papel balança, não trava), o vento do
// cursor e a inércia da câmera a empurram, e a mão pode pegá-la e
// soltá-la. Além do giro, a folha empena no ar (rotateX e rotateY) e
// descola da parede perto do cursor.
//
// Tudo aqui é função pura de estado, entrada e dt, em graus e segundos:
// testável sem browser e determinístico pro harness.

export type Folha = {
  /** giro no plano da tela, em graus; positivo leva a base pra esquerda */
  ang: number
  /** velocidade angular, em graus por segundo */
  vAng: number
  /** empeno em X: a base vem pra frente (graus) */
  rx: number
  vRx: number
  /** torção em Y (graus) */
  ry: number
  vRy: number
  /** o quanto a folha descolou da parede (0 a 1) */
  lift: number
}

export type Entrada = {
  /** proximidade do cursor à folha: 1 em cima dela, 0 longe */
  prox: number
  /** altura do cursor na folha: 0 no topo (pivô), 1 na base */
  alavanca: number
  /** posição horizontal do cursor em relação ao centro da folha (-1 a 1) */
  lado: number
  /** velocidade do cursor, px/s */
  vx: number
  vy: number
  /** aceleração horizontal da câmera, px/s² (negativa: tira acelera pra esquerda) */
  camAcc: number
  /** giro pedido pela mão quando a folha está pega; null quando solta */
  alvoMao: number | null
}

export type Material = {
  /** rigidez da gravidade: ω0² do pêndulo, em 1/s² */
  gravidade: number
  /** amortecimento do ar, em 1/s */
  ar: number
  /** ganho do vento do cursor, em (graus/s²) por (px/s) */
  vento: number
  /** ganho da inércia da câmera, em (graus/s²) por (px/s²) */
  inercia: number
  /** giro máximo solto, em graus (a mão pode levar ao dobro) */
  limite: number
}

/** Cartão de trabalho: papel leve, balança solto (período perto de 1,2 s). */
export const CARTAO: Material = {
  gravidade: 27,
  ar: 2.5,
  vento: 0.16,
  inercia: 0.009,
  limite: 10,
}

/** Capa: folha grande, mais pesada, balança menos e assenta antes. */
export const CAPA: Material = {
  gravidade: 20,
  ar: 2.6,
  vento: 0.08,
  inercia: 0.005,
  limite: 6,
}

export const REPOUSO: Readonly<Folha> = Object.freeze({
  ang: 0,
  vAng: 0,
  rx: 0,
  vRx: 0,
  ry: 0,
  vRy: 0,
  lift: 0,
})

export const novaFolha = (): Folha => ({ ...REPOUSO })

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

// mola amortecida genérica pros eixos de empeno
function mola(x: number, v: number, alvo: number, k: number, c: number, dt: number) {
  const a = k * (alvo - x) - c * v
  const nv = v + a * dt
  return { x: x + nv * dt, v: nv }
}

/**
 * Avança a folha `dt` segundos (integração semi-implícita de Euler, com
 * subpassos pra continuar estável num quadro longo).
 */
export function passo(folha: Folha, e: Entrada, m: Material, dt: number): Folha {
  const total = clamp(dt, 0, 0.05)
  const n = Math.max(1, Math.ceil(total / (1 / 120)))
  const h = total / n
  let f = folha
  for (let i = 0; i < n; i += 1) f = subpasso(f, e, m, h)
  return f
}

function subpasso(f: Folha, e: Entrada, m: Material, h: number): Folha {
  let { ang, vAng } = f

  if (e.alvoMao !== null) {
    // pega: a mão manda, com uma mola firme (a folha ainda tem peso)
    const a = 420 * (clamp(e.alvoMao, -m.limite * 2, m.limite * 2) - ang) - 38 * vAng
    vAng += a * h
  } else {
    const rad = (ang * Math.PI) / 180
    // gravidade puxa pro prumo (sen pra amplitude grande), o ar freia
    let a = (-m.gravidade * (Math.sin(rad) * 180)) / Math.PI - m.ar * vAng
    // vento: o cursor arrastando pra direita empurra a base pra direita
    // (giro negativo), mais forte quanto mais longe do pivô
    a += -m.vento * e.prox * (0.25 + 0.75 * e.alavanca) * e.vx
    // inércia: a parede acelera, a base fica pra trás
    a += m.inercia * e.camAcc
    vAng += a * h
  }
  ang += vAng * h
  // solta, a folha não passa do limite: o papel bate no ar e volta macio
  const teto = e.alvoMao !== null ? m.limite * 2 : m.limite
  if (Math.abs(ang) > teto) {
    ang = Math.sign(ang) * teto
    if (Math.sign(vAng) === Math.sign(ang)) vAng *= -0.25
  }

  // empeno: a base vem na direção do cursor perto dela, e um sopro
  // vertical rápido levanta ou abaixa a base
  const alvoRx = clamp(e.prox * (3 + 5 * e.alavanca) - e.vy * 0.0025 * e.prox, -6, 10)
  const rx = mola(f.rx, f.vRx, alvoRx, 90, 9, h)
  // torção: o balanço torce a folha e o lado do cursor puxa a borda
  const alvoRy = clamp(vAng * 0.08 + e.lado * e.prox * 6, -12, 12)
  const ry = mola(f.ry, f.vRy, alvoRy, 70, 8, h)
  // descolar da parede: segue a proximidade, sem mola (papel não quica)
  const alvoLift = e.alvoMao !== null ? 1 : e.prox
  const lift = f.lift + (alvoLift - f.lift) * (1 - Math.exp(-h * 9))

  return { ang, vAng, rx: rx.x, vRx: rx.v, ry: ry.x, vRy: ry.v, lift }
}

/** Uma folha parada: dá pra dormir o loop sem salto visível. */
export function emRepouso(f: Folha): boolean {
  return (
    Math.abs(f.ang) < 0.02 &&
    Math.abs(f.vAng) < 0.05 &&
    Math.abs(f.rx) < 0.02 &&
    Math.abs(f.vRx) < 0.05 &&
    Math.abs(f.ry) < 0.02 &&
    Math.abs(f.vRy) < 0.05 &&
    f.lift < 0.003
  )
}

/**
 * O giro que a mão pede ao pegar: o ângulo entre a vertical do pivô e o
 * cursor, menos o ângulo de onde a folha foi pega (pegar não dá tranco).
 */
export function anguloDaMao(pivoX: number, pivoY: number, x: number, y: number): number {
  // ângulo do vetor pivô→cursor em relação à vertical pra baixo; cursor à
  // direita da vertical leva a base pra direita, isto é, giro negativo
  return (-Math.atan2(x - pivoX, Math.max(1, y - pivoY)) * 180) / Math.PI
}

/**
 * Proximidade do cursor a uma caixa: 1 dentro, cai a 0 a `alcance` px.
 */
export function proximidade(
  box: { left: number; top: number; right: number; bottom: number },
  x: number,
  y: number,
  alcance = 140,
): number {
  const dx = Math.max(box.left - x, 0, x - box.right)
  const dy = Math.max(box.top - y, 0, y - box.bottom)
  return clamp(1 - Math.hypot(dx, dy) / alcance, 0, 1)
}
