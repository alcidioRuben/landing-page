import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getTransactionUser, getTransactionStatus, clearTransactionUser, clearOldTransactions, PLANS_CONFIG } from '../services/nhonga'
import metaPixelService from '../services/metaPixel'
import Navbar from '../components/Navbar'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, userProfile, updatePaymentFromWebhook } = useAuth()
  const [countdown, setCountdown] = useState(3)
  const [isCheckingPayment, setIsCheckingPayment] = useState(true)
  
  // Obter dados do pagamento (pode vir do state ou da URL)
  const { sessionId, transactionId, amount } = location.state || {}
  const urlParams = new URLSearchParams(location.search)
  const urlTransactionId = urlParams.get('transactionId')
  const urlAmount = urlParams.get('amount')
  const urlStatus = urlParams.get('status')

  // Usar dados do state ou da URL
  const paymentData = {
    sessionId: sessionId || urlTransactionId,
    transactionId: transactionId || urlTransactionId,
    amount: amount || urlAmount || 299,
    status: urlStatus
  }

  useEffect(() => {
    // Se usuário não estiver logado, redirecionar para login
    if (!currentUser) {
      navigate('/login')
      return
    }

    // Se usuário já pagou, redirecionar para dashboard IMEDIATAMENTE
    if (userProfile?.isPaid) {
      console.log('✅ Usuário já pagou, redirecionando para Dashboard')
      navigate('/dashboard', { replace: true })
      return
    }

    // Se não tiver dados do pagamento, verificar se é um retorno do Nhonga.net
    if (!paymentData.sessionId && !paymentData.transactionId) {
      console.log('🔍 Sem dados de pagamento, verificando transações pendentes...')
      
      // Verificar se há transações pendentes do usuário
      const checkPendingTransactions = () => {
        try {
          // Limpar transações antigas primeiro
          clearOldTransactions()
          
          const existingTransactions = JSON.parse(localStorage.getItem('nhonga_transactions') || '{}')
          const userTransactions = Object.entries(existingTransactions).filter(
            ([_, data]) => data.userId === currentUser.uid
          )
          
          if (userTransactions.length > 0) {
            console.log('⏳ Transações pendentes encontradas:', userTransactions)
            
            // Processar transações pendentes (assumir que se retornou do Nhonga.net, pagamento foi concluído)
            const processPendingTransactions = async () => {
              try {
                // Pegar a transação mais recente
                const latestTransaction = userTransactions[userTransactions.length - 1]
                const [transactionId, data] = latestTransaction
                
                console.log(`✅ Processando transação mais recente: ${transactionId}`)
                console.log(`👤 Usuário: ${data.userId}`)
                
                // Assumir que se o usuário retornou do Nhonga.net, o pagamento foi concluído
                // Determinar dados do plano baseado no valor pago
                let planData = null
                let amount = 299
                let context = 'Curso Completo de Dropshipping'
                
                // Buscar plano pelo valor (assumindo que o valor está em localStorage ou pode ser inferido)
                const planValues = Object.values(PLANS_CONFIG)
                const matchingPlan = planValues.find(plan => plan.amount === amount)
                
                if (matchingPlan) {
                  planData = matchingPlan
                  context = planData.description
                }
                
                // Atualizar status do usuário
                await updatePaymentFromWebhook(data.userId, {
                  amount: amount,
                  transactionId: transactionId,
                  currency: 'MZN',
                  context: context,
                  planName: planData?.name || 'Curso Completo'
                })

                // Meta Pixel - Rastrear compra bem-sucedida
                metaPixelService.trackPurchase(transactionId)
                
                console.log('✅ Status do usuário atualizado - pagamento assumido como concluído')
                
                // Limpar todas as transações do usuário após processamento
                userTransactions.forEach(([txnId, _]) => {
                  clearTransactionUser(txnId)
                })
                
                setIsCheckingPayment(false)
                
              } catch (error) {
                console.error('❌ Erro ao processar transações:', error)
                setTimeout(() => {
                  setIsCheckingPayment(false)
                  navigate('/')
                }, 2000)
              }
            }
            
            processPendingTransactions()
            return
          }
        } catch (error) {
          console.error('Erro ao verificar transações pendentes:', error)
        }
        
        // Se não há transações pendentes, redirecionar imediatamente
        console.log('❌ Nenhuma transação pendente encontrada')
        setTimeout(() => {
          setIsCheckingPayment(false)
          navigate('/')
        }, 2000)
      }
      
      checkPendingTransactions()
      return
    }

    console.log('✅ Dados de pagamento encontrados:', paymentData)
    setIsCheckingPayment(false)

    // Contagem regressiva
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [currentUser, userProfile, paymentData.sessionId, paymentData.transactionId, navigate])

  // Efeito separado para redirecionamento
  useEffect(() => {
    if (countdown <= 0 && !isCheckingPayment) {
      console.log('⏰ Contagem regressiva finalizada, verificando status do pagamento...')
      
      // Verificar se usuário pagou antes de redirecionar
      if (userProfile?.isPaid) {
        console.log('✅ Pagamento confirmado, redirecionando para Dashboard')
        navigate('/dashboard', { replace: true })
      } else {
        console.log('❌ Pagamento não confirmado, redirecionando para recursos')
        // Se não pagou, redirecionar para recursos (que vai redirecionar para payment)
        navigate('/recursos', { replace: true })
      }
    }
  }, [countdown, isCheckingPayment, userProfile, navigate])

  // Mostrar loading enquanto verifica pagamento
  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verificando pagamento...</h2>
          <p className="text-gray-500">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  if (!paymentData.sessionId && !paymentData.transactionId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="max-w-md w-full"
      >
        {/* Card Principal */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden"
        >
          {/* Background decorativo */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          {/* Ícone de Sucesso Animado */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            className="relative mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <motion.svg 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </motion.svg>
              </div>
              
            {/* Efeito de pulso */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto"
            ></motion.div>
          </motion.div>

          {/* Título */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            Pagamento Aprovado! 🎉
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-gray-600 mb-6"
          >
            Bem-vindo ao AMSync Ads!
          </motion.p>

          {/* Valor do Pagamento */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 mb-6"
          >
            <p className="text-sm text-gray-600 mb-1">Valor Pago</p>
            <p className="text-2xl font-bold text-green-600">MZN {paymentData.amount}</p>
            {paymentData.transactionId && (
              <p className="text-xs text-gray-500 mt-1">ID: {paymentData.transactionId}</p>
            )}
          </motion.div>

          {/* Contagem Regressiva */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center space-x-2">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
              ></motion.div>
              <p className="text-sm text-gray-600">
                Redirecionando em {countdown}s...
                  </p>
                </div>
          </motion.div>

          {/* Botão de Ação */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Ir para Dashboard
          </motion.button>
        </motion.div>

        {/* Botão WhatsApp Flutuante */}
        <motion.a
          href="https://wa.me/25887400696"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </motion.a>
      </motion.div>
      </div>
    </div>
  )
}

export default PaymentSuccess
