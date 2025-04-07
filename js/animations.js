/**
 * TechFuture - GSAP анимации
 * Создает анимации для различных элементов сайта с использованием GSAP
 */

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие GSAP
    if (typeof gsap === 'undefined') {
        console.warn('GSAP не загружен. Анимации не будут работать корректно.');
        return;
    }

    // Регистрируем плагин ScrollTrigger если он доступен
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Анимация для хедера при скролле
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Анимация для гамбургер-меню
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainMenu.classList.toggle('active');
        });
    }

    // Функция для анимации эффекта глюка
    function initGlitchEffect() {
        const glitchText = document.querySelector('.glitch-text');
        
        if (glitchText) {
            // Устанавливаем data-text аттрибут для псевдоэлементов ::before и ::after
            const text = glitchText.textContent;
            glitchText.setAttribute('data-text', text);
            
            // Анимация с GSAP для глюч-эффекта
            gsap.to(glitchText, {
                skewX: 0.5,
                duration: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                repeatRefresh: true
            });
        }
    }
    
    // Анимация элементов при скролле
    function initScrollAnimations() {
        if (typeof ScrollTrigger === 'undefined') return;
        
        // Анимация для секций
        const sections = document.querySelectorAll('.services-preview, .about-preview, .showcase, .contact-preview');
        
        sections.forEach(section => {
            // Добавляем класс для анимации при скролле
            const fadeElements = section.querySelectorAll('h2, .section-header p');
            fadeElements.forEach(el => el.classList.add('fade-in'));
            
            // Настраиваем ScrollTrigger для секции
            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                onEnter: () => {
                    gsap.utils.toArray(section.querySelectorAll('.fade-in')).forEach((elem, i) => {
                        gsap.to(elem, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "power2.out"
                        });
                    });
                }
            });
        });
        
        // Анимация для карточек услуг
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, i) => {
            card.classList.add('fade-in');
            ScrollTrigger.create({
                trigger: card,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "back.out(1.2)"
                    });
                }
            });
        });
        
        // Анимация для статистики
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, i) => {
            card.classList.add('fade-in');
            
            // Анимация числа при скролле
            const statNumber = card.querySelector('.stat-number');
            if (statNumber) {
                const targetNumber = parseInt(statNumber.textContent);
                statNumber.textContent = '0';
                
                ScrollTrigger.create({
                    trigger: card,
                    start: "top 85%",
                    onEnter: () => {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "power2.out"
                        });
                        
                        gsap.to(statNumber, {
                            duration: 2,
                            innerText: targetNumber,
                            snap: { innerText: 1 },
                            ease: "power2.out"
                        });
                    }
                });
            }
        });
        
        // Анимация для проектов
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, i) => {
            card.classList.add('fade-in');
            ScrollTrigger.create({
                trigger: card,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "back.out(1.2)"
                    });
                }
            });
        });
    }
    
    // Анимация вращения для 3D эффектов при наведении (Tilt.js эффект)
    function initTiltEffect() {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        
        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
    
    // Инициализация анимаций текста на главной странице
    function initTextAnimations() {
        // Анимация появления для hero-секции
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            gsap.from(heroContent.querySelector('h1'), {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.2,
                ease: "power2.out"
            });
            
            gsap.from(heroContent.querySelector('.subtitle'), {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.4,
                ease: "power2.out"
            });
            
            gsap.from(heroContent.querySelectorAll('.btn'), {
                opacity: 0,
                y: 20,
                duration: 1,
                delay: 0.6,
                stagger: 0.2,
                ease: "power2.out"
            });
        }
    }
    
    // Эффект неоновой пульсации
    function initNeonPulse() {
        const neonElements = document.querySelectorAll('.logo-text .accent, .link-arrow, .btn-primary, .btn-secondary');
        
        neonElements.forEach(element => {
            element.classList.add('neon-pulse');
        });
    }
    
    // Инициализация валидации формы
    function initFormValidation() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Простая валидация
                let isValid = true;
                const inputs = contactForm.querySelectorAll('input, textarea');
                
                inputs.forEach(input => {
                    if (!input.validity.valid) {
                        isValid = false;
                        input.classList.add('invalid');
                    } else {
                        input.classList.remove('invalid');
                    }
                });
                
                if (isValid) {
                    // Анимация успешной отправки
                    gsap.to(contactForm, {
                        opacity: 0.5,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                    
                    // В реальном проекте здесь должна быть отправка формы на сервер
                    setTimeout(() => {
                        contactForm.reset();
                        const successMessage = document.createElement('div');
                        successMessage.classList.add('success-message');
                        successMessage.textContent = 'Сообщение успешно отправлено!';
                        
                        contactForm.parentNode.appendChild(successMessage);
                        
                        gsap.from(successMessage, {
                            opacity: 0,
                            y: 20,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                        
                        gsap.to(contactForm, {
                            opacity: 1,
                            duration: 0.5,
                            delay: 1,
                            ease: "power2.out"
                        });
                        
                        setTimeout(() => {
                            successMessage.remove();
                        }, 3000);
                    }, 1000);
                }
            });
            
            // Убираем класс invalid при вводе
            contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    if (input.classList.contains('invalid')) {
                        input.classList.remove('invalid');
                    }
                });
            });
        }
    }
    
    // Запуск всех анимаций
    initGlitchEffect();
    initScrollAnimations();
    initTiltEffect();
    initTextAnimations();
    initNeonPulse();
    initFormValidation();
}); 