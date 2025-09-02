import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { createPayment, COURSE_CONFIG, SYSTEM_URLS, formatAmount } from '../services/nhonga'
import { ButtonSpinner } from '../components/LoadingSpinner'
import BotaoCTA from '../components/BotaoCTA'

const Payment = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, simulatePayment } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('nhonga') // 'nhonga' ou 'simulado'

  // Verificar se o usuário já pagou e redirecionar para recursos
  useEffect(() => {
    if (currentUser && userProfile?.isPaid) {
      navigate('/recursos')
    }
  }, [currentUser, userProfile, navigate])

  const handlePayment = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      if (paymentMethod === 'nhonga') {
        // Pagamento real via Nhonga.net
        const paymentData = {
          amount: COURSE_CONFIG.amount, // 300 MZN (valor direto)
          context: COURSE_CONFIG.description,
          callbackUrl: SYSTEM_URLS.callbackUrl,
          returnUrl: SYSTEM_URLS.returnUrl,
          currency: 'MZN',
          environment: 'prod'
        }

        const result = await createPayment(paymentData)
        
        if (result.success) {
          // Redirecionar para o checkout da Nhonga.net
          window.location.href = result.redirectUrl
        } else {
          setError(result.error || 'Erro ao criar pagamento. Tente novamente.')
        }
      } else {
        // Pagamento simulado para testes
        const result = await simulatePayment(currentUser.uid)
        
        // Redirecionar para página de sucesso
        navigate('/payment-success', { 
          state: { 
            sessionId: result.sessionId,
            amount: result.amount
          }
        })
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Finalizar Compra
            </h1>
            <p className="text-xl text-gray-600">
              Acesso completo ao curso de Dropshipping
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário de Pagamento */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informações de Pagamento
                </h2>

                {!currentUser ? (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Faça login para continuar
                      </h3>
                      <p className="text-gray-600">
                        Você precisa estar logado para finalizar a compra
                      </p>
                    </div>
                    <BotaoCTA 
                      onClick={handleLoginRedirect}
                      fullWidth
                      size="large"
                    >
                      Fazer Login
                    </BotaoCTA>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{userProfile?.name || currentUser.email}</p>
                            <p className="text-sm text-gray-600">{currentUser.email}</p>
                          </div>
                  </div>
                    </div>
                    </div>

                    {/* Método de Pagamento */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Método de Pagamento
                      </label>
                      <div className="space-y-3">
                        {/* Nhonga.net */}
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            paymentMethod === 'nhonga' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setPaymentMethod('nhonga')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === 'nhonga' 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                            }`}>
                              {paymentMethod === 'nhonga' && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                <p className="font-medium text-gray-900">Nhonga.net</p>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Recomendado</span>
                              </div>
                              <p className="text-sm text-gray-600">Pagamento seguro via Nhonga.net</p>
                            </div>
                          </div>
                        </div>

                        {/* Pagamento Simulado */}
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            paymentMethod === 'simulado' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setPaymentMethod('simulado')}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod === 'simulado' 
                                ? 'border-blue-500 bg-blue-500' 
                                : 'border-gray-300'
                            }`}>
                              {paymentMethod === 'simulado' && (
                                <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-medium text-gray-900">Pagamento Simulado</p>
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Teste</span>
                              </div>
                              <p className="text-sm text-gray-600">Para fins de teste e desenvolvimento</p>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Erro */}
                  {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Botão de Pagamento */}
                  <BotaoCTA
                      onClick={handlePayment}
                      disabled={isProcessing}
                    fullWidth
                    size="large"
                    className={isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isProcessing ? (
                        <ButtonSpinner color="white" />
                    ) : (
                        paymentMethod === 'nhonga' 
                          ? `Finalizar Compra - ${formatAmount(COURSE_CONFIG.amount, 'MZN')}`
                          : 'Finalizar Compra - MZN 300,00 (Simulado)'
                    )}
                  </BotaoCTA>

                  {/* Segurança */}
                    <div className="text-center mt-4">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                        <span>
                          {paymentMethod === 'nhonga' 
                            ? 'Pagamento seguro via Nhonga.net' 
                            : 'Pagamento simulado para testes'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo da Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Resumo da Compra
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Curso Completo de Dropshipping</span>
                    <span className="font-medium">MZN 300,00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Acesso Vitalício</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Suporte Premium</span>
                    <span className="text-green-600 font-medium">Incluso</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Atualizações</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary-600">MZN 300,00</span>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">O que você recebe:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>+15 horas de conteúdo</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>+50 aulas práticas</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Suporte vitalício</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>30 dias de garantia</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Flutuante do WhatsApp */}
      <motion.a
        href="https://wa.me/5516981058577"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </motion.a>
    </div>
  )
}

export default Payment
