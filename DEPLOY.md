# 🚀 **DEPLOY NA RAILWAY - PASSO A PASSO**

## 📋 **1. PREPARAÇÃO DO REPOSITÓRIO**

### **1.1 Criar repositório no GitHub**
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `amsync-landing-page`
4. Descrição: `Landing page profissional para AMSync Ads`
5. Público ou Privado (sua escolha)
6. **NÃO** inicialize com README, .gitignore ou licença
7. Clique em "Create repository"

### **1.2 Conectar repositório local ao GitHub**
```bash
# Adicionar remote origin
git remote add origin https://github.com/SEU_USUARIO/amsync-landing-page.git

# Verificar se foi adicionado
git remote -v

# Fazer push para o GitHub
git branch -M main
git push -u origin main
```

## 🚂 **2. DEPLOY NA RAILWAY**

### **2.1 Criar conta no Railway**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"

### **2.2 Conectar repositório**
1. Selecione "Deploy from GitHub repo"
2. Escolha o repositório `amsync-landing-page`
3. Clique em "Deploy Now"

### **2.3 Configurar variáveis de ambiente**
No projeto Railway, vá em "Variables" e adicione:

```bash
NODE_ENV=production
PORT=3000
NHONGA_API_URL=https://nhonga.net/api
NHONGA_API_KEY=03gdpgmaoh6o46m7pqg3v8d6ggecik8p68dyou7zvvwvr8qjclms5mprowv9
NHONGA_WEBHOOK_SECRET=hmthkoukhk5z47jul0nvys68h9ihyglykt43iokjtck0sn6nx37ghkd3qwlr5emo8zrx73nxbrmuvw0xukb8qidque9ztz7ru9uys2srvh8sc0ihukn0wsd0
FACEBOOK_PIXEL_ID=2096237854232667
APP_NAME=AMSync Ads
APP_URL=https://amsync.online
```

### **2.4 Configurar domínio personalizado (opcional)**
1. Vá em "Settings" → "Domains"
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme instruções

## 🔧 **3. VERIFICAÇÃO DO DEPLOY**

### **3.1 Health Check**
```bash
# Substitua pela URL do seu projeto Railway
curl https://seu-projeto.railway.app/api/health
```

### **3.2 Testar funcionalidades**
1. Acesse a URL do projeto
2. Teste a navegação
3. Teste o modal de pagamento
4. Verifique se o Facebook Pixel está funcionando

## 📊 **4. MONITORAMENTO**

### **4.1 Logs em tempo real**
- No Railway, vá em "Deployments"
- Clique no deployment ativo
- Veja os logs em tempo real

### **4.2 Métricas**
- CPU e memória
- Requests por minuto
- Tempo de resposta

## 🚨 **5. TROUBLESHOOTING**

### **5.1 Erro de build**
```bash
# Verificar logs de build
# Verificar se todas as dependências estão no package.json
# Verificar se o Node.js 18+ está configurado
```

### **5.2 Erro de runtime**
```bash
# Verificar variáveis de ambiente
# Verificar logs do servidor
# Verificar se a porta está correta
```

### **5.3 Erro de pagamento**
```bash
# Verificar chaves da API Nhonga
# Verificar webhook URL
# Testar API diretamente
```

## 🔄 **6. ATUALIZAÇÕES**

### **6.1 Deploy automático**
- Cada push para `main` gera deploy automático
- Configure branch protection se necessário

### **6.2 Deploy manual**
```bash
# Fazer alterações
git add .
git commit -m "Descrição das alterações"
git push origin main

# Railway fará deploy automático
```

## 📱 **7. TESTE FINAL**

### **7.1 Checklist**
- [ ] Landing page carrega corretamente
- [ ] Todas as seções estão visíveis
- [ ] Preços promocionais funcionam
- [ ] Vídeo do YouTube carrega
- [ ] Modal de pagamento abre
- [ ] Facebook Pixel está ativo
- [ ] WhatsApp flutuante funciona
- [ ] Responsividade mobile OK

### **7.2 Teste de pagamento**
- [ ] Selecionar plano
- [ ] Preencher formulário
- [ ] Enviar para API Nhonga
- [ ] Receber resposta
- [ ] Verificar webhook

## 🎯 **8. PRÓXIMOS PASSOS**

### **8.1 Otimizações**
- CDN para assets
- Cache de imagens
- Minificação de CSS/JS
- Compressão gzip

### **8.2 Analytics**
- Google Analytics
- Hotjar para heatmaps
- A/B testing
- Conversão tracking

---

**🎉 Parabéns! Sua landing page está no ar na Railway!**
