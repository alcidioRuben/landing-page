import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BotaoCTA = ({ 
  children, 
  to, 
  onClick, 
  variant = 'primary', 
  size = 'default',
  fullWidth = false,
  className = '',
  animated = true // Nova prop para controlar animações
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Variantes de estilo
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border-2 border-white/20 text-white hover:bg-white/10 rounded-lg',
    gradient: 'bg-gradient-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl'
  }

  // Tamanhos
  const sizes = {
    small: 'py-2 px-4 text-sm',
    default: 'py-3 px-6',
    large: 'py-4 px-8 text-lg'
  }

  // Classes base
  const baseClasses = variants[variant]
  const sizeClasses = sizes[size]
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const buttonClasses = `${baseClasses} ${sizeClasses} ${widthClasses} ${className}`.trim()

  // Animações do Framer Motion
  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const bounceAnimation = {
    y: [0, -3, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const shimmerAnimation = {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }

  // Componente de botão animado
  const AnimatedButton = ({ children, ...props }) => (
    <motion.button
      {...props}
      className={`${buttonClasses} relative overflow-hidden`}
      animate={animated ? { ...pulseAnimation, ...bounceAnimation } : {}}
      whileHover={animated ? { 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={animated ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: animated && variant === 'gradient' 
          ? 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
          : undefined,
        backgroundSize: animated && variant === 'gradient' ? '200% 100%' : undefined
      }}
    >
      {/* Efeito Shimmer */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={shimmerAnimation}
          style={{
            transform: 'skewX(-20deg)',
            left: '-100%',
            width: '100%',
            height: '100%'
          }}
        />
      )}
      
      {/* Conteúdo do botão */}
      <span className="relative z-10">{children}</span>
      
      {/* Efeito de brilho no hover */}
      {animated && isHovered && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )

  // Componente de link animado
  const AnimatedLink = ({ children, ...props }) => (
    <motion.div
      animate={animated ? { ...pulseAnimation, ...bounceAnimation } : {}}
      whileHover={animated ? { 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={animated ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
    >
      <Link 
        {...props}
        className={`${buttonClasses} relative overflow-hidden block`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: animated && variant === 'gradient' 
            ? 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
            : undefined,
          backgroundSize: animated && variant === 'gradient' ? '200% 100%' : undefined
        }}
      >
        {/* Efeito Shimmer */}
        {animated && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={shimmerAnimation}
            style={{
              transform: 'skewX(-20deg)',
              left: '-100%',
              width: '100%',
              height: '100%'
            }}
          />
        )}
        
        {/* Conteúdo do link */}
        <span className="relative z-10">{children}</span>
        
        {/* Efeito de brilho no hover */}
        {animated && isHovered && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.div>
  )

  // Se tiver um link, renderiza como Link animado
  if (to) {
    return <AnimatedLink to={to}>{children}</AnimatedLink>
  }

  // Se tiver onClick, renderiza como botão animado
  if (onClick) {
    return <AnimatedButton onClick={onClick}>{children}</AnimatedButton>
  }

  // Botão padrão animado
  return <AnimatedButton>{children}</AnimatedButton>
}

export default BotaoCTA
