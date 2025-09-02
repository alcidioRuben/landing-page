import React from 'react'
import { Link } from 'react-router-dom'

const BotaoCTA = ({ 
  children, 
  to, 
  onClick, 
  variant = 'primary', 
  size = 'default',
  fullWidth = false,
  className = ''
}) => {
  // Variantes de estilo
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
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

  // Se tiver um link, renderiza como Link
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    )
  }

  // Se tiver onClick, renderiza como botão
  if (onClick) {
    return (
      <button onClick={onClick} className={buttonClasses}>
        {children}
      </button>
    )
  }

  // Botão padrão
  return (
    <button className={buttonClasses}>
      {children}
    </button>
  )
}

export default BotaoCTA
