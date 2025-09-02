import { loadStripe } from '@stripe/stripe-js'

// Chave pública do Stripe (substitua pela sua chave de teste)
const stripePromise = loadStripe('pk_test_sua_chave_publica_aqui')

// Função para criar sessão de checkout
export const createCheckoutSession = async (priceId, customerEmail) => {
  try {
    const stripe = await stripePromise
    
    // Em um projeto real, você faria uma chamada para sua API backend
    // que criaria a sessão de checkout no Stripe
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: priceId,
        customerEmail: customerEmail,
      }),
    })

    const session = await response.json()

    // Redirecionar para o checkout do Stripe
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return result
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    throw error
  }
}

// Função para verificar status do pagamento
export const checkPaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`/api/check-payment-status?session_id=${sessionId}`)
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error)
    throw error
  }
}

// Função mock para desenvolvimento (simula pagamento bem-sucedido)
export const mockPayment = async (email) => {
  // Simula um delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    success: true,
    sessionId: 'mock_session_' + Date.now(),
    customerEmail: email,
    amount: 300, // R$ 297,00 em centavos
    currency: 'brl'
  }
}

export default stripePromise
