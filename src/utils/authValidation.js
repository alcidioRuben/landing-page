// Utilitários para validação de autenticação

// Validação de email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validação de senha
export const validatePassword = (password) => {
  const minLength = 6
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    isValid: password.length >= minLength,
    minLength: password.length >= minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
    strength: calculatePasswordStrength(password)
  }
}

// Calcular força da senha
const calculatePasswordStrength = (password) => {
  let score = 0
  
  if (password.length >= 6) score += 1
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1

  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

// Validação de nome
export const validateName = (name) => {
  const trimmedName = name.trim()
  return {
    isValid: trimmedName.length >= 2 && trimmedName.length <= 50,
    minLength: trimmedName.length >= 2,
    maxLength: trimmedName.length <= 50,
    hasOnlyLetters: /^[a-zA-ZÀ-ÿ\s]+$/.test(trimmedName)
  }
}

// Validação de confirmação de senha
export const validatePasswordConfirmation = (password, confirmPassword) => {
  return {
    isValid: password === confirmPassword,
    passwordsMatch: password === confirmPassword
  }
}

// Validação completa do formulário de registro
export const validateRegistrationForm = (formData) => {
  const errors = {}
  
  // Validar nome
  const nameValidation = validateName(formData.name)
  if (!nameValidation.isValid) {
    if (!nameValidation.minLength) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres'
    } else if (!nameValidation.maxLength) {
      errors.name = 'Nome deve ter no máximo 50 caracteres'
    } else if (!nameValidation.hasOnlyLetters) {
      errors.name = 'Nome deve conter apenas letras'
    }
  }

  // Validar email
  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido'
  }

  // Validar senha
  const passwordValidation = validatePassword(formData.password)
  if (!passwordValidation.isValid) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
  }

  // Validar confirmação de senha
  const confirmPasswordValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = 'As senhas não coincidem'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validação completa do formulário de login
export const validateLoginForm = (formData) => {
  const errors = {}
  
  // Validar email
  if (!validateEmail(formData.email)) {
    errors.email = 'Email inválido'
  }

  // Validar senha
  if (!formData.password || formData.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitizar dados de entrada
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres potencialmente perigosos
    .substring(0, 1000) // Limitar tamanho
}

// Gerar mensagem de erro amigável
export const getFriendlyErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'Usuário não encontrado. Verifique o email.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/email-already-in-use': 'Este email já está sendo usado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/popup-blocked': 'Popup bloqueado. Permita popups para este site.',
    'auth/requires-recent-login': 'Por segurança, faça login novamente.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/credential-already-in-use': 'Esta credencial já está em uso.'
  }

  return errorMessages[errorCode] || 'Erro desconhecido. Tente novamente.'
}
