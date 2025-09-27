// Serviço para integração com VendoraPay
const VENDORAPAY_API_BASE = process.env.NODE_ENV === 'development' 
  ? '/api/vendorapay'  // Usar proxy em desenvolvimento
  : 'https://vendorapay.com/api'  // Usar URL direta em produção
const API_KEY = '03gdpgmaoh6o46m7pqg3v8d6ggecik8p68dyou7zvvwvr8qjclms5mprowv9'
const WEBHOOK_SECRET = 'hmthkoukhk5z47jul0nvys68h9ihyglykt43iokjtck0sn6nx37ghkd3qwlr5emo8zrx73nxbrmuvw0xukb8qidque9ztz7ru9uys2srvh8sc0ihukn0wsd0'

// Configurações padrão
const DEFAULT_CONFIG = {
  currency: 'MZN',
  environment: 'prod'
}

/**
 * Criar uma transação de pagamento
 * @param {Object} paymentData - Dados do pagamento
 * @param {number} paymentData.amount - Valor em centavos
 * @param {string} paymentData.context - Descrição do pagamento
 * @param {string} paymentData.callbackUrl - URL do webhook
 * @param {string} paymentData.returnUrl - URL de retorno
 * @param {string} [paymentData.currency='MZN'] - Moeda
 * @param {string} [paymentData.environment='prod'] - Ambiente
 * @returns {Promise<Object>} Resposta da API
 */
export const createPayment = async (paymentData) => {
  try {
    const payload = {
      amount: paymentData.amount,
      context: paymentData.context,
      callbackUrl: paymentData.callbackUrl,
      returnUrl: paymentData.returnUrl,
      currency: paymentData.currency || DEFAULT_CONFIG.currency,
      enviroment: paymentData.environment || DEFAULT_CONFIG.environment  // Note: "enviroment" conforme documentação
    }

    console.log('🚀 Criando pagamento:', {
      url: `${VENDORAPAY_API_BASE}/payment/create`,
      payload: { ...payload, callbackUrl: '[REDACTED]', returnUrl: '[REDACTED]' },
      environment: process.env.NODE_ENV
    })

    const response = await fetch(`${VENDORAPAY_API_BASE}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': API_KEY
      },
      body: JSON.stringify(payload)
    })

    console.log('📡 Resposta da API:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (parseError) {
        console.warn('Não foi possível fazer parse do erro:', parseError)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('✅ Dados recebidos:', data)
    
    if (!data.success) {
      throw new Error(data.error || 'Erro ao criar pagamento')
    }

    return {
      success: true,
      redirectUrl: data.redirectUrl,
      transactionId: data.id,
      data: data
    }
  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error)
    
    // Tratamento específico para erros de CORS
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: 'Erro de conexão com o servidor de pagamento. Verifique sua conexão e tente novamente.',
        isCorsError: true
      }
    }
    
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar pagamento'
    }
  }
}

/**
 * Verificar status de uma transação
 * @param {string} transactionId - ID da transação
 * @returns {Promise<Object>} Status da transação
 */
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await fetch(`${VENDORAPAY_API_BASE}/payment/status/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      status: data.status,
      data: data
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    return {
      success: false,
      error: error.message || 'Erro ao verificar status da transação'
    }
  }
}

/**
 * Verificar assinatura do webhook
 * @param {string} payload - Payload do webhook
 * @param {string} signature - Assinatura recebida
 * @returns {boolean} Se a assinatura é válida
 */
export const verifyWebhookSignature = (payload, signature) => {
  try {
    // Implementar verificação de assinatura HMAC
    // Por enquanto, retorna true para desenvolvimento
    // Em produção, implementar verificação real com crypto
    return true
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return false
  }
}

/**
 * Processar webhook de pagamento
 * @param {Object} webhookData - Dados do webhook
 * @returns {Object} Resultado do processamento
 */
export const processWebhook = (webhookData) => {
  try {
    const {
      transactionId,
      status,
      amount,
      currency,
      context,
      timestamp
    } = webhookData

    // Verificar se o pagamento foi aprovado
    const isApproved = status === 'approved' || status === 'completed'
    
    return {
      success: true,
      transactionId,
      status,
      amount,
      currency,
      context,
      timestamp,
      isApproved,
      data: webhookData
    }
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return {
      success: false,
      error: error.message || 'Erro ao processar webhook'
    }
  }
}

/**
 * Formatar valor para exibição
 * @param {number} amount - Valor em centavos
 * @param {string} currency - Moeda
 * @returns {string} Valor formatado
 */
export const formatAmount = (amount, currency = 'MZN') => {
  // Se o valor for menor que 1000, assume que já está em unidades
  const value = amount < 1000 ? amount : amount / 100
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: currency
  }).format(value)
}

/**
 * Converter valor para centavos
 * @param {number} value - Valor em unidades
 * @returns {number} Valor em centavos
 */
export const toCents = (value) => {
  return Math.round(value * 100)
}

/**
 * Configurações dos planos AMSync
 */
export const PLANS_CONFIG = {
  grátis: {
    name: 'Grátis',
    amount: 0,
    description: 'Plano Gratuito - 50 mensagens/mês',
    features: ['50 mensagens/mês', 'Gerenciamento de bloqueios'],
    link: 'https://assistente.amsync.online'
  },
  inicial: {
    name: 'Inicial',
    amount: 199,
    oldAmount: 399,
    description: 'Plano Inicial - 500 mensagens/mês',
    features: ['500 mensagens/mês', 'Gerenciamento de bloqueios']
  },
  essencial: {
    name: 'Essencial',
    amount: 499,
    oldAmount: 999,
    badge: 'Mais Popular',
    description: 'Plano Essencial - 1.200 mensagens/mês',
    features: ['1.200 mensagens/mês', 'Gerenciamento de bloqueios']
  },
  crescimento: {
    name: 'Crescimento',
    amount: 1000,
    oldAmount: 2000,
    description: 'Plano Crescimento - 2.500 mensagens/mês',
    features: ['2.500 mensagens/mês', 'Suporte prioritário', 'Remarketing', 'Envio de fotos e vídeos']
  },
  profissional: {
    name: 'Profissional',
    amount: 1800,
    oldAmount: 3600,
    description: 'Plano Profissional - 10.000 mensagens/mês',
    features: ['10.000 mensagens/mês', 'Múltiplos usuários', 'API', 'Remarketing', 'Envio de fotos e vídeos']
  },
  ilimitado: {
    name: 'Ilimitado',
    amount: 2475,
    oldAmount: 4950,
    description: 'Plano Ilimitado - Mensagens ilimitadas',
    features: ['Mensagens ilimitadas', 'Suporte dedicado no WhatsApp']
  }
}

/**
 * Configurações do curso (mantido para compatibilidade)
 */
export const COURSE_CONFIG = {
  name: 'Curso Completo de Dropshipping',
  description: 'Aprenda dropshipping do zero e comece a faturar online',
  amount: 299, // 299 MZN (valor direto para Nhonga.net)
  currency: 'MZN',
  amountMZN: 299 // 299 MZN
}

/**
 * URLs do sistema
 */
export const SYSTEM_URLS = {
  base: process.env.NODE_ENV === 'production' 
    ? 'https://lacasadigital.com' 
    : 'http://localhost:3000',
  
  get callbackUrl() {
    return `${this.base}/api/webhook/vendorapay`
  },
  
  get returnUrl() {
    return `${this.base}/payment-success`
  },
  
  get cancelUrl() {
    return `${this.base}/payment`
  }
}

/**
 * Armazenar mapeamento de transação para usuário
 * Isso é necessário porque o webhook não tem acesso direto ao usuário logado
 */
const transactionUserMap = new Map()

/**
 * Registrar transação com usuário
 * @param {string} transactionId - ID da transação
 * @param {string} userId - UID do usuário
 * @param {string} userEmail - Email do usuário
 */
export const registerTransactionUser = (transactionId, userId, userEmail) => {
  const transactionData = {
    userId,
    userEmail,
    timestamp: new Date().toISOString()
  }
  
  // Armazenar em memória
  transactionUserMap.set(transactionId, transactionData)
  
  // Armazenar no localStorage como backup
  try {
    const existingTransactions = JSON.parse(localStorage.getItem('nhonga_transactions') || '{}')
    existingTransactions[transactionId] = transactionData
    localStorage.setItem('nhonga_transactions', JSON.stringify(existingTransactions))
  } catch (error) {
    console.error('Erro ao salvar transação no localStorage:', error)
  }
  
  console.log('Transação registrada:', { transactionId, userId, userEmail })
}

/**
 * Obter usuário da transação
 * @param {string} transactionId - ID da transação
 * @returns {Object|null} Dados do usuário ou null
 */
export const getTransactionUser = (transactionId) => {
  // Tentar obter da memória primeiro
  let transactionData = transactionUserMap.get(transactionId)
  
  // Se não encontrar na memória, tentar do localStorage
  if (!transactionData) {
    try {
      const existingTransactions = JSON.parse(localStorage.getItem('nhonga_transactions') || '{}')
      transactionData = existingTransactions[transactionId]
      
      // Se encontrar no localStorage, restaurar na memória
      if (transactionData) {
        transactionUserMap.set(transactionId, transactionData)
      }
    } catch (error) {
      console.error('Erro ao ler transação do localStorage:', error)
    }
  }
  
  return transactionData || null
}

/**
 * Limpar transação (após processamento)
 * @param {string} transactionId - ID da transação
 */
export const clearTransactionUser = (transactionId) => {
  // Remover da memória
  transactionUserMap.delete(transactionId)
  
  // Remover do localStorage
  try {
    const existingTransactions = JSON.parse(localStorage.getItem('nhonga_transactions') || '{}')
    delete existingTransactions[transactionId]
    localStorage.setItem('nhonga_transactions', JSON.stringify(existingTransactions))
  } catch (error) {
    console.error('Erro ao limpar transação do localStorage:', error)
  }
}

/**
 * Limpar transações antigas (mais de 1 hora)
 */
export const clearOldTransactions = () => {
  try {
    const existingTransactions = JSON.parse(localStorage.getItem('nhonga_transactions') || '{}')
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    let cleanedCount = 0
    Object.entries(existingTransactions).forEach(([transactionId, data]) => {
      const transactionTime = new Date(data.timestamp)
      if (transactionTime < oneHourAgo) {
        delete existingTransactions[transactionId]
        transactionUserMap.delete(transactionId)
        cleanedCount++
      }
    })
    
    if (cleanedCount > 0) {
      localStorage.setItem('nhonga_transactions', JSON.stringify(existingTransactions))
      console.log(`🧹 Limpeza: ${cleanedCount} transações antigas removidas`)
    }
  } catch (error) {
    console.error('Erro ao limpar transações antigas:', error)
  }
}

export default {
  createPayment,
  getTransactionStatus,
  verifyWebhookSignature,
  processWebhook,
  formatAmount,
  toCents,
  PLANS_CONFIG,
  COURSE_CONFIG,
  SYSTEM_URLS,
  registerTransactionUser,
  getTransactionUser,
  clearTransactionUser,
  clearOldTransactions
}
