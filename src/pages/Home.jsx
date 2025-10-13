import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { PageLoadingSpinner } from '../components/LoadingSpinner';
import BotaoCTA from '../components/BotaoCTA';
import CardDepoimento from '../components/CardDepoimento';
import MobilePaymentModal from '../components/MobilePaymentModal';
import { useAuth } from '../contexts/AuthContext';
import metaPixelService from '../services/metaPixel';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [newComment, setNewComment] = useState('');
  const [userComments, setUserComments] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, plan: null });
  const [autoScrollTriggered, setAutoScrollTriggered] = useState(false);
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Simular carregamento rápido da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300) // 300ms para home (mais rápido)

    return () => clearTimeout(timer)
  }, [])

  // Scroll automático para seção de planos
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'planos' && !isLoading && !autoScrollTriggered) {
      setAutoScrollTriggered(true);
      setTimeout(() => {
        scrollToPlanos({ preventDefault: () => {} });
      }, 500); // Aguarda carregamento completo
    }
  }, [searchParams, isLoading, autoScrollTriggered]);

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

  // Auto-scroll para mostrar que há mais planos (especialmente no mobile)
  useEffect(() => {
    if (!autoScrollTriggered) {
      const timer = setTimeout(() => {
        const carousel = document.querySelector('.pricing-carousel');
        if (carousel && window.innerWidth < 768) {
          // Scroll para mostrar o segundo plano
          carousel.scrollTo({ left: 350, behavior: 'smooth' });
          
          // Volta após 2 segundos
          setTimeout(() => {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
            setAutoScrollTriggered(true);
          }, 2000);
        } else {
          setAutoScrollTriggered(true);
        }
      }, 3000); // Aguarda 3 segundos após carregar

      return () => clearTimeout(timer);
    }
  }, [autoScrollTriggered]);

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
      image: "/santos-soje.jpg",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Mãe Solteira",
      content: "Consegui criar meu asistente de vendas no WhatsApp em 2 minutos facil",
      image: "/Mulher.jpg",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Estudante",
      content: "Melhor investimento que fiz. Em 2 semanas ja estava lucrando com o meu asistente de vendas no WhatsApp",
      image: "/Jovem.jpg",
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
      name: "guyzelh.ramos",
      role: "Consultor",
      content: "Em 2 semanas minha perspectiva mudou completamente. Recomendo!",
      image: "/auizel.jpg",
      rating: 5
    },
    {
      name: "Fatima Diallo",
      role: "Designer",
      content: "O AMSync Ads me ajudou a vender mais no WhatsApp, Eu perdia vendas porquê não tinha tempo para atender todos os clientes e nao tinha tempo de atender todos os clientes",
      image: "/menina.jpg",
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

  // Função para abrir modal de pagamento
  const handlePaymentClick = (plan) => {
    setPaymentModal({ isOpen: true, plan });
  };

  // Função para fechar modal de pagamento
  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, plan: null });
  };

  const scrollToPlanos = (e) => {
    e.preventDefault();
    const planosSection = document.getElementById('planos-section');
    if (planosSection) {
      metaPixelService.trackCTAClick('Ver Planos', 'Hero Section');
      
      // Adiciona efeito de pulso na seção
      planosSection.classList.add('animate-pulse-once');
      
      // Scroll suave com offset para navbar
      const yOffset = -80;
      const y = planosSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Remove animação após completar
      setTimeout(() => {
        planosSection.classList.remove('animate-pulse-once');
      }, 1500);
    }
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
                  to="https://assistente.amsync.online" 
                  variant="gradient" 
                  size="lg"
                  className="text-base px-6 py-3"
                  onClick={() => metaPixelService.trackCTAClick('Quero começar grátis', 'Hero Section')}
                >
                  Quero começar grátis
                </BotaoCTA>
                <motion.button
                  onClick={scrollToPlanos}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-base px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-[#121212] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Ver Planos
                </motion.button>
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
              <div className="relative bg-white/5 rounded-xl p-3 shadow-2xl border border-white/10">
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

      {/* Carrossel de Screenshots do WhatsApp */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Veja o AMSync Ads por dentro
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Screenshots reais da plataforma em ação
            </p>
          </motion.div>
        </div>

        {/* Carrossel Infinito - Largura Total */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden py-8">
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, '-50%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
            style={{ 
              width: 'max-content'
            }}
          >
              {[
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02.jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (1).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (2).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (3).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (4).jpeg',
                // Duplicar exatamente para loop perfeito
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02.jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (1).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (2).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (3).jpeg',
                '/src/logo/WhatsApp Image 2025-10-13 at 02.10.02 (4).jpeg',
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-80 sm:w-96 md:w-[500px] lg:w-[600px]"
                >
                  <div className="bg-white/10 rounded-xl p-2 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 border border-white/20">
                    <img
                      src={img}
                      alt={`WhatsApp Screenshot ${(idx % 5) + 1}`}
                      className="w-full h-auto rounded-lg shadow-xl object-cover"
                      style={{
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">
               Automatização real funcionando 24/7 no WhatsApp
            </p>
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

      {/* Carrossel de Planos e Preços */}
      <section id="planos-section" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#121212] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Planos e Preços
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Escolha o plano ideal para o seu negócio e comece hoje mesmo
            </p>
          </motion.div>

          {/* Carrossel de Planos */}
          <div className="relative px-2 py-4">
            {/* Indicadores de Scroll */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-gradient-to-r from-[#121212]/80 to-transparent flex items-center justify-start pointer-events-none">
          <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white text-2xl"
              >
                ←
              </motion.div>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-gradient-to-l from-[#121212]/80 to-transparent flex items-center justify-end pointer-events-none">
              <motion.div
                animate={{ x: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white text-2xl"
              >
                →
              </motion.div>
            </div>

            <motion.div
              className="flex gap-8 overflow-x-auto pb-4 pt-2 px-2 pricing-carousel snap-x snap-mandatory"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 #1F2937',
                msOverflowStyle: 'auto',
                cursor: 'grab'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.cursor = 'grabbing';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.cursor = 'grab';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.cursor = 'grab';
              }}
            >
                {[
                  {
                    name: 'Grátis',
                    old: null,
                    current: '0',
                  oldUSD: null,
                  currentUSD: '0',
                    badge: 'Plano Gratuito',
                  features: [
                    '50 créditos de IA/mês', 
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios'
                  ],
                    link: 'https://assistente.amsync.online',
                  external: true,
                  color: 'from-green-500 to-emerald-600'
                  },
                  {
                    name: 'Inicial',
                    old: '399',
                    current: '199',
                  oldUSD: '6.29',
                  currentUSD: '3.13',
                  amount: 199,
                  description: 'Plano Inicial - 500 créditos de IA/mês',
                    badge: null,
                  features: [
                    '500 créditos de IA/mês',
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios',
                    'Gerenciamento avançado',
                    'Suporte por email'
                  ],
                  color: 'from-gray-600 to-gray-700'
                  },
                  {
                    name: 'Essencial',
                    old: '999',
                    current: '499',
                  oldUSD: '15.73',
                  currentUSD: '7.86',
                  amount: 499,
                  description: 'Plano Essencial - 1.200 créditos de IA/mês',
                    badge: 'Mais Popular',
                  features: [
                    '1.200 créditos de IA/mês',
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios',
                    'Gerenciamento avançado',
                    'Suporte por email',
                    'Até 3 bots',
                    'Agendamento de mensagens para grupos'
                  ],
                  color: 'from-yellow-500 to-orange-500'
                  },
                  {
                    name: 'Crescimento',
                    old: '2.000',
                    current: '1.000',
                  oldUSD: '31.50',
                  currentUSD: '15.75',
                  amount: 1000,
                  description: 'Plano Crescimento - 2.500 créditos de IA/mês',
                    badge: null,
                  features: [
                    '2.500 créditos de IA/mês',
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios',
                    'Gerenciamento avançado',
                    'Suporte por email',
                    'Até 3 bots',
                    'Agendamento de mensagens para grupos',
                    'Follow-up automático',
                    'Remarketing',
                    'Suporte prioritário'
                  ],
                  color: 'from-purple-500 to-pink-500'
                  },
                  {
                    name: 'Profissional',
                    old: '3.600',
                    current: '1.800',
                  oldUSD: '56.69',
                  currentUSD: '28.35',
                  amount: 1800,
                  description: 'Plano Profissional - 10.000 créditos de IA/mês',
                    badge: null,
                  features: [
                    '10.000 créditos de IA/mês',
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios',
                    'Gerenciamento avançado',
                    'Suporte por email',
                    'Até 3 bots',
                    'Agendamento de mensagens para grupos',
                    'Follow-up automático',
                    'Remarketing',
                    'Suporte prioritário',
                    'Gerenciamento de grupos',
                    'Agendamento de Status',
                    'Envio de catálogos',
                    'API completa'
                  ],
                  color: 'from-indigo-500 to-blue-500'
                  },
                  {
                    name: 'Ilimitado',
                    old: '4.950',
                    current: '2.475',
                  oldUSD: '77.95',
                  currentUSD: '38.98',
                  amount: 2475,
                  description: 'Plano Ilimitado - Créditos de IA ilimitados',
                    badge: null,
                  features: [
                    'Créditos de IA ilimitados',
                    'Gerenciamento de bloqueios',
                    'Envio de fotos',
                    'Envio de vídeos',
                    'Envio de áudios',
                    'Gerenciamento avançado',
                    'Até 3 bots',
                    'Agendamento de mensagens para grupos',
                    'Follow-up automático',
                    'Remarketing',
                    'Suporte prioritário',
                    'Gerenciamento de grupos',
                    'Agendamento de Status',
                    'Envio de catálogos',
                    'API completa',
                    'Registro automático de compras',
                    'Ranking de clientes (gamificação)',
                    'Histórico completo de transações',
                    'Relatórios de vendas diárias/mensais',
                    'Sistema anti-fraude',
                    'Controle de concorrência',
                    'Suporte dedicado no WhatsApp'
                  ],
                  color: 'from-red-500 to-pink-600'
                  }
                ].map((plan, idx) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
                  className={`snap-start min-w-[280px] sm:min-w-[320px] md:min-w-[350px] bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border-2 ${
                    plan.badge ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-gray-200'
                  } transition-all duration-500 flex-shrink-0 flex flex-col ${
                    idx === 0 ? 'relative ml-2' : ''
                  }`}
                  style={{
                    marginRight: idx === 5 ? '8px' : '0',
                    height: plan.name === 'Grátis' ? '450px' : 
                            plan.name === 'Inicial' ? '450px' :
                            plan.name === 'Essencial' ? '550px' :
                            plan.name === 'Crescimento' ? '650px' :
                            plan.name === 'Profissional' ? '750px' :
                            'auto',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Indicador de mais planos no primeiro card */}
                  {idx === 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg z-10"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        +5 mais →
                      </motion.div>
                    </motion.div>
                  )}
                    {plan.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-4 inline-flex items-center px-4 py-2 text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg"
                    >
                      ⭐ {plan.badge}
                    </motion.div>
                  )}
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    
                    {plan.old && plan.current ? (
                      <div className="mb-4">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="text-sm text-green-600 font-semibold mb-2"
                        >
                          💰 Economia de 50%
                        </motion.div>
                        <div className="mb-1 text-gray-400 line-through text-lg">${plan.oldUSD} /mês</div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-3xl sm:text-4xl font-extrabold text-gray-900"
                        >
                          ${plan.currentUSD} <span className="text-base sm:text-lg font-medium">/mês</span>
                        </motion.div>
                        <div className="text-xs text-gray-500 mt-1">
                          💳 Pagamento em Metical (MT)
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4"
                      >
                        $0 <span className="text-base sm:text-lg font-medium">/mês</span>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.ul
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow overflow-y-auto"
                    style={{
                      maxHeight: plan.name === 'Grátis' ? '200px' : 
                                 plan.name === 'Inicial' ? '200px' :
                                 plan.name === 'Essencial' ? '250px' :
                                 plan.name === 'Crescimento' ? '300px' :
                                 plan.name === 'Profissional' ? '350px' :
                                 '400px'
                    }}
                  >
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                        className="flex items-start text-gray-700"
                      >
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm leading-tight">{feature}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-auto flex-shrink-0"
                    style={{ minHeight: '60px' }}
                  >
                      {plan.link ? (
                      <motion.a
                          href={plan.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className={`bg-gradient-to-r ${plan.color} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl w-full inline-block text-center shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base`}
                          onClick={() => metaPixelService.trackCTAClick(`Quero este plano - ${plan.name}`, 'Pricing Section')}
                        >
                        🚀 Quero este plano
                      </motion.a>
                    ) : (
                      <motion.button
                        onClick={() => handlePaymentClick(plan)}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                        className={`w-full bg-gradient-to-r ${plan.color} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base`}
                        >
                          Quero este plano
                      </motion.button>
                      )}
                  </motion.div>
                </motion.div>
                ))}
          </motion.div>
          </div>
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
              to="https://assistente.amsync.online" 
              variant="gradient" 
              size="xl"
              className="text-lg px-8 py-3"
              onClick={() => metaPixelService.trackCTAClick('Quero começar grátis', 'Final CTA')}
            >
              Quero começar grátis
            </BotaoCTA>
          </motion.div>
        </div>
      </section>

      {/* Modal de Pagamento Móvel */}
      <MobilePaymentModal
        isOpen={paymentModal.isOpen}
        onClose={closePaymentModal}
        plan={paymentModal.plan}
        user={currentUser}
      />
    </div>
  );
};

export default Home;

