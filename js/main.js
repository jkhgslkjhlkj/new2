/**
 * Overwatch 2 - Основной JavaScript файл
 * Содержит функционал для управления интерфейсом сайта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Загрузочная анимация
    const loadingBar = document.createElement('div');
    loadingBar.className = 'loading-bar';
    document.body.appendChild(loadingBar);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingBar.style.opacity = '0';
            setTimeout(() => {
                loadingBar.remove();
            }, 300);
        }, 2000);
    });
    
    // Управление навигационным меню
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Добавляем класс к навбару при скролле
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Закрываем мобильное меню если оно открыто
            if (menuToggle && menuToggle.classList.contains('active')) {
                menuToggle.click();
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeElements() {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }
    
    if (fadeElements.length > 0) {
        window.addEventListener('scroll', checkFadeElements);
        checkFadeElements(); // Проверяем при загрузке
    }
    
    // Фильтрация героев
    const filterButtons = document.querySelectorAll('.filter-btn');
    const heroCards = document.querySelectorAll('.hero-card');
    
    if (filterButtons.length > 0 && heroCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Убираем активный класс со всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс на текущую кнопку
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Показываем/скрываем карточки героев в зависимости от фильтра
                heroCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Слайдер для событий
    const eventDots = document.querySelectorAll('.dot');
    const eventSlides = document.querySelectorAll('.event-slide');
    
    if (eventDots.length > 0 && eventSlides.length > 0) {
        eventDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Убираем активный класс со всех точек
                eventDots.forEach(d => d.classList.remove('active'));
                
                // Добавляем активный класс на текущую точку
                this.classList.add('active');
                
                // Скрываем все слайды
                eventSlides.forEach(slide => {
                    slide.style.opacity = '0';
                    setTimeout(() => {
                        slide.style.display = 'none';
                    }, 300);
                });
                
                // Показываем выбранный слайд
                if (eventSlides[index]) {
                    eventSlides[index].style.display = 'flex';
                    setTimeout(() => {
                        eventSlides[index].style.opacity = '1';
                    }, 50);
                }
            });
        });
    }
    
    // Валидация формы контактов
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Проверяем валидность
            let isValid = true;
            
            if (name === '') {
                showError('name', 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                clearError('name');
            }
            
            if (email === '') {
                showError('email', 'Пожалуйста, введите ваш email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError('email');
            }
            
            if (message === '') {
                showError('message', 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else {
                clearError('message');
            }
            
            if (isValid) {
                // Имитация отправки формы
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.textContent = 'Отправка...';
                
                setTimeout(() => {
                    showSuccess('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
                    contactForm.reset();
                    
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }, 1500);
            }
        });
    }
    
    // Вспомогательные функции для валидации формы
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!field.parentElement.querySelector('.error-message')) {
            field.parentElement.appendChild(errorElement);
        }
        
        field.classList.add('error');
    }
    
    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    function showSuccess(message) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        
        contactForm.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 3000);
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
}); 