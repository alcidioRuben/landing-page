/**
 * Serviço para gerenciar eventos do Meta Pixel (Facebook Pixel)
 * Permite rastrear ações específicas dos usuários para otimização de campanhas
 */

class MetaPixelService {
  constructor() {
    this.isInitialized = false;
    this.pixelId = '2096237854232667';
    this.init();
  }

  /**
   * Inicializa o Meta Pixel
   */
  init() {
    if (typeof window !== 'undefined' && window.fbq) {
      this.isInitialized = true;
      console.log('✅ Meta Pixel inicializado com sucesso');
      console.log('📍 Domínio atual:', window.location.hostname);
      console.log('🔗 URL completa:', window.location.href);
      
      // Verificar se é o domínio correto
      if (window.location.hostname.includes('lacasadigital') || 
          window.location.hostname.includes('amsync') ||
          window.location.hostname === 'localhost') {
        console.log('✅ Domínio autorizado detectado');
      } else {
        console.warn('⚠️ Domínio não reconhecido:', window.location.hostname);
      }
    } else {
      console.warn('❌ Meta Pixel não está disponível');
      console.log('🔍 Verificando se fbq existe:', typeof window !== 'undefined' ? typeof window.fbq : 'window não existe');
    }
  }

  /**
   * Verifica se o pixel está disponível
   */
  isAvailable() {
    return this.isInitialized && typeof window !== 'undefined' && window.fbq;
  }

  /**
   * Rastreia eventos personalizados
   * @param {string} eventName - Nome do evento
   * @param {Object} parameters - Parâmetros adicionais do evento
   */
  track(eventName, parameters = {}) {
    if (!this.isAvailable()) {
      console.warn(`❌ Meta Pixel não disponível para evento: ${eventName}`);
      console.log('🔍 Domínio atual:', window.location.hostname);
      console.log('🔍 fbq disponível:', typeof window.fbq);
      return;
    }

    try {
      window.fbq('track', eventName, parameters);
      console.log(`✅ Evento Meta Pixel rastreado: ${eventName}`, parameters);
      console.log('📍 Enviado do domínio:', window.location.hostname);
    } catch (error) {
      console.error(`❌ Erro ao rastrear evento Meta Pixel ${eventName}:`, error);
    }
  }

  /**
   * Rastreia eventos personalizados com ID de conversão
   * @param {string} eventName - Nome do evento
   * @param {Object} parameters - Parâmetros adicionais do evento
   */
  trackCustom(eventName, parameters = {}) {
    if (!this.isAvailable()) {
      console.warn(`Meta Pixel não disponível para evento customizado: ${eventName}`);
      return;
    }

    try {
      window.fbq('trackCustom', eventName, parameters);
      console.log(`Evento customizado Meta Pixel rastreado: ${eventName}`, parameters);
    } catch (error) {
      console.error(`Erro ao rastrear evento customizado Meta Pixel ${eventName}:`, error);
    }
  }

  /**
   * Eventos específicos para o curso de dropshipping
   */

  // Visualização da página inicial
  trackHomePageView() {
    this.track('PageView', {
      content_name: 'Página Inicial - Curso Dropshipping',
      content_category: 'Landing Page',
      content_type: 'course'
    });
  }

  // Interesse no curso
  trackCourseInterest() {
    this.track('ViewContent', {
      content_name: 'Curso Completo de Dropshipping',
      content_category: 'Digital Course',
      content_type: 'course',
      value: 299,
      currency: 'MZN'
    });
  }

  // Clique no botão CTA principal
  trackCTAClick(buttonText, location) {
    this.trackCustom('CTA_Click', {
      button_text: buttonText,
      location: location,
      content_name: 'Curso Dropshipping'
    });
  }

  // Início do processo de login
  trackLoginStart() {
    this.track('InitiateCheckout', {
      content_name: 'Login - Curso Dropshipping',
      content_category: 'Authentication',
      value: 299,
      currency: 'MZN'
    });
  }

  // Login realizado com sucesso
  trackLoginSuccess() {
    this.track('CompleteRegistration', {
      content_name: 'Login Realizado',
      content_category: 'Authentication',
      registration_method: 'email'
    });
  }

  // Início do processo de pagamento
  trackPaymentStart() {
    this.track('InitiateCheckout', {
      content_name: 'Curso Completo de Dropshipping',
      content_category: 'Digital Course',
      content_type: 'course',
      value: 299,
      currency: 'MZN'
    });
  }

  // Início do checkout (método específico para checkout)
  trackInitiateCheckout(value, contentName) {
    this.track('InitiateCheckout', {
      content_name: contentName || 'Checkout - AMSync Ads',
      content_category: 'Digital Service',
      content_type: 'subscription',
      value: value,
      currency: 'MZN'
    });
  }

  // Pagamento concluído
  trackPurchase(transactionId = null) {
    this.track('Purchase', {
      content_name: 'Curso Completo de Dropshipping',
      content_category: 'Digital Course',
      content_type: 'course',
      value: 299,
      currency: 'MZN',
      transaction_id: transactionId || `tx_${Date.now()}`
    });
  }

  // Visualização do vídeo principal
  trackVideoView(videoTitle = 'Vídeo Principal - Curso Dropshipping') {
    this.track('ViewContent', {
      content_name: videoTitle,
      content_category: 'Video',
      content_type: 'course_video'
    });
  }

  // Interação com depoimentos
  trackTestimonialView() {
    this.trackCustom('Testimonial_View', {
      content_name: 'Depoimentos de Alunos',
      content_category: 'Social Proof'
    });
  }

  // Adição de comentário
  trackCommentAdd(rating) {
    this.trackCustom('Comment_Add', {
      content_name: 'Comentário Adicionado',
      content_category: 'User Engagement',
      rating: rating
    });
  }

  // Visualização da página "Sobre"
  trackAboutPageView() {
    this.track('PageView', {
      content_name: 'Página Sobre - LacasaDigital',
      content_category: 'About Page',
      content_type: 'information'
    });
  }

  // Visualização da página "Contato"
  trackContactPageView() {
    this.track('PageView', {
      content_name: 'Página Contato',
      content_category: 'Contact Page',
      content_type: 'information'
    });
  }

  // Visualização da página "Recursos"
  trackResourcesPageView() {
    this.track('PageView', {
      content_name: 'Página Recursos - Dashboard',
      content_category: 'Course Content',
      content_type: 'course_resources'
    });
  }

  // Visualização da página "Dashboard"
  trackDashboardView() {
    this.track('PageView', {
      content_name: 'Dashboard do Aluno',
      content_category: 'Course Dashboard',
      content_type: 'course_access'
    });
  }

  // Clique no WhatsApp
  trackWhatsAppClick() {
    this.trackCustom('WhatsApp_Click', {
      content_name: 'Contato WhatsApp',
      content_category: 'Support',
      contact_method: 'whatsapp'
    });
  }

  // Scroll profundo na página
  trackDeepScroll() {
    this.trackCustom('Deep_Scroll', {
      content_name: 'Scroll Profundo',
      content_category: 'Engagement',
      scroll_depth: '75%'
    });
  }

  // Tempo na página (chamado após 30 segundos)
  trackTimeOnPage() {
    this.trackCustom('Time_On_Page', {
      content_name: 'Tempo na Página',
      content_category: 'Engagement',
      time_spent: '30+ seconds'
    });
  }

  /**
   * Utilitário para rastrear leads qualificados
   */
  trackLead(leadType, leadValue) {
    this.track('Lead', {
      content_name: leadType,
      content_category: 'Lead Generation',
      value: leadValue,
      currency: 'MZN'
    });
  }

  /**
   * Utilitário para rastrear eventos de engajamento
   */
  trackEngagement(action, details = {}) {
    this.trackCustom('User_Engagement', {
      action: action,
      ...details,
      content_name: 'Curso Dropshipping',
      content_category: 'Engagement'
    });
  }
}

// Instância singleton do serviço
const metaPixelService = new MetaPixelService();

export default metaPixelService;
