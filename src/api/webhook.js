// Webhook handler para Nhonga.net
import { processWebhook, verifyWebhookSignature } from '../services/nhonga'

/**
 * Handler para webhooks da Nhonga.net
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const nhongaWebhook = async (req, res) => {
  try {
    // Verificar método HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Obter dados do webhook
    const webhookData = req.body
    const signature = req.headers['x-nhonga-signature'] || req.headers['x-signature']

    console.log('Webhook recebido:', {
      data: webhookData,
      signature: signature,
      headers: req.headers
    })

    // Verificar assinatura (opcional para desenvolvimento)
    if (signature && !verifyWebhookSignature(JSON.stringify(webhookData), signature)) {
      console.error('Assinatura inválida do webhook')
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // Processar webhook
    const result = processWebhook(webhookData)

    if (!result.success) {
      console.error('Erro ao processar webhook:', result.error)
      return res.status(400).json({ error: result.error })
    }

    // Se o pagamento foi aprovado, atualizar status do usuário
    if (result.isApproved) {
      console.log('Pagamento aprovado:', {
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency
      })

      // Aqui você pode:
      // 1. Atualizar o status de pagamento no Firebase
      // 2. Enviar email de confirmação
      // 3. Ativar acesso ao curso
      // 4. Registrar a transação no banco de dados

      // Exemplo de atualização no Firebase (implementar conforme necessário)
      // await updateUserPaymentStatus(result.transactionId, result.amount)
    }

    // Responder com sucesso
    res.status(200).json({ 
      success: true, 
      message: 'Webhook processed successfully',
      transactionId: result.transactionId
    })

  } catch (error) {
    console.error('Erro no webhook:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

/**
 * Handler para verificar status de pagamento
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.query

    if (!transactionId) {
      return res.status(400).json({ error: 'Transaction ID is required' })
    }

    // Aqui você pode verificar o status no seu banco de dados
    // ou fazer uma consulta à API da Nhonga.net
    
    res.status(200).json({
      success: true,
      transactionId,
      status: 'completed', // ou o status real
      message: 'Payment status retrieved'
    })

  } catch (error) {
    console.error('Erro ao verificar status:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}

export default {
  nhongaWebhook,
  checkPaymentStatus
}
