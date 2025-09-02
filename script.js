// Performance optimization: Use requestAnimationFrame for smooth animations
let ticking = false;

// DOM Elements - Cache them for better performance
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Smooth scroll to section function with performance optimization
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header.offsetHeight;
        const offsetPosition = section.offsetTop - headerHeight - 20;
        
        // Use requestAnimationFrame for smooth scrolling
        const startPosition = window.pageYOffset;
        const distance = offsetPosition - startPosition;
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        requestAnimationFrame(animation);
        
        // Facebook Pixel - Seção visualizada
        if (typeof fbq !== 'undefined') {
            if (sectionId === 'planos') {
                fbq('track', 'ViewContent', {
                    content_name: 'Planos e Preços',
                    content_category: 'Planos'
                });
            }
        }
    }
}

// Easing function for smooth scrolling
function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
}

// Optimized header scroll effect using requestAnimationFrame
function updateHeader() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    ticking = false;
}

function requestHeaderUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

// Header scroll effect with throttling
window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

// Mobile menu toggle with improved performance
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger with better performance
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// Optimized smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            // Use smooth scrolling with requestAnimationFrame
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 800;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Optimized Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Facebook Pixel - Seção de vídeo visualizada
            if (entry.target.id === 'demonstracao' && typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: 'Video Tutorial',
                    content_category: 'Tutorial'
                });
            }
            
            // Facebook Pixel - Seção de planos visualizada
            if (entry.target.id === 'planos' && typeof fbq !== 'undefined') {
                fbq('track', 'ViewContent', {
                    content_name: 'Planos e Preços',
                    content_category: 'Planos'
                });
            }
        }
    });
}, observerOptions);

// Observe elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(el => observer.observe(el));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Counter animation for planos
function animateCounters() {
    const counters = document.querySelectorAll('.valor');
    
    counters.forEach(counter => {
        // Armazenar o valor original
        const originalText = counter.textContent;
        
        // Limpar pontos e vírgulas para converter em número
        const target = parseFloat(originalText.replace(/\./g, '').replace(',', '.'));
        
        // Se não conseguir converter, pular este counter
        if (isNaN(target)) return;
        
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                const currentValue = Math.ceil(current);
                
                // Formatar o número com pontos se necessário
                if (currentValue >= 1000) {
                    counter.textContent = currentValue.toLocaleString('pt-BR');
                } else {
                    counter.textContent = currentValue;
                }
                
                setTimeout(updateCounter, 20);
            } else {
                // Restaurar o valor original formatado
                counter.textContent = originalText;
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when planos section is visible
const planosSection = document.querySelector('#planos');
if (planosSection) {
    const planosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                planosObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    planosObserver.observe(planosSection);
}

// Floating animation for phone mockup
function addFloatingAnimation() {
    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        phoneMockup.style.animation = 'floating 6s ease-in-out infinite';
    }
}

// Add floating keyframes to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes floating {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .floating {
        animation: floating 6s ease-in-out infinite;
    }
    
    .pulse {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .slide-in {
        animation: slideInFromBottom 0.8s ease-out;
    }
`;

document.head.appendChild(style);

// Initialize floating animation
document.addEventListener('DOMContentLoaded', addFloatingAnimation);

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.diferencial-card, .plano-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Button click effects
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cta-button, .plano-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button, .plano-cta {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

document.head.appendChild(rippleStyle);

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #1E3A8A, #10B981);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', createScrollProgress);

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add slide-in animation to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('slide-in');
        }, index * 200);
    });
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    section.slide-in {
        opacity: 1;
        transform: translateY(0);
    }
`;

document.head.appendChild(loadingStyle);

// Smooth reveal animation for pricing cards
function revealPricingCards() {
    const cards = document.querySelectorAll('.plano-card');
    
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Trigger pricing reveal when section is visible
const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            revealPricingCards();
            pricingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (planosSection) {
    pricingObserver.observe(planosSection);
}

// Add floating particles background effect
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(30, 58, 138, 0.1);
            border-radius: 50%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

// Add particle animation styles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;

document.head.appendChild(particleStyle);

// Initialize particles
document.addEventListener('DOMContentLoaded', createParticles);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll event handlers
}, 16)); // 60fps

// FAQ Interativo
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Abrir/fechar o item clicado
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

// Animação dos números das estatísticas
function animateStatistics() {
    const statistics = document.querySelectorAll('.estatistica-numero');
    
    statistics.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateStat = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateStat, 20);
            } else {
                stat.textContent = target;
            }
        };
        
        updateStat();
    });
}

// Trigger das estatísticas quando a seção estiver visível
const statisticsSection = document.querySelector('#casos-sucesso');
if (statisticsSection) {
    const statisticsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatistics();
                statisticsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statisticsObserver.observe(statisticsSection);
}

// Formulário de Lead
document.addEventListener('DOMContentLoaded', () => {
    const leadForm = document.querySelector('.lead-form');
    
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = leadForm.querySelector('input[type="email"]').value;
            
            // Simular envio
            const button = leadForm.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-check"></i> Email cadastrado!';
            button.style.background = '#10B981';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                leadForm.reset();
            }, 3000);
            
            console.log('Email cadastrado:', email);
        });
    }
});

// Sistema de Pagamentos Integrado
let selectedPlan = null;
let selectedAmount = 0;
let selectedPlanName = '';

// Função para abrir modal de pagamento
function openPaymentModal(planId, amount, planName) {
    selectedPlan = planId;
    selectedAmount = amount;
    selectedPlanName = planName;

    // Atualizar informações do modal
    document.getElementById('modalPlanName').textContent = planName;
    document.getElementById('modalSelectedPlanName').textContent = planName;
    document.getElementById('modalSelectedPlanAmount').textContent = amount;

    // Mostrar modal
    document.getElementById('paymentModal').style.display = 'block';
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Facebook Pixel - Modal de pagamento aberto
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_name: planName,
            content_category: 'Plano',
            value: amount,
            currency: 'MZN'
        });
    }
}

// Função para fechar modal de pagamento
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closePaymentModal();
    }
}

// Event listener para envio do formulário de pagamento
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentFormElement');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!selectedPlan) {
                alert('Por favor, selecione um plano primeiro');
                return;
            }

            const formData = new FormData(e.target);
            
            try {
                // Validar formulário
                validatePaymentForm(formData);
                
                // Desabilitar botão
                const submitBtn = e.target.querySelector('.payment-submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                // Format dados
                const paymentData = formatPaymentData(formData);
                
                // Processar pagamento
                await processPayment(paymentData);
                
            } catch (error) {
                alert(error.message);
            } finally {
                // Reabilitar botão
                const submitBtn = e.target.querySelector('.payment-submit-btn');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar Agora';
            }
        });
    }
});

// Função para validar formulário de pagamento
function validatePaymentForm(formData) {
    const requiredFields = ['useremail', 'userwhatsApp', 'phone', 'method'];
    
    for (const field of requiredFields) {
        if (!formData.get(field) || formData.get(field).trim() === '') {
            throw new Error(`Campo ${field} é obrigatório`);
        }
    }

    // Validar email
    const email = formData.get('useremail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
    }

    // Validar números de telefone
    const phoneRegex = /^\d{9,12}$/;
    const whatsApp = formData.get('userwhatsApp').replace(/\D/g, '');
    const phone = formData.get('phone').replace(/\D/g, '');
    
    if (!phoneRegex.test(whatsApp)) {
        throw new Error('WhatsApp deve ter 9-12 dígitos');
    }
    
    if (!phoneRegex.test(phone)) {
        throw new Error('Número Mpesa/Emola deve ter 9-12 dígitos');
    }

    return true;
}

// Função para formatar dados do pagamento
function formatPaymentData(formData) {
    return {
        method: formData.get('method'),
        amount: selectedAmount,
        context: formData.get('context') || `Pagamento do ${selectedPlanName}`,
        useremail: formData.get('useremail'),
        userwhatsApp: formData.get('userwhatsApp').replace(/\D/g, ''),
        phone: formData.get('phone').replace(/\D/g, ''),
        planName: selectedPlanName,
        planId: selectedPlan
    };
}

// Função para processar pagamento
async function processPayment(paymentData) {
    try {
        showPaymentStatus('Processando Pagamento...', 'Aguarde enquanto processamos sua transação...', 'loading');

        const response = await fetch('/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });

        const result = await response.json();

        if (result.success) {
            // Facebook Pixel - Pagamento criado com sucesso
            if (typeof fbq !== 'undefined') {
                fbq('track', 'InitiateCheckout', {
                    content_name: selectedPlanName,
                    content_category: 'Plano',
                    value: selectedAmount,
                    currency: 'MZN'
                });
            }
            
            showPaymentStatus(
                'Pagamento Criado com Sucesso!', 
                'Sua transação foi processada. Aguarde a confirmação do pagamento.',
                'success'
            );
            
            showPaymentDetails(result.payment);
            
            // Fechar modal
            closePaymentModal();
            
            // Iniciar verificação de status
            startStatusCheck(result.paymentId);
            
        } else {
            throw new Error(result.error || 'Erro ao processar pagamento');
        }

    } catch (error) {
        console.error('Erro no pagamento:', error);
        showPaymentStatus(
            'Erro no Pagamento', 
            error.message || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.',
            'error'
        );
    }
}

// Função para mostrar status do pagamento
function showPaymentStatus(title, message, type = 'loading') {
    const statusModal = document.getElementById('paymentStatus');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const statusIcon = document.querySelector('.status-icon i');

    statusTitle.textContent = title;
    statusMessage.textContent = message;

    // Atualizar ícone baseado no tipo
    statusIcon.className = '';
    if (type === 'success') {
        statusIcon.className = 'fas fa-check-circle success';
    } else if (type === 'error') {
        statusIcon.className = 'fas fa-times-circle error';
    } else {
        statusIcon.className = 'fas fa-spinner fa-spin';
    }

    statusModal.style.display = 'flex';
}

// Função para mostrar detalhes do pagamento
function showPaymentDetails(payment) {
    const paymentDetails = document.getElementById('paymentDetails');
    
    paymentDetails.innerHTML = `
        <h4>Detalhes da Transação</h4>
        <p><strong>ID:</strong> ${payment.id}</p>
        <p><strong>Plano:</strong> ${payment.planName}</p>
        <p><strong>Valor:</strong> ${payment.amount} MT</p>
        <p><strong>Método:</strong> ${payment.method.toUpperCase()}</p>
        <p><strong>Status:</strong> <span class="status-${payment.status}">${payment.status}</span></p>
        <p><strong>Data:</strong> ${new Date(payment.createdAt).toLocaleString('pt-BR')}</p>
    `;
}

// Função para verificar status do pagamento
async function checkPaymentStatus(paymentId) {
    try {
        const response = await fetch(`/api/payment/status/${paymentId}`);
        const result = await response.json();

        if (result.success) {
            const payment = result.payment;
            
            if (payment.status === 'completed') {
                // Facebook Pixel - Pagamento confirmado
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'Purchase', {
                        content_name: selectedPlanName,
                        content_category: 'Plano',
                        value: selectedAmount,
                        currency: 'MZN'
                    });
                }
                
                showPaymentStatus(
                    'Pagamento Confirmado!', 
                    'Seu pagamento foi confirmado com sucesso! Você receberá um email com as instruções de acesso.',
                    'success'
                );
                showPaymentDetails(payment);
                return true;
            } else if (payment.status === 'failed') {
                showPaymentStatus(
                    'Pagamento Falhou', 
                    'Infelizmente seu pagamento não foi confirmado. Entre em contato conosco para mais informações.',
                    'error'
                );
                showPaymentDetails(payment);
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        return false;
    }
}

// Função para iniciar verificação de status
function startStatusCheck(paymentId) {
    const checkInterval = setInterval(async () => {
        const isCompleted = await checkPaymentStatus(paymentId);
        
        if (isCompleted) {
            clearInterval(checkInterval);
        }
    }, 5000); // Verificar a cada 5 segundos

    // Parar verificação após 5 minutos
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 300000);
}

// Função para formatar números de telefone
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('258')) {
            value = value.substring(3);
        }
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + ' ' + value.substring(2);
        }
        
        if (value.length >= 6) {
            value = value.substring(0, 6) + ' ' + value.substring(6);
        }
        
        if (value.length >= 10) {
            value = value.substring(0, 10) + ' ' + value.substring(10);
        }
    }
    
    input.value = value;
}

// Aplicar formatação aos campos de telefone
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});

console.log('AMSync Ads - Landing Page carregada com sucesso! 🚀');

// WhatsApp Flutuante Super Dinâmico
document.addEventListener('DOMContentLoaded', () => {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        // Efeito de entrada espetacular
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            whatsappFloat.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.transform = 'scale(1) rotate(0deg)';
        }, 2000);

        // Efeito de atenção quando a página fica inativa
        let isPageActive = true;
        let attentionInterval;

        const startAttentionMode = () => {
            if (!isPageActive) {
                attentionInterval = setInterval(() => {
                    whatsappFloat.style.animation = 'whatsappBounce 0.8s ease-in-out';
                    setTimeout(() => {
                        whatsappFloat.style.animation = 'whatsappPulse 2s ease-in-out infinite';
                    }, 800);
                }, 5000);
            }
        };

        const stopAttentionMode = () => {
            clearInterval(attentionInterval);
            whatsappFloat.style.animation = 'whatsappPulse 2s ease-in-out infinite';
        };

        // Detectar quando a página perde o foco
        document.addEventListener('visibilitychange', () => {
            isPageActive = !document.hidden;
            if (isPageActive) {
                stopAttentionMode();
            } else {
                startAttentionMode();
            }
        });

        // Efeito de mouse tracking
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Efeito de perseguição sutil
        setInterval(() => {
            if (whatsappFloat && !whatsappFloat.matches(':hover')) {
                const rect = whatsappFloat.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (mouseX - centerX) * 0.01;
                const deltaY = (mouseY - centerY) * 0.01;
                
                whatsappFloat.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1)`;
            }
        }, 100);

        // Efeito de clique espetacular
        whatsappFloat.addEventListener('click', function(e) {
            // Criar explosão de partículas
            createParticleExplosion(this, e);
            
            // Efeito de onda
            createRippleWave(this);
            
            // Efeito de flash
            this.style.filter = 'brightness(2) saturate(2)';
            setTimeout(() => {
                this.style.filter = 'none';
            }, 300);
        });

        // Efeito de hover avançado
        whatsappFloat.addEventListener('mouseenter', function() {
            this.style.animation = 'whatsappBounce 0.6s ease-in-out';
            
            // Adicionar partículas extras
            addExtraParticles(this);
            
            // Efeito de magnetismo
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });

        whatsappFloat.addEventListener('mouseleave', function() {
            this.style.animation = 'whatsappPulse 2s ease-in-out infinite';
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });

        // Efeito de scroll tracking
        let lastScrollY = window.scrollY;
        let scrollDirection = 'down';

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;

            // Efeito de movimento baseado no scroll
            if (scrollDirection === 'down') {
                whatsappFloat.style.transform = 'translateY(-5px) scale(1.05)';
            } else {
                whatsappFloat.style.transform = 'translateY(5px) scale(0.95)';
            }

            setTimeout(() => {
                whatsappFloat.style.transform = 'scale(1)';
            }, 200);
        });
    }
});

// Função para criar explosão de partículas
function createParticleExplosion(element, event) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #25D366, #128C7E);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
            animation: particleExplosion 1s ease-out forwards;
        `;

        const angle = (i / 15) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const finalX = Math.cos(angle) * velocity;
        const finalY = Math.sin(angle) * velocity;

        particle.style.setProperty('--final-x', finalX + 'px');
        particle.style.setProperty('--final-y', finalY + 'px');

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// Função para criar onda de ripple
function createRippleWave(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid #25D366;
        border-radius: 50%;
        animation: rippleWave 0.8s ease-out;
        pointer-events: none;
    `;

    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Função para adicionar partículas extras
function addExtraParticles(element) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: #25D366;
            border-radius: 50%;
            animation: extraParticleFloat 2s ease-in-out infinite;
            pointer-events: none;
        `;

        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';

        element.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

// Adicionar estilos CSS dinâmicos para as novas animações
const whatsappDynamicStyles = document.createElement('style');
whatsappDynamicStyles.textContent = `
    @keyframes particleExplosion {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(var(--final-x), var(--final-y)) scale(0);
            opacity: 0;
        }
    }

    @keyframes rippleWave {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }

    @keyframes extraParticleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        25% {
            opacity: 1;
        }
        50% {
            transform: translateY(-15px) translateX(8px);
            opacity: 0.8;
        }
        75% {
            transform: translateY(-8px) translateX(-4px);
            opacity: 0.6;
        }
    }

    .whatsapp-float:hover {
        filter: drop-shadow(0 0 20px rgba(37, 211, 102, 0.8));
    }
`;

document.head.appendChild(whatsappDynamicStyles);
