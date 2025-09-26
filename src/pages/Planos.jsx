import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Planos = () => {
  const navigate = useNavigate()

  const planos = [
    { name: 'Grátis', amount: 0, badge: 'Plano Gratuito', features: ['50 mensagens/mês', 'Gerenciamento de bloqueios'], link: 'https://assistente.amsync.online' },
    { name: 'Inicial', amount: 199, old: 399, features: ['500 mensagens/mês', 'Gerenciamento de bloqueios'],link: 'https://assistente.amsync.online' },
    { name: 'Essencial', amount: 499, old: 999, badge: 'Mais Popular', features: ['1.200 mensagens/mês', 'Gerenciamento de bloqueios'] },
    { name: 'Crescimento', amount: 1000, old: 2000, features: ['2.500 mensagens/mês', 'Suporte prioritário', 'Remarketing', 'Envio de fotos e vídeos'] },
    { name: 'Profissional', amount: 1800, old: 3600, features: ['10.000 mensagens/mês', 'Múltiplos usuários', 'API', 'Remarketing', 'Envio de fotos e vídeos'] },
    { name: 'Ilimitado', amount: 2475, old: 4950, features: ['Mensagens ilimitadas', 'Suporte dedicado no WhatsApp'] }
  ]

  const handleEscolher = (plano) => {
    if (plano.amount === 0 && plano.link) {
      window.open(plano.link, '_blank', 'noopener,noreferrer')
      return
    }
    navigate('/payment', { state: { plan: { name: plano.name, amount: plano.amount, features: plano.features } } })
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-extrabold text-white mb-3"
        >
          Escolha seu plano
        </motion.h1>
        <p className="text-gray-300 mb-8">Selecione o plano desejado para prosseguir com o pagamento.</p>

        <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
          <div className="flex gap-4 px-4 snap-x snap-mandatory">
            {planos.map((plan) => (
              <div key={plan.name} className={`snap-start min-w-[280px] sm:min-w-[300px] bg-white rounded-2xl p-6 shadow-2xl ${plan.badge ? 'ring-2 ring-yellow-400' : ''}`}>
                {plan.badge && (
                  <div className="mb-3 inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">{plan.badge}</div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                {plan.amount > 0 ? (
                  <>
                    {plan.old && (
                      <div className="mb-1 text-gray-400 line-through">MT {plan.old} /mês</div>
                    )}
                    <div className="text-3xl font-extrabold text-gray-900">MT {plan.amount} <span className="text-base font-medium">/mês</span></div>
                  </>
                ) : (
                  <div className="text-3xl font-extrabold text-gray-900">MT 0 <span className="text-base font-medium">/mês</span></div>
                )}
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    onClick={() => handleEscolher(plan)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg w-full inline-block text-center shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  >
                    {plan.amount === 0 ? 'Acessar Grátis' : 'Escolher plano'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-blue-100 mt-3">Arraste para o lado para ver mais planos</p>
        </div>
      </div>
    </div>
  )
}

export default Planos


