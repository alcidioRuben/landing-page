# 🎭 Modo Mock - Solução para API Nhonga.net

## ❌ Problema Identificado
A API da Nhonga.net está retornando erro 404, indicando que o endpoint não está disponível ou a URL está incorreta.

## ✅ Solução Implementada

### 1. **Mock da API** (`src/services/nhongaMock.js`)
- ✅ Simulação completa da API Nhonga.net
- ✅ Respostas realistas com delay
- ✅ Suporte para diferentes cenários (sucesso/erro)

### 2. **Integração Automática** (`src/services/nhonga.js`)
- ✅ Detecção automática do modo mock
- ✅ Fallback para API real quando disponível
- ✅ Logs detalhados para debug

### 3. **Toggle Visual** (`src/components/MockToggle.jsx`)
- ✅ Botão flutuante para alternar entre modos
- ✅ Indicador visual do modo ativo
- ✅ Disponível apenas em desenvolvimento

## 🚀 Como Usar

### Método 1: Botão Visual (Recomendado)
1. **Reinicie o servidor**: `npm run dev`
2. **Acesse qualquer página** da aplicação
3. **Clique no botão** no canto superior direito:
   - 🎭 **Mock** = Usando simulação
   - 🌐 **API** = Tentando API real

### Método 2: URL com Parâmetro
```
http://localhost:3000/planos?mock=true
```

### Método 3: Console do Navegador
```javascript
// Ativar mock
localStorage.setItem('nhonga_mock_mode', 'true')

// Desativar mock
localStorage.setItem('nhonga_mock_mode', 'false')

// Recarregar página
location.reload()
```

## 🔍 Logs Esperados

### Modo Mock Ativado:
```
🎭 Usando mock da API Nhonga.net
🎭 Mock API - Criando pagamento: {...}
🎭 Mock API - Resposta: {...}
```

### Modo API Real:
```
🚀 Criando pagamento: {url: "/api/nhonga/payment/create", ...}
📡 Resposta da API: {status: 200, ...}
✅ Dados recebidos: {...}
```

## 🎯 Funcionalidades do Mock

### ✅ Simulação Completa
- **Criação de Pagamento**: Simula resposta da API
- **Verificação de Status**: Simula diferentes status
- **Delay Realista**: 800ms para criação, 500ms para status
- **IDs Únicos**: Gera IDs únicos para cada transação

### ✅ Cenários de Teste
- **Sucesso**: 90% das vezes retorna sucesso
- **Erro**: 10% das vezes simula erro
- **Status Variados**: pending, processing, completed, failed

### ✅ Dados Realistas
```javascript
{
  success: true,
  id: 'mock_transaction_1234567890',
  redirectUrl: 'https://mock-checkout.nhonga.net/payment/1234567890',
  status: 'pending',
  amount: 199,
  currency: 'MZN',
  context: 'Plano Inicial - 500 mensagens/mês'
}
```

## 🧪 Testando o Fluxo Completo

1. **Ativar Mock**: Clique no botão 🎭
2. **Escolher Plano**: Vá para `/planos`
3. **Selecionar Plano**: Clique em qualquer plano pago
4. **Fazer Login**: Se necessário
5. **Processar Pagamento**: Clique em "Pagar Agora"
6. **Verificar Logs**: Console deve mostrar modo mock
7. **Simular Sucesso**: Será redirecionado para página de sucesso

## 🔧 Configurações Técnicas

### Detecção Automática
```javascript
const isMockMode = () => {
  return process.env.NODE_ENV === 'development' && 
         (window.location.search.includes('mock=true') || 
          localStorage.getItem('nhonga_mock_mode') === 'true')
}
```

### Fallback Inteligente
- **Desenvolvimento**: Usa mock quando ativado
- **Produção**: Sempre tenta API real
- **Erro de API**: Pode ser configurado para usar mock

## 📋 Próximos Passos

1. **Testar com Mock**: Verificar se todo o fluxo funciona
2. **Verificar API Real**: Quando a API da Nhonga.net estiver disponível
3. **Configurar Produção**: Usar API real em produção
4. **Monitorar Logs**: Verificar comportamento em diferentes cenários

---

**Status**: ✅ **MOCK IMPLEMENTADO**
**Modo Atual**: 🎭 Mock (Desenvolvimento)
**Próximo Passo**: Testar fluxo completo com mock
