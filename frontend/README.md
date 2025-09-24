# 🎨 Leovox Studios - Portfólio Digital

**Desenvolvido por Leonardo Gonçalves**  
*Designer Gráfico & Especialista em Marketing Digital*

---

## 📋 Sobre o Projeto

Este é meu portfólio digital profissional, desenvolvido para apresentar meus trabalhos em design gráfico, identidade visual, social media e marketing digital. O site foi criado com tecnologias modernas para oferecer uma experiência única e interativa aos meus clientes.

### 🎯 Objetivo

Criar uma presença digital marcante que demonstre minha expertise em design e facilite o contato direto com potenciais clientes, oferecendo uma experiência visual impactante e funcionalidades práticas para solicitação de orçamentos.

---

## ✨ Funcionalidades Principais

### 🔍 **Galeria Interativa de Projetos**
- **Modal de visualização** com navegação por setas
- **Categorias organizadas**: Identidade Visual, Social Media, Camisas Esportivas, Cartazes
- **Thumbnails** para navegação rápida
- **Contador de imagens** e descrições detalhadas

### 📝 **Sistema de Contato Inteligente**
- **Preenchimento automático** do formulário ao clicar em "Solicitar Orçamento"
- **Mensagens personalizadas** para cada tipo de serviço
- **Envio direto** para meu e-mail (studiosleovox@gmail.com)
- **Feedback visual** de sucesso/erro no envio

### 🎮 **Viewer 3D Interativo**
- **Visualização 3D** de camisas esportivas
- **Rotação 360°** com mouse ou touch
- **Demonstração** da qualidade dos uniformes criados

### 📱 **Planos de Social Media**
- **Três opções** de planos (Básico, Profissional, Premium)
- **Preços transparentes** e features detalhadas
- **Botões alinhados** uniformemente
- **Integração** com formulário de contato

### 🚀 **Otimizações de Performance**
- **Cursor customizado** com efeitos neon nos botões
- **Animações suaves** e responsivas
- **Carregamento otimizado** de imagens
- **Design responsivo** para todos os dispositivos

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18** - Framework JavaScript moderno
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones modernos
- **Three.js** - Renderização 3D

### **Backend**
- **Flask** - Framework Python para API
- **Flask-CORS** - Habilitação de CORS
- **SMTP** - Envio de e-mails
- **SQLAlchemy** - ORM para banco de dados

### **Ferramentas de Desenvolvimento**
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade de CSS

---

## 📁 Estrutura do Projeto

```
leovox-portfolio-melhorado/
├── leovox-portfolio-melhorado/          # Frontend React
│   ├── src/
│   │   ├── components/                  # Componentes React
│   │   │   ├── HeroImproved.jsx        # Seção principal
│   │   │   ├── ProjectShowcase.jsx     # Showcase com navegação
│   │   │   ├── Projects.jsx            # Galeria de projetos
│   │   │   ├── Services.jsx            # Serviços e planos
│   │   │   ├── Contact.jsx             # Formulário de contato
│   │   │   └── ...
│   │   ├── assets/                     # Imagens e recursos
│   │   └── ...
│   ├── public/
│   │   ├── portfolio/                  # Imagens do portfólio
│   │   ├── favicon.svg                 # Favicon da marca
│   │   └── ...
│   └── package.json
│
├── email-backend/                       # Backend Flask
│   ├── src/
│   │   ├── routes/
│   │   │   ├── email.py               # Rota para envio de e-mails
│   │   │   └── ...
│   │   ├── static/                    # Build do frontend
│   │   └── main.py                    # Arquivo principal
│   ├── venv/                          # Ambiente virtual Python
│   └── requirements.txt
│
└── README.md                           # Este arquivo
```

---

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js 18+ instalado
- Python 3.11+ instalado
- Git instalado

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/leovox-portfolio.git
cd leovox-portfolio
```

### **2. Configuração do Frontend**
```bash
cd leovox-portfolio-melhorado
npm install --legacy-peer-deps
```

### **3. Configuração do Backend**
```bash
cd ../email-backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### **4. Build do Frontend**
```bash
cd ../leovox-portfolio-melhorado
npm run build
cp -r dist/* ../email-backend/src/static/
```

### **5. Executar o Projeto**
```bash
cd ../email-backend
source venv/bin/activate  # No Windows: venv\Scripts\activate
python src/main.py
```

O site estará disponível em: `http://localhost:5000`

---

## 📧 Configuração de E-mail

Para habilitar o envio real de e-mails, configure a variável de ambiente:

```bash
export EMAIL_PASSWORD="sua_senha_de_app_gmail"
```

### **Como obter a senha de app do Gmail:**
1. Acesse sua conta Google
2. Vá em "Segurança" > "Verificação em duas etapas"
3. Role até "Senhas de app"
4. Gere uma nova senha para "E-mail"
5. Use essa senha na variável de ambiente

---

## 🎨 Personalização

### **Cores da Marca**
As cores principais estão definidas no Tailwind CSS:
- **Primary**: Verde Leovox (#00ff88)
- **Background**: Preto (#000000)
- **Cards**: Cinza escuro (#1f2937)

### **Conteúdo**
Para atualizar projetos, edite os arrays em:
- `src/components/Projects.jsx` - Galeria de projetos
- `src/components/Services.jsx` - Serviços e preços

### **Imagens**
Adicione novas imagens em:
- `public/portfolio/` - Organize por categorias
- Mantenha a estrutura de pastas existente

---

## 📱 Funcionalidades Detalhadas

### **Sistema de Navegação por Setas**
O projeto inclui um sistema único de navegação que permite aos visitantes:
- Visualizar o **Viewer 3D** como primeira impressão
- Navegar para **explicações sobre identidade visual**
- Conhecer **campanhas digitais e e-commerce**
- Ser direcionado para **planos de social media**

### **Preenchimento Automático de Formulários**
Quando um cliente clica em qualquer botão "Solicitar Orçamento":
- O campo **"Assunto"** é preenchido automaticamente
- Uma **mensagem introdutória** personalizada é inserida
- O usuário é **direcionado** suavemente para o formulário
- **Tempo de resposta** otimizado para melhor UX

### **Galeria Modal Avançada**
A galeria de projetos oferece:
- **Visualização em tela cheia** de cada projeto
- **Navegação por setas** entre imagens
- **Thumbnails** na parte inferior
- **Informações detalhadas** de cada trabalho
- **Categorização** por tipo de serviço

---

## 🔧 Manutenção e Atualizações

### **Adicionando Novos Projetos**
1. Adicione as imagens em `public/portfolio/categoria/`
2. Edite o array `projectCategories` em `Projects.jsx`
3. Inclua título, descrição e caminho da imagem
4. Faça o build e deploy

### **Atualizando Preços**
1. Edite os arrays `services` e `plans` em `Services.jsx`
2. Mantenha a estrutura de dados existente
3. Teste o preenchimento automático do formulário

### **Modificando Informações de Contato**
1. Edite o array `contactInfo` em `Contact.jsx`
2. Atualize links do WhatsApp em `WhatsAppFloat.jsx`
3. Verifique a integração com o backend de e-mail

---

## 🌟 Diferenciais do Projeto

### **Experiência do Usuário**
- **Navegação intuitiva** com feedback visual
- **Carregamento rápido** com otimizações de performance
- **Design responsivo** para mobile, tablet e desktop
- **Animações suaves** que não comprometem a usabilidade

### **Funcionalidades Profissionais**
- **Sistema de orçamentos** automatizado
- **Galeria profissional** com modal avançado
- **Integração real** de envio de e-mails
- **Viewer 3D** para demonstração de produtos

### **Otimização para Conversão**
- **Call-to-actions** estrategicamente posicionados
- **Formulários inteligentes** com preenchimento automático
- **Informações claras** sobre serviços e preços
- **Contato direto** via WhatsApp e e-mail

---

## 📞 Contato

**Leonardo Gonçalves**  
*Designer Gráfico & Especialista em Marketing Digital*

- 📧 **E-mail**: studiosleovox@gmail.com
- 📱 **WhatsApp**: +55 (81) 98453-9741
- 📍 **Localização**: Recife, PE
- 🌐 **Portfólio**: [Link do seu site]

---

## 📄 Licença

Este projeto é de propriedade de **Leonardo Gonçalves - Leovox Studios**. Todos os direitos reservados.

O código fonte está disponível para fins de demonstração e aprendizado. Para uso comercial ou modificações, entre em contato.

---

## 🙏 Agradecimentos

Agradeço a todos os clientes que confiaram no meu trabalho e permitiram que seus projetos fossem showcaseados neste portfólio. Cada projeto representa uma parceria de sucesso e contribui para o crescimento contínuo do Leovox Studios.

---

**© 2024 Leonardo Gonçalves - Leovox Studios. Todos os direitos reservados.**

