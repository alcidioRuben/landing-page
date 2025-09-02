import React from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'blue', 
  text = 'Carregando...', 
  showText = true,
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  }

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  }

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const dotsVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const SpinnerContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinner Principal */}
      <div className="relative">
        {/* Círculo externo */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
          variants={spinnerVariants}
          animate="animate"
        />
        
        {/* Círculo interno animado */}
        <motion.div
          className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-transparent border-t-4 ${colorClasses[color]} rounded-full`}
          variants={spinnerVariants}
          animate="animate"
        />
        
        {/* Ponto central pulsante */}
        <motion.div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${colorClasses[color]} rounded-full`}
          variants={pulseVariants}
          animate="animate"
        />
      </div>

      {/* Texto de carregamento */}
      {showText && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className={`text-sm font-medium ${colorClasses[color]}`}>
            {text}
          </p>
          
          {/* Pontos animados */}
          <div className="flex justify-center space-x-1 mt-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`w-1 h-1 ${colorClasses[color]} rounded-full`}
                variants={dotsVariants}
                animate="animate"
                transition={{ delay: index * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
        >
          <SpinnerContent />
        </motion.div>
      </motion.div>
    )
  }

  return <SpinnerContent />
}

// Spinner específico para páginas
export const PageLoadingSpinner = ({ text = 'Carregando página...' }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <LoadingSpinner 
        size="xlarge" 
        color="blue" 
        text={text}
        showText={true}
      />
    </motion.div>
  </div>
)

// Spinner para botões
export const ButtonSpinner = ({ color = 'white' }) => (
  <motion.div
    className="flex items-center space-x-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <LoadingSpinner size="small" color={color} showText={false} />
    <span>Processando...</span>
  </motion.div>
)

// Spinner para cards/seções
export const CardSpinner = ({ text = 'Carregando...' }) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner 
      size="large" 
      color="blue" 
      text={text}
      showText={true}
    />
  </div>
)

// Spinner para overlays
export const OverlaySpinner = ({ text = 'Carregando...' }) => (
  <motion.div
    className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <LoadingSpinner 
      size="large" 
      color="blue" 
      text={text}
      showText={true}
    />
  </motion.div>
)

export default LoadingSpinner
