import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageLoadingSpinner } from '../components/LoadingSpinner';
import BotaoCTA from '../components/BotaoCTA';
import CardDepoimento from '../components/CardDepoimento';
import metaPixelService from '../services/metaPixel';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Simular carregamento rápido da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 300ms para home (mais rápido)

    return () => clearTimeout(timer)
  }, [])

  // Meta Pixel - Rastrear visualização da página inicial
  useEffect(() => {
    metaPixelService.trackHomePageView();
    metaPixelService.trackCourseInterest();
    
    // Rastrear tempo na página após 30 segundos
    const timeTracker = setTimeout(() => {
      metaPixelService.trackTimeOnPage();
    }, 30000);

    // Rastrear scroll profundo
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 75) {
        metaPixelService.trackDeepScroll();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeTracker);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  // Carregar comentários do localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem('userComments');
    if (savedComments) {
      try {
        const parsedComments = JSON.parse(savedComments);
        setUserComments(parsedComments);
        console.log('Comentários carregados do localStorage:', parsedComments);
      } catch (error) {
        console.error('Erro ao carregar comentários do localStorage:', error);
        setUserComments([]);
      }
    }
  }, []);

  if (isLoading) {
    return <PageLoadingSpinner text="Carregando página inicial..." />
  }

  const benefits = [
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Crie seu em 2 minutos",
      description: "Metodologia passo a passo para iniciantes"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: "Baixo Investimento",
      description: "Comece com pouco dinheiro e escale"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Suporte Completo",
      description: "Acompanhamento personalizado 24/7"
    },
    {
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Acesso Vitalício",
      description: "Conteúdo atualizado constantemente, sem custos adicionais"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Empreendedor",
      content: "Transformei minha vida usando a IA para atender clientes no WhatsApp",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Mãe Solteira",
      content: "Consegui criar meu asistente de vendas no WhatsApp em 2 minutos facil",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Estudante",
      content: "Melhor investimento que fiz. Em 2 semanas ja estava lucrando com o meu asistente de vendas no WhatsApp",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Aisha Johnson",
      role: "Empresária",
      content: "Eu perdia vendas no WhatsApp, agora com o AMSync Ads eu tenho um asistente de vendas que atende 24/7 mesmo com telefone apagado",
      image: "https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Kwame Mensah",
      role: "Consultor",
      content: "Em 2 semanas minha perspectiva mudou completamente. Recomendo!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Fatima Diallo",
      role: "Designer",
      content: "O AMSync Ads me ajudou a vender mais no WhatsApp, Eu perdia vendas porquê não tinha tempo para atender todos os clientes e nao tinha tempo de atender todos os clientes",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  const handleAddComment = () => {
    if (newComment.trim() && userRating > 0) {
      const comment = {
        id: Date.now(),
        content: newComment,
        date: new Date().toLocaleDateString('pt-BR'),
        name: "Usuário Anônimo",
        rating: userRating,
        isUserComment: true
      };
      
      const updatedComments = [...userComments, comment];
      setUserComments(updatedComments);
      localStorage.setItem('userComments', JSON.stringify(updatedComments));
      
      // Meta Pixel - Rastrear adição de comentário
      metaPixelService.trackCommentAdd(userRating);
      
      // Log para debug
      console.log('Comentário adicionado:', comment);
      console.log('Comentários salvos no localStorage:', updatedComments);
      
      // Reset form
      setNewComment('');
      setUserRating(0);
      setHoveredRating(0);
      
      // Feedback visual de sucesso
      alert('Comentário enviado com sucesso! Obrigado pela sua avaliação! 🌟');
    }
  };

  // Função para limpar comentários (útil para testes)
  const clearUserComments = () => {
    setUserComments([]);
    localStorage.removeItem('userComments');
    console.log('Comentários limpos do localStorage');
  };

  // Ordenar comentários de usuários por data (mais recentes primeiro)
  const sortedUserComments = [...userComments].sort((a, b) => b.id - a.id);
  const allComments = [...testimonials, ...sortedUserComments];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Banner de Destaque */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="font-semibold text-base">
              AMSync Ads: Automação inteligente para WhatsApp com IA de verdade.
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Conteúdo Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="mb-4">
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-3">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AMSync Ads • Assistente de Vendas no WhatsApp
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Cada venda perdida é dinheiro jogado fora. {' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Transforme seu WhatsApp em uma máquina de vendas com IA
                </span>
              </h1>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                O AMSync Ads automatiza seu atendimento no WhatsApp usando a intiligencia artificial, com uma plataforma visual, fácil e segura. Configure regras, produtos e respostas inteligentes e atenda clientes 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <BotaoCTA 
                  to="/login" 
                  variant="gradient" 
                  size="lg"
                  className="text-base px-6 py-3"
                  onClick={() => metaPixelService.trackCTAClick('Quero começar agora', 'Hero Section')}
                >
                  Quero começar agora
                </BotaoCTA>
                <BotaoCTA 
                  to="/sobre" 
                  variant="outline" 
                  size="lg"
                  className="text-base px-6 py-3"
                  onClick={() => metaPixelService.trackCTAClick('Ver Planos', 'Hero Section')}
                >
                  Ver Planos
                </BotaoCTA>
              </div>

              <div className="mt-6 flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-300">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>+500 empresas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>+1M mensagens</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>99% satisfação</span>
                </div>
              </div>
            </motion.div>

            {/* Vídeo Principal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-xl"
                                        src="https://www.youtube.com/embed/65JGgtM0vBs"
                                        title="AMSync Ads - Como conectar seu WhatsApp"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        onLoad={() => metaPixelService.trackVideoView('Vídeo Principal - AMSync Ads')}
                                      />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Por que escolher o AMSync Ads?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              A solução definitiva para automatizar seu atendimento no WhatsApp com IA real
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Resultados reais de empresas que confiam no AMSync Ads
            </p>
            {userComments.length > 0 && (
              <div className="mt-4">
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {userComments.length} comentário{userComments.length !== 1 ? 's' : ''} de alunos
                </span>
              </div>
            )}
          </motion.div>

          <div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            onMouseEnter={() => metaPixelService.trackTestimonialView()}
          >
            {allComments.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white/5 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 ${
                  testimonial.isUserComment ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  {testimonial.isUserComment ? (
                    // Avatar padrão para comentários de usuários
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  ) : (
                    // Imagem para depoimentos padrão
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-300">
                      {testimonial.isUserComment ? 'Cliente' : testimonial.role}
                    </p>
                    {testimonial.isUserComment && (
                      <p className="text-xs text-gray-400">{testimonial.date}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-200 mb-4">{testimonial.content}</p>
                {testimonial.rating && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {testimonial.isUserComment && (
                      <span className="text-xs text-blue-600 font-medium">
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Sistema de Comentários */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/5 rounded-xl p-6 shadow-lg border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Deixe seu comentário e avaliação
              </h3>
              <div className="space-y-4">
                {/* Sistema de Estrelas */}
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-2">Avalie a plataforma:</p>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-2xl transition-colors duration-200"
                      >
                        <svg
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || userRating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      {userRating === 1 && "Péssimo"}
                      {userRating === 2 && "Ruim"}
                      {userRating === 3 && "Regular"}
                      {userRating === 4 && "Bom"}
                      {userRating === 5 && "Excelente"}
                    </p>
                  )}
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Conte-nos sua experiência com o AMSync Ads..."
                  className="w-full px-4 py-3 border border-gray-600 bg-transparent text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  rows={4}
                />
                <div className="flex justify-center">
                  <BotaoCTA
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || userRating === 0}
                    className="px-8 py-3"
                  >
                    Enviar Comentário
                  </BotaoCTA>
                </div>
                {userRating === 0 && (
                  <p className="text-sm text-red-500 text-center">
                    ⭐ Por favor, selecione uma avaliação com estrelas
                  </p>
                )}
                
                {/* Botão de debug para limpar comentários (apenas em desenvolvimento) */}
                {process.env.NODE_ENV === 'development' && userComments.length > 0 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={clearUserComments}
                      className="text-xs text-gray-500 hover:text-red-500 underline"
                    >
                      🗑️ Limpar comentários (Debug)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção de Planos e Preços */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Planos e Preços
            </h2>
            <p className="text-lg text-blue-100 mb-6">
              Escolha o plano ideal para o seu negócio e comece hoje mesmo
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
              <div className="flex gap-4 px-4 snap-x snap-mandatory">
                {[
                  {
                    name: 'Grátis',
                    old: null,
                    current: '0',
                    badge: 'Plano Gratuito',
                    features: ['50 mensagens/mês', 'Gerenciamento de bloqueios'],
                    link: 'https://assistente.amsync.online',
                    external: true
                  },
                  {
                    name: 'Inicial',
                    old: '399',
                    current: '199',
                    badge: null,
                    features: ['500 mensagens/mês', 'Gerenciamento de bloqueios']
                  },
                  {
                    name: 'Essencial',
                    old: '999',
                    current: '499',
                    badge: 'Mais Popular',
                    features: ['1.200 mensagens/mês', 'Gerenciamento de bloqueios']
                  },
                  {
                    name: 'Crescimento',
                    old: '2.000',
                    current: '1.000',
                    badge: null,
                    features: ['2.500 mensagens/mês', 'Suporte prioritário', 'Remarketing', 'Envio de fotos e vídeos']
                  },
                  {
                    name: 'Profissional',
                    old: '3.600',
                    current: '1.800',
                    badge: null,
                    features: ['10.000 mensagens/mês', 'Múltiplos usuários', 'API', 'Remarketing', 'Envio de fotos e vídeos']
                  },
                  {
                    name: 'Ilimitado',
                    old: '4.950',
                    current: '2.475',
                    badge: null,
                    features: ['Mensagens ilimitadas', 'Suporte dedicado no WhatsApp']
                  }
                ].map((plan, idx) => (
                  <div key={plan.name} className={`snap-start min-w-[280px] sm:min-w-[300px] bg-white rounded-2xl p-6 shadow-2xl ${plan.badge ? 'ring-2 ring-yellow-400' : ''}`}>
                    {plan.badge && (
                      <div className="mb-3 inline-flex items-center px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">{plan.badge}</div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    {plan.old && plan.current ? (
                      <>
                        <div className="text-sm text-gray-500 mb-4">Economia de 50%</div>
                        <div className="mb-1 text-gray-400 line-through">MT {plan.old} /mês</div>
                        <div className="text-3xl font-extrabold text-gray-900">MT {plan.current} <span className="text-base font-medium">/mês</span></div>
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
                      {plan.link ? (
                        <a
                          href={plan.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg w-full inline-block text-center shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                          onClick={() => metaPixelService.trackCTAClick(`Quero este plano - ${plan.name}`, 'Pricing Section')}
                        >
                          Quero este plano
                        </a>
                      ) : (
                        <BotaoCTA
                          to="/login"
                          variant="gradient"
                          className="w-full"
                          onClick={() => metaPixelService.trackCTAClick(`Quero este plano - ${plan.name}`, 'Pricing Section')}
                        >
                          Quero este plano
                        </BotaoCTA>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-blue-100 mt-3">Arraste para o lado para ver mais planos</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para automatizar seu atendimento no WhatsApp?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Conecte seu número em poucos minutos e venda mais com a ajuda do AMSync Ads, 24/7.
            </p>
            <BotaoCTA 
              to="/login" 
              variant="gradient" 
              size="xl"
              className="text-lg px-8 py-3"
              onClick={() => metaPixelService.trackCTAClick('Quero começar agora', 'Final CTA')}
            >
              Quero começar agora
            </BotaoCTA>
          </motion.div>
        </div>
      </section>

      {/* Botão Flutuante do WhatsApp */}
      <motion.a
        href="https://wa.me/25887400696"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
        onClick={() => metaPixelService.trackWhatsAppClick()}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </motion.a>
    </div>
  );
};

export default Home;

