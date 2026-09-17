export type Frente = 'identidade' | 'digital' | 'tecnologia'

export type ProjectAsset = {
  readonly src?: string
  readonly kind?: 'image' | 'video'
  readonly poster?: string
  readonly alt: string
  readonly request: string
}

export type FrenteInfo = {
  readonly id: Frente
  readonly numero: string
  readonly nome: string
  readonly ancora: string
  readonly categoria: string
  readonly projeto: string
  readonly resumo: string
  readonly assets: Readonly<Record<string, ProjectAsset>>
}

// Os caminhos ficam vazios ate os trabalhos reais serem entregues. Cada
// painel mostra exatamente qual exportacao falta sem requisitar um arquivo
// inexistente nem fingir que o estudo ja e um case publicado.
export const FRENTES: readonly FrenteInfo[] = [
  {
    id: 'identidade',
    numero: '01',
    nome: 'Identidade & Design',
    ancora: 'CARA.',
    categoria: 'Branding / Sistema visual',
    projeto: 'Seu projeto de identidade',
    resumo:
      'Uma marca revelada pelo resultado, pelas aplicações e pela lógica que sustenta o sistema.',
    assets: {
      hero: { alt: 'Key visual do projeto de identidade', request: 'KEY VISUAL 16:10' },
      mark: { alt: 'Símbolo do projeto de identidade', request: 'SÍMBOLO SVG' },
      applicationOne: { alt: 'Primeira aplicação da identidade', request: 'APLICAÇÃO 01' },
      applicationTwo: { alt: 'Segunda aplicação da identidade', request: 'APLICAÇÃO 02' },
    },
  },
  {
    id: 'digital',
    numero: '02',
    nome: 'Presença Digital',
    ancora: 'PALCO.',
    categoria: 'Conteúdo / Edição de vídeo',
    projeto: 'Sua campanha em movimento',
    resumo: 'Uma campanha atravessando formatos, ritmo e canais sem perder a própria identidade.',
    assets: {
      vertical: { alt: 'Vídeo vertical da campanha', request: 'VÍDEO 9:16', kind: 'video' },
      square: { alt: 'Publicação quadrada da campanha', request: 'POST 1:1' },
      landscape: { alt: 'Thumbnail horizontal da campanha', request: 'THUMB 16:9' },
    },
  },
  {
    id: 'tecnologia',
    numero: '03',
    nome: 'Tecnologia & Automação',
    ancora: 'MOTOR.',
    categoria: 'Produto digital / Automação',
    projeto: 'Seu produto em funcionamento',
    resumo:
      'Uma experiência digital montada em cena, da entrada ao resultado que o usuário realmente vê.',
    assets: {
      desktop: { alt: 'Interface desktop do produto', request: 'CAPTURA DESKTOP' },
      mobile: { alt: 'Interface mobile do produto', request: 'CAPTURA MOBILE' },
      recording: {
        alt: 'Demonstração gravada do produto',
        request: 'GRAVAÇÃO 8 A 15S',
        kind: 'video',
      },
    },
  },
]
