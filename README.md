# AMSync Ads Chatbot

Uma plataforma completa de chatbot para WhatsApp com IA, focada em automação de vendas e atendimento.

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Framer Motion** - Animações
- **Firebase** - Autenticação e banco de dados
- **React Router DOM** - Roteamento
- **Nhonga.net** - Gateway de pagamento

## 📋 Funcionalidades

### 🔐 Autenticação
- Login com email/senha
- Login com Google
- Registro de usuários
- Recuperação de senha

### 💳 Pagamentos
- Integração com VendoraPay (M-Pesa/E-Mola)
- Pagamentos móveis diretos
- Webhook para confirmação
- Redirecionamento automático

### 🤖 Chatbot
- IA para WhatsApp
- Automação de vendas
- Gerenciamento de leads
- Dashboard interativo

### 📱 Interface
- Design responsivo
- Animações suaves
- Tema moderno
- Otimizado para mobile

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/alcidioRuben/LacasaDigital.git
cd LacasaDigital
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute o projeto:
```bash
npm run dev
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Variáveis de Ambiente Necessárias

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Contextos React (Auth)
├── pages/              # Páginas da aplicação
├── services/           # Serviços (Firebase, Nhonga)
├── utils/              # Utilitários
└── assets/             # Imagens e recursos
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Linting do código

## 📞 Suporte

Para suporte técnico, entre em contato:
- Email: suporte@amsync.online
- WhatsApp: +25887400696

## 📄 Licença

Este projeto é propriedade da AMSync Ads. Todos os direitos reservados.

---

**AMSync Ads** - Transformando seu WhatsApp em uma máquina de vendas com IA.