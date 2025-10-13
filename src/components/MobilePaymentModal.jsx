import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createMobilePayment } from '../services/nhonga';
import metaPixelService from '../services/metaPixel';

const MobilePaymentModal = ({ isOpen, onClose, plan, user }) => {
  const [formData, setFormData] = useState({
    method: 'mpesa',
    phone: '',
    useremail: user?.email || '',
    userwhatsApp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação dos campos obrigatórios
    if (!formData.phone.trim()) {
      setError('Por favor, insira o número do telefone.');
      setIsLoading(false);
      return;
    }
    
    if (!formData.useremail.trim()) {
      setError('Por favor, insira o email.');
      setIsLoading(false);
      return;
    }
    
    if (!formData.userwhatsApp.trim()) {
      setError('Por favor, insira o número do WhatsApp.');
      setIsLoading(false);
      return;
    }

    try {
      const paymentData = {
        method: formData.method,
        amount: plan.amount,
        context: plan.description,
        useremail: formData.useremail.trim(),
        userwhatsApp: formData.userwhatsApp.trim(),
        phone: formData.phone.trim()
      };

      console.log('💳 Iniciando pagamento móvel:', {
        ...paymentData,
        useremail: '[REDACTED]',
        userwhatsApp: '[REDACTED]',
        phone: '[REDACTED]'
      });

      // Meta Pixel - Rastrear início do pagamento
      if (plan && plan.amount) {
        metaPixelService.trackInitiateCheckout(plan.amount, 'MZN');
      }

      const result = await createMobilePayment(paymentData);

      if (result.success) {
        setSuccess(true);
        console.log('✅ Pagamento criado com sucesso:', result);
        
        // Meta Pixel - Rastrear pagamento bem-sucedido
        if (plan && plan.amount) {
          metaPixelService.trackPurchase(plan.amount, 'MZN');
        }
        
        // Fechar modal após 3 segundos
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            method: 'mpesa',
            phone: '',
            useremail: user?.email || '',
            userwhatsApp: ''
          });
        }, 3000);
      } else {
        setError(result.error || 'Erro ao processar pagamento');
        console.error('❌ Erro no pagamento:', result.error);
      }
    } catch (error) {
      setError(error.message || 'Erro inesperado ao processar pagamento');
      console.error('❌ Erro no pagamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !plan || !plan.amount || !plan.description) {
    console.error('❌ Modal de pagamento: Plano inválido', plan);
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1e1e1e] rounded-2xl p-4 w-full max-w-sm border border-white/10 shadow-2xl"
        >
          {success ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Pagamento Processado!</h3>
              <p className="text-gray-300 mb-4">
                Seu pagamento de <span className="font-semibold text-green-400">${plan.currentUSD || (plan.amount / 63.5).toFixed(2)}</span> foi processado com sucesso!
              </p>
              <p className="text-sm text-gray-400">
                Aguarde alguns segundos para ser redirecionado...
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Pagar com {formData.method === 'mpesa' ? 'M-Pesa' : 'E-Mola'}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-3 bg-white/5 rounded-xl">
                <h4 className="text-base font-semibold text-white mb-1">{plan.name}</h4>
                <p className="text-gray-300 text-xs mb-1">{plan.description}</p>
                <div className="text-xl font-bold text-green-400">${plan.currentUSD || (plan.amount / 63.5).toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">💳 Pagamento em Metical (MT {plan.amount})</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Método de Pagamento */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Método de Pagamento
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, method: 'mpesa' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        formData.method === 'mpesa'
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                        <span className="font-medium text-sm">M-Pesa</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, method: 'emola' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                        formData.method === 'emola'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                        <span className="font-medium text-sm">E-Mola</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Número do Telefone */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Número {formData.method === 'mpesa' ? 'M-Pesa' : 'E-Mola'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: 841234567"
                    className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="useremail"
                    value={formData.useremail}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="userwhatsApp"
                    value={formData.userwhatsApp}
                    onChange={handleInputChange}
                    placeholder="Ex: 841234567"
                    className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </div>
                  ) : (
                    `Pagar $${plan.currentUSD || (plan.amount / 63.5).toFixed(2)} com ${formData.method === 'mpesa' ? 'M-Pesa' : 'E-Mola'}`
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                🔒 Pagamento seguro processado pela AMSync Ads
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobilePaymentModal;
