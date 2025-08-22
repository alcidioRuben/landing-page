# 🚀 AMSync Ads - Landing Page Profissional

> **Automação inteligente para WhatsApp com IA de verdade**

## 📋 **Descrição**

AMSync Ads é uma solução definitiva para empresas que querem automatizar o atendimento no WhatsApp, usando o poder da Inteligência Artificial (OpenAI) e uma plataforma visual, fácil e segura.

## ✨ **Funcionalidades**

### 🎯 **Landing Page Profissional**
- Design moderno e responsivo
- Seções otimizadas para conversão
- Preços promocionais com riscados
- Vídeo demonstrativo integrado
- Formulário de captura de leads

### 💳 **Sistema de Pagamentos**
- Integração com Nhonga.net API
- Suporte a M-Pesa e E-Mola
- Processamento automático de pagamentos
- Webhooks para confirmação instantânea
- Modal de pagamento integrado

### 📊 **Analytics e Tracking**
- Facebook Pixel integrado
- Tracking de conversões
- Eventos personalizados
- Segmentação avançada de audiência

### 📱 **Responsividade**
- Otimizado para mobile
- Design adaptativo
- Performance otimizada
- SEO friendly

## 🛠️ **Tecnologias**

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Node.js, Express.js
- **Pagamentos**: Nhonga.net API
- **Analytics**: Facebook Pixel
- **Deploy**: Railway

## 🚀 **Deploy na Railway**

### **1. Pré-requisitos**
- Conta no [Railway](https://railway.app)
- Git instalado
- Node.js 18+ instalado

### **2. Configuração das Variáveis de Ambiente**

No Railway, configure as seguintes variáveis:

```bash
NODE_ENV=production
PORT=3000
NHONGA_API_URL=https://nhonga.net/api
NHONGA_API_KEY=sua_chave_api_aqui
NHONGA_WEBHOOK_SECRET=seu_webhook_secret_aqui
FACEBOOK_PIXEL_ID=2096237854232667
APP_NAME=AMSync Ads
APP_URL=https://amsync.online
```

### **3. Deploy Automático**

```bash
# 1. Faça push para o repositório
git add .
git commit -m "Deploy para Railway"
git push origin main

# 2. No Railway, conecte seu repositório
# 3. Configure as variáveis de ambiente
# 4. Deploy automático será iniciado
```

## 📁 **Estrutura do Projeto**

```
amsync-landing-page/
├── index.html          # Landing page principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript frontend
├── server.js           # Servidor Express
├── package.json        # Dependências e scripts
├── railway.json        # Configuração Railway
├── config.env          # Variáveis de ambiente (exemplo)
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação
```

## 🔧 **Instalação Local**

```bash
# 1. Clone o repositório
git clone https://github.com/amsync/landing-page.git
cd amsync-landing-page

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp config.env .env
# Edite o arquivo .env com suas configurações

# 4. Execute o servidor
npm run dev
```

## 📱 **API Endpoints**

### **Health Check**
```
GET /api/health
```

### **Criar Pagamento**
```
POST /api/payment/create
```

### **Status do Pagamento**
```
GET /api/payment/status/:paymentId
```

### **Webhook Nhonga**
```
POST /api/webhook/nhonga
```

## 🎨 **Personalização**

### **Cores do Tema**
```css
:root {
  --primary-color: #1E3A8A;    /* Azul principal */
  --accent-color: #10B981;     /* Verde para CTAs */
  --text-color: #64748b;       /* Texto secundário */
  --background: #f8fafc;       /* Fundo claro */
}
```

### **Facebook Pixel**
O Pixel está configurado para rastrear:
- PageView
- Lead
- InitiateCheckout
- Purchase
- ViewContent
- Contact

## 📊 **Monitoramento**

### **Health Check**
O Railway monitora automaticamente o endpoint `/api/health` para verificar se a aplicação está funcionando.

### **Logs**
Acesse os logs em tempo real no dashboard do Railway.

## 🔒 **Segurança**

- CORS configurado
- Validação de entrada
- Headers de segurança
- Webhook signature verification

## 📈 **Performance**

- Assets otimizados
- Lazy loading de imagens
- CSS e JS minificados
- Cache headers configurados

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **Contato**

- **Website**: [amsync.online](https://amsync.online)
- **WhatsApp**: +258 87 400 6962
- **Email**: amsyncoficial@amsync.online

---

**Desenvolvido com ❤️ pela equipe AMSync Oficial**
