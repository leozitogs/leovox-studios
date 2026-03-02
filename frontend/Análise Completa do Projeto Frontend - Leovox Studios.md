# Análise Completa do Projeto Frontend - Leovox Studios

## Visão Geral

O projeto é um **portfólio digital profissional** para a **Leovox Studios**, uma marca de design gráfico criada por Leonardo Gonçalves, estudante de Ciência da Computação na UFPE e designer gráfico freelancer há aproximadamente 4 anos.

---

## Informações Técnicas

| Aspecto | Detalhes |
|---------|----------|
| **Nome do Projeto** | frontend |
| **Tipo** | Single Page Application (SPA) |
| **Framework** | React 19.1.0 |
| **Bundler** | Vite 6.3.5 |
| **Estilização** | TailwindCSS 4.1.7 |
| **Linguagem** | JavaScript (JSX) |
| **Gerenciador de Pacotes** | pnpm 10.4.1 |
| **Idioma** | Português Brasileiro (pt-BR) |

---

## Stack Tecnológica

### Dependências Principais

| Categoria | Bibliotecas |
|-----------|-------------|
| **UI Framework** | React 19.1.0, React DOM 19.1.0 |
| **Roteamento** | React Router DOM 7.6.1 |
| **Animações** | Framer Motion 12.23.24, GSAP 3.13.0, Anime.js 4.2.2 |
| **3D/WebGL** | Three.js 0.180.0, @react-three/fiber 9.3.0, @react-three/drei 10.7.4 |
| **Componentes UI** | Radix UI (múltiplos componentes), shadcn/ui (estilo new-york) |
| **Partículas** | react-tsparticles 2.12.2, tsparticles-slim 2.12.0 |
| **Ícones** | Lucide React 0.510.0 |
| **Formulários** | React Hook Form 7.56.3, Zod 3.24.4 |
| **Gráficos** | Recharts 2.15.3 |
| **Utilitários** | clsx, tailwind-merge, class-variance-authority |

### Dependências de Desenvolvimento

- **ESLint** 9.25.0 com plugins para React
- **Vite Plugin React** 4.4.1
- **TypeScript Types** para React (apenas tipagem)
- **tw-animate-css** 1.2.9

---

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globais (Tailwind + custom)
│   ├── main.jsx             # Ponto de entrada
│   ├── index.css            # CSS base
│   ├── components/
│   │   ├── HeaderLandoStyle.jsx      # Header adaptativo
│   │   ├── HeroRefined.jsx           # Hero com animação cinematográfica
│   │   ├── HeroRefined.css           # Estilos do Hero
│   │   ├── ProjectShowcase.jsx       # Showcase de projetos
│   │   ├── Projects.jsx              # Seção de projetos
│   │   ├── Services.jsx              # Serviços oferecidos
│   │   ├── BrandShowcase.jsx         # Showcase de marcas
│   │   ├── About.jsx                 # Sobre o designer
│   │   ├── Contact.jsx               # Formulário de contato
│   │   ├── Footer.jsx                # Rodapé
│   │   ├── CustomCursorAdvanced.jsx  # Cursor personalizado
│   │   ├── ScrollProgress.jsx        # Indicador de progresso
│   │   ├── ShirtViewer3D*.jsx        # Visualizadores 3D de camisas
│   │   ├── WhatsAppFloat.jsx         # Botão flutuante WhatsApp
│   │   └── ui/                       # Componentes shadcn/ui (40+ componentes)
│   ├── assets/
│   │   ├── brand/           # Logos e identidade visual
│   │   ├── textures/        # Texturas SVG
│   │   └── *.png/svg        # Imagens diversas
│   ├── hooks/
│   │   └── use-mobile.js    # Hook para detecção mobile
│   └── lib/
│       └── utils.js         # Utilitários (cn function)
├── public/
│   ├── CamisaCrow.glb       # Modelo 3D de camisa
│   ├── favicon.*            # Ícones do site
│   └── portfolio/           # Imagens do portfólio
├── dist/                    # Build de produção
├── package.json
├── vite.config.js
├── components.json          # Configuração shadcn/ui
└── texture-patch.css        # Patch de texturas
```

---

## Componentes Principais

### 1. HeroRefined.jsx (637 linhas)
- **Função**: Seção hero com animação cinematográfica bidirecional
- **Características**:
  - Scroll virtual customizado (0 → 2.0)
  - Efeito parallax com mouse
  - Partículas animadas (tsparticles)
  - Transição suave de cores (branco → escuro)
  - Animações reversíveis via scroll
  - Suporte touch para mobile

### 2. HeaderLandoStyle.jsx
- **Função**: Header fixo adaptativo
- **Características**:
  - Detecta mudança de cor do hero via CSS variable
  - Logo com filtro invertido dinâmico
  - Botão "ME CONTATE" com efeito 3D pushable
  - Scroll suave para seções

### 3. ProjectShowcase.jsx
- **Função**: Carrossel de projetos
- **Características**:
  - Visualizador 3D interativo de camisas
  - Slides de conteúdo sobre serviços
  - Navegação com setas e indicadores
  - Animações de entrada/saída

### 4. ShirtViewer3DImproved.jsx
- **Função**: Visualizador 3D de camisas
- **Características**:
  - Carrega modelo GLB (CamisaCrow.glb)
  - Rotação automática com pausa
  - Controles de órbita (zoom, rotação)
  - Fallback 2D em caso de erro
  - Iluminação e sombras realistas

### 5. Services.jsx
- **Função**: Listagem de serviços
- **Serviços oferecidos**:
  - Logo Básica (a partir de R$ 50)
  - Identidade Visual Completa (a partir de R$ 200)
  - Tráfego Pago & Marketing Digital (a partir de R$ 200)
  - Social Media (a partir de R$ 100/semana)
  - Camisas de Jogos Interescolares (a partir de R$ 135)
  - Diversos (a partir de R$ 20)
- **Planos de Social Media**:
  - Básico: R$ 100/semana
  - Profissional: R$ 175/semana
  - Premium: R$ 300/semana

### 6. About.jsx
- **Função**: Apresentação do designer
- **Informações**:
  - Leonardo Gonçalves
  - Estudante de Ciência da Computação (UFPE)
  - 4+ anos de experiência
  - 50+ projetos, 30+ clientes
- **Ferramentas**: Photoshop, Illustrator, Figma, After Effects, InDesign, Sketch

### 7. Contact.jsx
- **Função**: Formulário de contato
- **Dados de contato**:
  - Email: studiosleovox@gmail.com
  - Telefone: +55 (81) 98453-9741
  - Localização: Recife, PE
- **Integração**: API `/api/send-email` (backend necessário)

---

## Estilização

### Tema de Cores (CSS Variables)

| Variável | Valor | Uso |
|----------|-------|-----|
| `--primary` | oklch(0.8 0.2 142) | Verde Leovox (#00ff41) |
| `--background` | oklch(0.05 0 0) | Fundo escuro |
| `--foreground` | oklch(0.985 0 0) | Texto claro |

### Classes Customizadas

- `.leovox-text-gradient`: Gradiente verde animado para títulos
- `.project-card`: Cards com borda verde e hover effect
- `.btn-primary`: Botões com gradiente e elevação no hover

---

## Assets e Recursos

### Modelos 3D
- `CamisaCrow.glb`: Modelo 3D de camisa para visualização interativa

### Imagens de Marca
- Isologo, Isotipo, Tipografia em SVG e PNG
- Variações em verde

### Portfólio
- Camisas de Jogos Escolares
- Bandeiras de equipes
- Diversos projetos de design

---

## Funcionalidades Destacadas

1. **Animação de Scroll Cinematográfica**: Hero com transições complexas baseadas em scroll virtual
2. **Visualizador 3D**: Modelo de camisa interativo com Three.js
3. **Cursor Personalizado**: Efeito de cursor avançado
4. **Tema Adaptativo**: Header que muda de cor conforme scroll
5. **Formulário de Contato**: Integração com backend para envio de emails
6. **Design Responsivo**: Suporte completo para mobile e desktop
7. **Partículas Animadas**: Efeito visual com tsparticles

---

## Observações Técnicas

### Pontos Fortes
- Arquitetura bem organizada com separação de componentes
- Uso extensivo de animações modernas (Framer Motion, GSAP)
- Componentes UI reutilizáveis (shadcn/ui)
- Experiência 3D interativa
- Design visual coeso e profissional

### Pontos de Atenção
- O formulário de contato depende de um backend (`/api/send-email`)
- Arquivo HeroRefined.jsx é extenso (637 linhas) - poderia ser refatorado
- Alguns links de redes sociais estão com `href="#"` (placeholder)
- Build de produção já existe na pasta `dist/`

---

## Comandos Disponíveis

```bash
pnpm dev      # Servidor de desenvolvimento
pnpm build    # Build de produção
pnpm preview  # Preview do build
pnpm lint     # Verificação de código
```

---

*Análise realizada em 17/12/2024*
