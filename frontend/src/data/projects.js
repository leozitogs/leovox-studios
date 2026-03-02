// Dados dos projetos para o Logofolio
// Cada projeto contém id, name, imagePath (logo) e mockups (array de caminhos de mockups)

const projects = [
  {
    id: 'celula-israel',
    name: 'Célula Israel',
    imagePath: '/src/assets/mockups/logo_principal_cel_israel.png',
    mockups: [
      '/src/assets/mockup/mockup_cartao.png',
      '/src/assets/mockups/mockup_banner.png',
      '/src/assets/mockups/mockup_casaco.png',
    ],
  },
  {
    id: 'amaranthos',
    name: 'Amaranthos',
    imagePath: '/src/assets/mockups/logo_amaranthos.png',
    mockups: [
      '/src/assets/mockups/mockup_papelaria.png',
      '/src/assets/mockups/mockup_ecobag.png',
    ],
  },
  {
    id: 'saikai',
    name: 'Saikai',
    imagePath: '/src/assets/mockups/logo_saikai.png',
    mockups: [
      '/src/assets/mockups/logo_saikai_2.png',
      '/src/assets/mockups/mockup_copos.png',
    ],
  },
  {
    id: 'espetinho',
    name: 'Espetinho',
    imagePath: '/src/assets/mockups/logo_espetinho.png',
    mockups: [
      '/src/assets/mockups/mockup_caderno.png',
      '/src/assets/mockups/mockup_crachas.png',
    ],
  },
  {
    id: 'scina',
    name: 'Scina',
    imagePath: '/src/assets/mockups/logo_scina.png',
    mockups: [
      '/src/assets/mockups/mockup_fita.png',
      '/src/assets/mockups/mockup_iphone_instagram.png',
    ],
  },
  {
    id: 'vireon',
    name: 'Vireon',
    imagePath: '/src/assets/mockups/logo_vireon.png',
    mockups: [
      '/src/assets/mockups/mockup_papelaria.png',
      '/src/assets/mockups/mockup_banner.png',
    ],
  },
  {
    id: 'vision',
    name: 'Vision',
    imagePath: '/src/assets/mockups/logo_vision.png',
    mockups: [
      '/src/assets/mockups/mockup_ecobag.png',
      '/src/assets/mockups/mockup_copos.png',
    ],
  },
  {
    id: 'israel-logo',
    name: 'Israel',
    imagePath: '/src/assets/mockups/logo_israel.png',
    mockups: [
      '/src/assets/mockups/mockup_crachas.png',
      '/src/assets/mockups/mockup_casaco.png',
    ],
  },
];

// Dados do estudo de caso Célula Israel
export const caseStudy = {
  id: 'celula-israel-case',
  name: 'Célula Israel',
  description:
    'Uma identidade visual completa para um grupo religioso, construída sobre os pilares de comunhão, fé e tradição. O projeto envolveu desde a concepção do logotipo até a aplicação em materiais impressos e digitais.',
  logo: '/src/assets/mockups/logomarca.svg',
  logoVariations: [
    { label: 'Logo Principal', src: '/src/assets/mockups/logo_principal_cel_israel.png' },
    { label: 'Comunhão', src: '/src/assets/mockups/logo_comunhao_cel_israel.png' },
    { label: 'Isologo', src: '/src/assets/mockups/isologo_cel_israel.png' },
    { label: 'Tipografia', src: '/src/assets/mockups/tipografia_cel_israel.png' },
  ],
  colors: [
    { name: 'Azul Celeste', hex: '#4FC3F7' },
    { name: 'Azul Profundo', hex: '#1565C0' },
    { name: 'Branco Puro', hex: '#FFFFFF' },
    { name: 'Cinza Escuro', hex: '#212121' },
  ],
  mockups: [
    '/src/assets/mockups/mockup_cartao.png',
    '/src/assets/mockups/mockup_banner.png',
    '/src/assets/mockups/mockup_casaco.png',
    '/src/assets/mockups/mockup_crachas.png',
    '/src/assets/mockups/mockup_fita.png',
    '/src/assets/mockups/mockup_iphone_instagram.png',
  ],
  brandingAssets: [
    '/src/assets/mockups/branding_card.png',
    '/src/assets/mockups/branding_fontes.png',
    '/src/assets/mockups/branding_tipografia.png',
    '/src/assets/mockups/branding_predio.png',
    '/src/assets/mockups/branding_illustrator.png',
  ],
};

// Dados do processo criativo
export const creativeProcess = [
  {
    id: 1,
    title: 'Imersão',
    icon: '🔍',
    description:
      'Tudo começa com uma conversa profunda. Mergulhamos no seu universo para entender sua visão, valores, público e objetivos. Esta fase é sobre ouvir, pesquisar e definir o DNA da marca.',
  },
  {
    id: 2,
    title: 'Conceituação',
    icon: '💡',
    description:
      'Com o DNA definido, exploramos múltiplos caminhos criativos. Criamos painéis de humor, esboçamos conceitos e definimos a direção de arte. É aqui que a estratégia ganha suas primeiras formas visuais.',
  },
  {
    id: 3,
    title: 'Design',
    icon: '✏️',
    description:
      'A direção escolhida é refinada em um sistema de identidade visual coeso. Desenhamos o logotipo, definimos a paleta de cores, a tipografia e os elementos gráficos de suporte que darão vida à marca.',
  },
  {
    id: 4,
    title: 'Refinamento',
    icon: '🔧',
    description:
      'Apresentamos a proposta e, com base no seu feedback, fazemos ajustes finos. Esta etapa colaborativa garante que o resultado final não seja apenas esteticamente incrível, mas perfeitamente alinhado com suas expectativas.',
  },
  {
    id: 5,
    title: 'Entrega',
    icon: '📦',
    description:
      'Você recebe um pacote completo com todos os ativos da marca em múltiplos formatos, acompanhado de um guia de identidade que orienta a aplicação correta e consistente da sua nova identidade visual em todas as plataformas.',
  },
];

// Mockups para a galeria 3D
export const galleryMockups = [
  { id: 1, src: '/src/assets/mockups/mockup_cartao.png', label: 'Cartão de Visita' },
  { id: 2, src: '/src/assets/mockups/mockup_banner.png', label: 'Banner' },
  { id: 3, src: '/src/assets/mockups/mockup_casaco.png', label: 'Casaco' },
  { id: 4, src: '/src/assets/mockups/mockup_copos.png', label: 'Copos' },
  { id: 5, src: '/src/assets/mockups/mockup_crachas.png', label: 'Crachás' },
  { id: 6, src: '/src/assets/mockups/mockup_ecobag.png', label: 'Ecobag' },
  { id: 7, src: '/src/assets/mockups/mockup_caderno.png', label: 'Caderno' },
  { id: 8, src: '/src/assets/mockups/mockup_papelaria.png', label: 'Papelaria' },
  { id: 9, src: '/src/assets/mockups/mockup_iphone_instagram.png', label: 'Instagram' },
  { id: 10, src: '/src/assets/mockups/mockup_fita.png', label: 'Fita' },
];

export default projects;
