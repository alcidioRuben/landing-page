import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { createPayment, COURSE_CONFIG, SYSTEM_URLS, formatAmount, registerTransactionUser } from '../services/nhonga'
import { ButtonSpinner } from '../components/LoadingSpinner'
import BotaoCTA from '../components/BotaoCTA'
import metaPixelService from '../services/metaPixel'
import '../styles/animations.css'

const Payment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, userProfile } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Verificar se veio um plano da página Planos
  const selectedPlan = location.state?.plan

  // Verificar se o usuário já pagou e redirecionar para recursos
  useEffect(() => {
    if (currentUser && userProfile?.isPaid) {
      navigate('/recursos')
    }
  }, [currentUser, userProfile, navigate])

  // Meta Pixel - Rastrear visualização da página de pagamento
  useEffect(() => {
    metaPixelService.trackPaymentStart();
  }, [])

  const handlePayment = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      // Pagamento via Nhonga.net
      const amountToPay = selectedPlan?.amount || COURSE_CONFIG.amount
      const contextToUse = selectedPlan ? `Plano ${selectedPlan.name}` : COURSE_CONFIG.description

      const paymentData = {
        amount: amountToPay,
        context: contextToUse,
        callbackUrl: SYSTEM_URLS.callbackUrl,
        returnUrl: SYSTEM_URLS.returnUrl,
        currency: 'MZN',
        environment: 'prod',
        // Incluir dados do usuário para identificação no webhook
        userId: currentUser.uid,
        userEmail: currentUser.email
      }

      const result = await createPayment(paymentData)
      
      if (result.success) {
        // Registrar transação com usuário para identificação no webhook
        registerTransactionUser(result.transactionId, currentUser.uid, currentUser.email)
        
        // Redirecionar para o checkout da Nhonga.net
        window.location.href = result.redirectUrl
      } else {
        setError(result.error || 'Erro ao criar pagamento. Tente novamente.')
      }
    } catch (error) {
      setError('Erro ao processar pagamento: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleLoginRedirect = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Finalizar Compra
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Acesso completo ao curso de Dropshipping
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário de Pagamento */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-8"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">
                  Informações de Pagamento
                </h2>

                {!currentUser ? (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Faça login para continuar
                      </h3>
                      <p className="text-gray-300">
                        Você precisa estar logado para finalizar a compra
                      </p>
                    </div>
                    <BotaoCTA 
                      onClick={handleLoginRedirect}
                      fullWidth
                      size="large"
                      animated={true}
                      variant="gradient"
                    >
                      Fazer Login
                    </BotaoCTA>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <p className="font-medium text-white">{userProfile?.name || currentUser.email}</p>
                            <p className="text-sm text-gray-300">{currentUser.email}</p>
                          </div>
                  </div>
                    </div>
                    </div>

                    {/* Informações do Pagamento */}
                    <div className="mb-6">
                      <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <div>
                            <p className="font-medium text-blue-300">Pagamento Seguro</p>
                            <p className="text-sm text-blue-200">Processado através de Pagamento Seguro</p>
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Erro */}
                  {error && (
                      <div className="bg-red-900/20 border border-red-800/40 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-300">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Botão de Pagamento */}
                  <BotaoCTA
                      onClick={handlePayment}
                      disabled={isProcessing}
                    fullWidth
                    size="large"
                    animated={!isProcessing}
                    variant="gradient"
                    className={isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isProcessing ? (
                        <ButtonSpinner color="white" />
                    ) : (
                        `Finalizar Compra - ${formatAmount(COURSE_CONFIG.amount, 'MZN')}`
                    )}
                  </BotaoCTA>

                  {/* Segurança */}
                    <div className="text-center mt-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                        <span>Pagamento seguro</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Resumo da Compra */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="bg-white/5 border border-white/10 rounded-xl shadow-lg p-6 sticky top-8"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Resumo do Plano
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{selectedPlan ? `Plano ${selectedPlan.name}` : 'Assinatura AMSync Ads'}</span>
                    <span className="font-medium text-white">MZN {selectedPlan ? selectedPlan.amount : 299},00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Acesso Vitalício</span>
                    <span className="text-green-400 font-medium">Grátis</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Suporte Premium</span>
                    <span className="text-green-400 font-medium">Incluso</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Atualizações</span>
                    <span className="text-green-400 font-medium">Grátis</span>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span className="text-white">Total</span>
                      <motion.span 
                        className="text-blue-400"
                        animate={{ 
                          scale: [1, 1.05, 1],
                          color: ['#667eea', '#f093fb', '#667eea']
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        MZN {selectedPlan ? selectedPlan.amount : 299},00
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <motion.div 
                  className="mt-6 pt-6 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <h4 className="font-medium text-white mb-3">O que você recebe:</h4>
                  <motion.ul 
                    className="space-y-2 text-sm text-gray-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    {(selectedPlan?.features || ['Mensagens', 'Suporte', 'Atualizações']).map((feat, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center space-x-2"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.svg 
                          className="w-4 h-4 text-green-500" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </motion.svg>
                        <span>{feat}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Botão Flutuante do WhatsApp */}
      <motion.a
        href="https://wa.me/25887400696"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ 
          scale: 1,
          y: [0, -5, 0]
        }}
        transition={{ 
          delay: 1, 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 }
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse-glow"
      >
        <motion.svg 
          className="w-8 h-8 text-white" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </motion.svg>
      </motion.a>
    </div>
  )
}

export default Payment
