# Integração com Nhonga.net

## Configuração Completa

### 1. Serviço de Pagamento (`src/services/nhonga.js`)

O serviço está configurado com:
- **API Key**: `03gdpgmaoh6o46m7pqg3v8d6ggecik8p68dyou7zvvwvr8qjclms5mprowv9`
- **Webhook Secret**: `hmthkoukhk5z47jul0nvys68h9ihyglykt43iokjtck0sn6nx37ghkd3qwlr5emo8zrx73nxbrmuvw0xukb8qidque9ztz7ru9uys2srvh8sc0ihukn0wsd0`
- **URL Base**: `https://nhonga.net/api`

### 2. Configurações do Curso

```javascript
export const COURSE_CONFIG = {
  name: 'Curso Completo de Dropshipping',
  description: 'Aprenda dropshipping do zero e comece a faturar online',
  amount: 300, // MZn 300,00 em centavos
  currency: 'MZN',
  amountMZN: 300 // 1500 MZN (valor aproximado)
}
```

### 3. URLs do Sistema

```javascript
export const SYSTEM_URLS = {
  base: process.env.NODE_ENV === 'production' 
    ? 'https://lacasadigital.com' 
    : 'http://localhost:3000',
  
  callbackUrl: '/api/webhook/nhonga',
  returnUrl: '/payment-success',
  cancelUrl: '/payment'
}
```

## Fluxo de Pagamento

### 1. Criação de Pagamento

```javascript
const paymentData = {
  amount: 1500, // 1500 MZN
  context: 'Aprenda dropshipping do zero e comece a faturar online',
  callbackUrl: 'https://seusite.com/api/webhook/nhonga',
  returnUrl: 'https://seusite.com/payment-success',
  currency: 'MZN',
  environment: 'prod'
}

const result = await createPayment(paymentData)
```

### 2. Resposta da API

```json
{
  "success": true,
  "error": null,
  "redirectUrl": "https://nhonga.net/checkout/abc123",
  "id": "txn_123456789"
}
```

### 3. Redirecionamento

O usuário é redirecionado para `redirectUrl` para completar o pagamento.

## Webhook Handler

### 1. Endpoint do Webhook

**URL**: `/api/webhook/nhonga`
**Método**: `POST`

### 2. Headers Esperados

```
Content-Type: application/json
X-Nhonga-Signature: [assinatura_hmac]
```

### 3. Payload do Webhook

```json
{
  "transactionId": "txn_123456789",
  "status": "approved",
  "amount": 300,
  "currency": "MZN",
  "context": "Aprenda dropshipping do zero e comece a faturar online",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Processamento

O webhook handler:
1. Verifica a assinatura (opcional para desenvolvimento)
2. Processa os dados do pagamento
3. Atualiza o status do usuário no Firebase
4. Responde com sucesso

## Configuração do Servidor

### 1. Para Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "NODE_ENV=development" > .env.local

# Iniciar servidor
npm run dev
```

### 2. Para Produção

```bash
# Build da aplicação
npm run build

# Iniciar servidor de produção
npm start
```

### 3. Configurar Webhook na Nhonga.net

1. Acesse o painel da Nhonga.net
2. Configure o webhook URL: `https://seusite.com/api/webhook/nhonga`
3. Configure os eventos: `payment.approved`, `payment.completed`
4. Salve as configurações

## Testando a Integração

### 1. Pagamento Simulado

- Selecione "Pagamento Simulado" na página de pagamento
- Teste o fluxo completo sem usar a API real

### 2. Pagamento Real

- Selecione "Nhonga.net" na página de pagamento
- Será redirecionado para o checkout da Nhonga.net
- Complete o pagamento de teste
- Verifique se o webhook é recebido

### 3. Verificar Logs

```bash
# Logs do servidor
npm run dev

# Logs do webhook
tail -f logs/webhook.log
```

## Estrutura de Arquivos

```
src/
├── services/
│   └── nhonga.js          # Serviço de integração
├── api/
│   └── webhook.js         # Handler do webhook
├── pages/
│   └── Payment.jsx        # Página de pagamento
└── contexts/
    └── AuthContext.jsx    # Contexto de autenticação
```

## Segurança

### 1. Verificação de Assinatura

```javascript
export const verifyWebhookSignature = (payload, signature) => {
  // Implementar verificação HMAC real em produção
  return true // Para desenvolvimento
}
```

### 2. Validação de Dados

- Sempre validar o payload do webhook
- Verificar se o valor corresponde ao esperado
- Confirmar que a transação não foi processada anteriormente

### 3. Rate Limiting

Implementar rate limiting no endpoint do webhook para evitar spam.

## Monitoramento

### 1. Logs

- Logs de criação de pagamento
- Logs de webhook recebidos
- Logs de erros e exceções

### 2. Métricas

- Taxa de sucesso de pagamentos
- Tempo de resposta da API
- Volume de transações

### 3. Alertas

- Falhas na criação de pagamento
- Webhooks não processados
- Erros de integração

## Troubleshooting

### 1. Erro de CORS

```javascript
// Configurar CORS no servidor
app.use(cors({
  origin: ['https://nhonga.net', 'https://seusite.com'],
  credentials: true
}))
```

### 2. Webhook não recebido

- Verificar se a URL está correta
- Confirmar se o servidor está acessível
- Verificar logs do servidor

### 3. Assinatura inválida

- Verificar se a chave secreta está correta
- Confirmar se o payload está sendo processado corretamente
- Testar com dados de exemplo

## Suporte

Para dúvidas sobre a integração:
- Documentação da Nhonga.net: [https://nhonga.net/docs](https://nhonga.net/docs)
- Suporte técnico: [suporte@nhonga.net](mailto:suporte@nhonga.net)
