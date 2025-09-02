# 🚀 Configuração Rápida - LacasaDigital

## ⚡ Configuração em 5 Minutos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative Authentication e Firestore
4. Copie as credenciais para `src/services/firebase.js`

### 3. Configurar Stripe (Opcional)
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Obtenha suas chaves de teste
3. Edite `src/services/stripe.js`

### 4. Executar Projeto
```bash
npm run dev
```

## 🔧 Configurações Importantes

### Firebase
- **Authentication**: Email/Password + Google
- **Firestore**: Coleção 'users' para perfis
- **Regras**: Configurar permissões adequadas

### Stripe
- **Modo Teste**: Use chaves de teste para desenvolvimento
- **Webhooks**: Configurar para confirmação de pagamentos
- **Produtos**: Criar produto com preço MZN 300,00

## 📱 Testando o Projeto

### Fluxo de Teste
1. **Home** → Visualizar landing page
2. **Payment** → Simular pagamento (modo mock)
3. **Login** → Criar conta ou fazer login
4. **Dashboard** → Acessar área do aluno
5. **Profile** → Editar informações

### Dados de Teste
- **Email**: teste@exemplo.com
- **Senha**: 123456
- **Pagamento**: Simulado (não real)

## 🚨 Solução de Problemas

### Erro de Firebase
- Verificar credenciais em `src/services/firebase.js`
- Ativar serviços no console Firebase
- Verificar regras do Firestore

### Erro de Stripe
- Verificar chave pública em `src/services/stripe.js`
- Usar chaves de teste para desenvolvimento
- Verificar console do navegador

### Erro de Build
- Limpar cache: `npm run build --force`
- Verificar versões das dependências
- Reinstalar node_modules se necessário

## 🌐 Deploy

### Netlify
1. Conectar repositório GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configurar variáveis de ambiente

### Vercel
1. Importar projeto
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## 📞 Suporte

- **Issues**: GitHub Issues
- **Email**: suporte@lacasadigital.com
- **Documentação**: README.md completo

---

**Projeto configurado e pronto para uso! 🎉**
