# 🎨 Leovox Studios - Portfólio Digital

**Desenvolvido por Leonardo Gonçalves** *Designer Gráfico & Especialista em Marketing Digital*

Um portfólio digital moderno e interativo, desenvolvido para apresentar trabalhos, detalhar serviços e facilitar o contato direto com potenciais clientes através de um sistema de e-mail inteligente.

**[Visite a versão ao vivo →](https://portfolio-digital-flask.onrender.com)**

![Status](https://img.shields.io/static/v1?label=status&message=ativo&color=brightgreen)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Flask](https://img.shields.io/badge/Flask-black?logo=flask)
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Vite](https://img.shields.io/badge/Vite-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-blue?logo=tailwindcss)

---

## 📜 Tabela de Conteúdos

1.  [Sobre o Projeto](#-sobre-o-projeto)
2.  [Destaques e Funcionalidades](#-destaques-e-funcionalidades)
3.  [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
4.  [Estrutura de Arquivos](#-estrutura-de-arquivos)
5.  [Instalação e Execução Local](#-instalação-e-execução-local)
6.  [Configuração de Ambiente](#️-configuração-de-ambiente)
7.  [Endpoints da API](#-endpoints-da-api)
8.  [Deploy](#-deploy)
9.  [Contato](#-contato)
10. [Licença](#-licença)

---

## 🎨 Sobre o Projeto

Este é meu portfólio digital profissional, desenvolvido para apresentar meus trabalhos em design gráfico, identidade visual, social media e marketing digital.

O site foi criado com tecnologias modernas para oferecer uma experiência única e interativa aos meus clientes.

O objetivo é criar uma presença digital marcante que demonstre minha expertise em design e facilite o contato direto com potenciais clientes, oferecendo uma experiência visual impactante e funcionalidades práticas para solicitação de orçamentos.

---

## ✨ Destaques e Funcionalidades

-   **Galeria Interativa:** Modal de visualização com navegação por setas, categorias organizadas e contador de imagens.
-   **Sistema de Contato Inteligente:** Formulário com preenchimento automático, mensagens personalizadas e feedback visual de sucesso/erro no envio.
-   **Viewer 3D Interativo:** Visualização de produtos (camisas esportivas) com rotação 360° via mouse ou touch.
-   **Planos de Social Media:** Apresentação de planos com preços transparentes e features detalhadas, integrados ao formulário de contato.
-   **Otimizações de Performance:** Cursor customizado, animações suaves com Framer Motion, carregamento otimizado de imagens e design totalmente responsivo.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Framework moderno e build tool de alta performance. |
| | Tailwind CSS | Framework CSS utilitário para estilização rápida. |
| | Framer Motion | Biblioteca para animações fluidas e complexas. |
| | Three.js | Para renderização e interatividade 3D. |
| **Backend** | Flask | Microframework Python para a criação da API de e-mail. |
| | SQLAlchemy | ORM para manipulação de banco de dados. |
| | SMTP | Protocolo para o envio real dos e-mails de contato. |
| **Ferramentas** | ESLint, PostCSS | Ferramentas para garantir a qualidade e compatibilidade do código. |

---

## 📁 Estrutura de Arquivos

A estrutura do projeto separa claramente as responsabilidades entre frontend e backend.

```
repositorio/
├── frontend/                            # Aplicação React (Vite)
│   ├── src/
│   │   ├── components/                  # Componentes React
│   │   ├── assets/                      # Imagens e recursos
│   │   └── ...
│   ├── public/
│   │   ├── portfolio/                   # Imagens do portfólio
│   │   └── ...
│   └── package.json
│
├── backend/                             # API em Flask
│   ├── src/
│   │   ├── routes/                      # Rota para envio de e-mails
│   │   ├── static/                      # Destino do build do frontend
│   │   └── main.py                      # Arquivo principal da API
│   ├── venv/
│   └── requirements.txt
│
└── render.yaml                          # Configuração de deploy para o Render
```

---

## 🚀 Instalação e Execução Local

**Pré-requisitos:**
- Node.js 18+
- Python 3.11+
- Git

**1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/leovox-portfolio.git
cd leovox-portfolio
```

**2. Configure as Variáveis de Ambiente do Backend**

  - Navegue até a pasta `backend`.
  - Crie um arquivo chamado `.env`.
  - Adicione a variável `EMAIL_PASSWORD` conforme a seção de Configuração abaixo.

**3. Instale as Dependências do Backend**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**4. Instale as Dependências do Frontend**

```bash
cd ../frontend # ou o nome que você deu para a pasta
npm install --legacy-peer-deps
```

**5. Faça o Build do Frontend**
Este comando compila a aplicação React e copia os arquivos para a pasta `static` do backend.

```bash
npm run build
cp -r dist/* ../backend/src/static/
```

**6. Execute o Servidor**

```bash
cd ../backend
python src/main.py
```

O site estará disponível em `http://localhost:5000`.

-----

## ⚙️ Configuração de Ambiente

Para o envio de e-mails funcionar, a API Flask precisa de uma variável de ambiente.

### `backend/.env`

Crie este arquivo na pasta `backend` com o seguinte conteúdo:

```
EMAIL_PASSWORD="sua_senha_de_app_gmail"
```

Para obter uma **senha de app do Gmail**, acesse sua conta Google, vá em "Segurança", ative a "Verificação em duas etapas" e gere uma nova senha na seção "Senhas de app".

-----

## 📡 Endpoints da API

O backend possui um único endpoint para gerenciar o envio de e-mails.

  - **Endpoint:** `/send-email`
  - **Método:** `POST`
  - **Descrição:** Recebe os dados do formulário de contato e envia um e-mail.
  - **Payload (JSON):**
    ```json
    {
      "name": "Nome do Cliente",
      "email": "email@cliente.com",
      "subject": "Assunto do Contato",
      "message": "Mensagem do cliente."
    }
    ```
  - **Respostas:**
      - `200 OK`: `{ "message": "Email sent successfully!" }`
      - `500 Internal Server Error`: `{ "error": "Failed to send email" }`

-----

## 🌐 Deploy

Este projeto está configurado para deploy contínuo na plataforma **Render**.

[Deploy on Render](https://render.com/deploy)

O arquivo `render.yaml` na raiz do projeto contém todas as instruções de build e execução. Para fazer o deploy do seu próprio fork:

1.  Crie um "New Web Service" no Render e conecte seu repositório do GitHub.
2.  O Render detectará e usará o arquivo `render.yaml` automaticamente.
3.  Configure a variável de ambiente `EMAIL_PASSWORD` na aba "Environment" do seu serviço no Render.

-----

## 📞 Contato

**Leonardo Gonçalves** *Designer Gráfico & Especialista em Marketing Digital*

  - 📧 **E-mail**: studiosleovox@gmail.com
  - 📱 **WhatsApp**: +55 (81) 98453-9741
  - 📍 **Localização**: Recife, PE

-----

## 📄 Licença

Este projeto é de propriedade de **Leonardo Gonçalves - Leovox Studios**. Todos os direitos reservados.

O código fonte está disponível para fins de demonstração e aprendizado. Para uso comercial ou modificações, entre em contato.

-----

**© 2024 Leonardo Gonçalves - Leovox Studios. Todos os direitos reservados.**

