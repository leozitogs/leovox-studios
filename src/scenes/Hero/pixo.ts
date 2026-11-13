// O pixo verde do hero é a assinatura feita à mão da Leovox. Pra ele poder
// ser escrito e desfeito pelo scroll, a arte raster (leovox-grafism.png,
// 1674x1184) é revelada por uma máscara de traços grossos que seguem o
// esqueleto da assinatura, na ordem em que a mão escreve. Os pontos foram
// traçados sobre o esqueleto da imagem; com 112 de espessura, a máscara
// cobre 99% da tinta, e o resto entra no fim, quando a imagem cheia acende.

export const PIXO_LARGURA = 1674
export const PIXO_ALTURA = 1184
export const PIXO_TRACO = 112

type Ponto = readonly [number, number]

export const PIXO_TRACOS: readonly (readonly Ponto[])[] = [
  [
    [465, 50],
    [420, 120],
    [375, 200],
    [345, 265],
    [300, 335],
    [275, 395],
    [262, 425],
    [235, 460],
    [195, 492],
    [125, 532],
  ],
  [
    [215, 215],
    [260, 222],
    [320, 212],
    [375, 200],
  ],
  [
    [195, 490],
    [240, 525],
    [300, 525],
    [385, 482],
    [515, 466],
    [518, 410],
    [570, 378],
    [572, 305],
  ],
  [
    [270, 418],
    [380, 405],
    [428, 345],
  ],
  [
    [380, 405],
    [385, 480],
  ],
  [
    [232, 540],
    [170, 590],
    [100, 690],
    [50, 800],
    [40, 900],
    [75, 965],
    [150, 1005],
    [230, 1008],
    [292, 1000],
    [320, 970],
    [400, 968],
    [432, 940],
    [495, 928],
    [545, 880],
    [620, 858],
    [680, 810],
    [712, 730],
    [715, 650],
    [700, 590],
    [650, 565],
  ],
  [
    [632, 560],
    [560, 575],
    [470, 588],
    [400, 610],
    [305, 662],
    [287, 712],
    [350, 706],
    [432, 690],
    [530, 640],
    [565, 585],
  ],
  [
    [290, 1000],
    [270, 1080],
    [262, 1140],
  ],
  [
    [330, 880],
    [322, 970],
  ],
  [
    [440, 830],
    [432, 940],
    [400, 1050],
  ],
  [
    [550, 800],
    [545, 880],
  ],
  [
    [570, 378],
    [600, 450],
    [630, 560],
  ],
  [
    [605, 448],
    [665, 448],
    [690, 438],
  ],
  [
    [650, 300],
    [705, 302],
    [762, 300],
    [770, 410],
    [780, 525],
  ],
  [
    [780, 415],
    [835, 340],
    [875, 326],
    [885, 270],
  ],
  [
    [875, 326],
    [930, 385],
    [935, 475],
    [965, 488],
    [1000, 470],
    [1045, 420],
    [1045, 362],
    [1020, 300],
    [1005, 292],
  ],
  [
    [930, 388],
    [1000, 382],
    [1045, 362],
  ],
  [
    [632, 560],
    [700, 558],
    [782, 527],
    [870, 512],
    [948, 500],
    [1045, 462],
    [1130, 440],
    [1245, 412],
    [1312, 412],
  ],
  [
    [1075, 195],
    [1168, 293],
    [1205, 345],
    [1245, 408],
  ],
  [
    [1245, 175],
    [1168, 293],
    [1140, 350],
    [1125, 440],
  ],
  [
    [965, 488],
    [935, 560],
    [870, 600],
    [812, 640],
  ],
  [
    [1095, 455],
    [1090, 520],
    [1070, 590],
  ],
  [
    [1380, 265],
    [1315, 412],
    [1290, 520],
    [1262, 640],
    [1240, 770],
  ],
  [
    [1435, 335],
    [1405, 460],
    [1382, 580],
  ],
  [
    [1480, 478],
    [1555, 452],
    [1520, 480],
    [1490, 540],
    [1492, 595],
    [1625, 598],
  ],
]

/** Caminho SVG de cada traço, na ordem de escrita. */
export const PIXO_CAMINHOS = PIXO_TRACOS.map((t) => 'M' + t.map(([x, y]) => `${x} ${y}`).join(' L'))

// a lata levanta entre um traço e outro: um respiro proporcional à distância
const LEVANTA = 60
const COMPRIMENTOS = PIXO_TRACOS.map((t) =>
  t.slice(1).reduce((acc, [x, y], i) => acc + Math.hypot(x - t[i][0], y - t[i][1]), 0),
)
const TOTAL = COMPRIMENTOS.reduce((a, c) => a + c + LEVANTA, 0)

/**
 * Quanto de cada traço está escrito quando a mão percorreu a fração d
 * (0 a 1) da assinatura inteira. Função pura, usada pelo scrub.
 */
export function pixoEscrito(d: number): number[] {
  let acc = 0
  return COMPRIMENTOS.map((c) => {
    const local = Math.min(1, Math.max(0, (d * TOTAL - acc) / c))
    acc += c + LEVANTA
    return local
  })
}
