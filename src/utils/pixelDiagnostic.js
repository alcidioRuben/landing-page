/**
 * Utilitário para diagnosticar problemas com o Meta Pixel em produção
 */

export const pixelDiagnostic = {
  /**
   * Executa diagnóstico completo do Meta Pixel
   */
  runDiagnostic() {
    console.log('🔍 === DIAGNÓSTICO META PIXEL ===');
    console.log('📍 Domínio:', window.location.hostname);
    console.log('🔗 URL completa:', window.location.href);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Verificar se fbq existe
    if (typeof window.fbq === 'undefined') {
      console.error('❌ fbq não está definido');
      this.checkPixelLoading();
      return false;
    }
    
    console.log('✅ fbq está disponível');
    
    // Verificar estado do pixel
    try {
      const pixelState = window.fbq.getState();
      console.log('📊 Estado do pixel:', pixelState);
      
      if (pixelState.pixelId) {
        console.log('✅ Pixel ID encontrado:', pixelState.pixelId);
      } else {
        console.error('❌ Pixel ID não encontrado');
      }
      
      if (pixelState.queue && pixelState.queue.length > 0) {
        console.log('📋 Eventos na fila:', pixelState.queue.length);
      }
      
    } catch (error) {
      console.error('❌ Erro ao verificar estado do pixel:', error);
    }
    
    // Verificar se o script foi carregado
    this.checkPixelScript();
    
    // Verificar domínio
    this.checkDomain();
    
    // Testar evento simples
    this.testBasicEvent();
    
    return true;
  },
  
  /**
   * Verifica se o script do pixel está carregado
   */
  checkPixelScript() {
    const scripts = document.querySelectorAll('script');
    let pixelScriptFound = false;
    
    scripts.forEach(script => {
      if (script.src && script.src.includes('fbevents.js')) {
        console.log('✅ Script fbevents.js encontrado:', script.src);
        pixelScriptFound = true;
      }
    });
    
    if (!pixelScriptFound) {
      console.error('❌ Script fbevents.js não encontrado');
    }
  },
  
  /**
   * Verifica se o domínio está correto
   */
  checkDomain() {
    const allowedDomains = [
      'localhost',
      'lacasadigital',
      'amsync',
      'vercel.app',
      'netlify.app'
    ];
    
    const currentDomain = window.location.hostname;
    const isAllowed = allowedDomains.some(domain => currentDomain.includes(domain));
    
    if (isAllowed) {
      console.log('✅ Domínio autorizado:', currentDomain);
    } else {
      console.warn('⚠️ Domínio não reconhecido:', currentDomain);
      console.log('💡 Domínios permitidos:', allowedDomains);
    }
  },
  
  /**
   * Testa um evento básico
   */
  testBasicEvent() {
    try {
      window.fbq('track', 'PageView', {
        test: true,
        diagnostic: true,
        domain: window.location.hostname
      });
      console.log('✅ Teste de evento básico executado');
    } catch (error) {
      console.error('❌ Erro no teste de evento:', error);
    }
  },
  
  /**
   * Verifica se o pixel está carregando
   */
  checkPixelLoading() {
    // Verificar se há elementos noscript
    const noscriptElements = document.querySelectorAll('noscript');
    let pixelNoscriptFound = false;
    
    noscriptElements.forEach(noscript => {
      if (noscript.innerHTML.includes('facebook.com/tr')) {
        console.log('✅ Elemento noscript do pixel encontrado');
        pixelNoscriptFound = true;
      }
    });
    
    if (!pixelNoscriptFound) {
      console.error('❌ Elemento noscript do pixel não encontrado');
    }
    
    // Verificar se há script inline
    const inlineScripts = document.querySelectorAll('script:not([src])');
    let pixelInlineFound = false;
    
    inlineScripts.forEach(script => {
      if (script.textContent.includes('fbq')) {
        console.log('✅ Script inline do pixel encontrado');
        pixelInlineFound = true;
      }
    });
    
    if (!pixelInlineFound) {
      console.error('❌ Script inline do pixel não encontrado');
    }
  },
  
  /**
   * Monitora eventos do pixel
   */
  startMonitoring() {
    console.log('👁️ Iniciando monitoramento do pixel...');
    
    // Interceptar chamadas do fbq
    if (window.fbq) {
      const originalTrack = window.fbq.track;
      const originalTrackCustom = window.fbq.trackCustom;
      
      window.fbq.track = function(...args) {
        console.log('📤 Evento track enviado:', args);
        return originalTrack.apply(this, args);
      };
      
      window.fbq.trackCustom = function(...args) {
        console.log('📤 Evento trackCustom enviado:', args);
        return originalTrackCustom.apply(this, args);
      };
    }
  }
};

// Auto-executar diagnóstico em produção
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      pixelDiagnostic.runDiagnostic();
      pixelDiagnostic.startMonitoring();
    }, 3000);
  });
}
