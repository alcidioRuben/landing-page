import React from 'react';

const CardDepoimento = ({ 
  // Props antigas (para compatibilidade)
  nome, 
  cargo, 
  foto, 
  depoimento, 
  nota, 
  empresa = null,
  // Props novas (usadas na Home)
  name,
  role,
  photo,
  testimonial,
  rating
}) => {
  // Usar props novas se disponíveis, senão usar as antigas
  const displayName = name || nome;
  const displayRole = role || cargo;
  const displayPhoto = photo || foto;
  const displayTestimonial = testimonial || depoimento;
  const displayRating = rating || nota;

  // Renderizar estrelas baseado na nota
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-5 h-5 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Cabeçalho do Card */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Foto do usuário */}
        <div className="flex-shrink-0">
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {displayName && displayName.charAt ? displayName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Informações do usuário */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {displayName || 'Usuário'}
          </h4>
          <p className="text-sm text-gray-600 mb-1">
            {displayRole || 'Aluno'}
          </p>
          {empresa && (
            <p className="text-xs text-gray-500">
              {empresa}
            </p>
          )}
        </div>

        {/* Nota em estrelas */}
        <div className="flex items-center space-x-1">
          {renderStars(displayRating || 5)}
        </div>
      </div>

      {/* Depoimento */}
      <blockquote className="text-gray-700 leading-relaxed">
        "{displayTestimonial || 'Depoimento não disponível'}"
      </blockquote>

      {/* Indicador de verificação */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-green-600 font-medium">
            Aluno Verificado
          </span>
        </div>

        {/* Data do depoimento (mock) */}
        <span className="text-xs text-gray-400">
          Há 2 semanas
        </span>
      </div>
    </div>
  );
};

export default CardDepoimento;
