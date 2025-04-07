/**
 * TechFuture - Основной JavaScript файл
 * Отвечает за загрузку и инициализацию всех компонентов сайта
 */

document.addEventListener('DOMContentLoaded', () => {
    // Управление загрузкой страницы
    const pageLoader = () => {
        const body = document.body;
        
        // Создаем и добавляем прелоадер, если его еще нет
        if (!document.querySelector('.page-loader')) {
            const loader = document.createElement('div');
            loader.classList.add('page-loader');
            
            const spinner = document.createElement('div');
            spinner.classList.add('loader-spinner');
            spinner.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(0, 178, 255, 0.2)" stroke-width="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="rgba(0, 178, 255, 1)" stroke-width="8" fill="none" class="loader-circle" />
                </svg>
            `;
            
            loader.appendChild(spinner);
            body.prepend(loader);
            
            // Блокируем скролл во время загрузки
            body.style.overflow = 'hidden';
        }
        
        // Скрываем прелоадер когда контент загружен
        window.addEventListener('load', () => {
            const loader = document.querySelector('.page-loader');
            
            if (loader) {
                // Плавно скрываем прелоадер
                setTimeout(() => {
                    loader.style.opacity = '0';
                    
                    // Разрешаем скролл
                    body.style.overflow = '';
                    
                    // Удаляем прелоадер из DOM после анимации
                    setTimeout(() => {
                        loader.remove();
                    }, 500);
                }, 500);
            }
        });
    };
    
    // Настройка атрибута data-text для эффекта глюча
    const initGlitchText = () => {
        const glitchElements = document.querySelectorAll('.glitch-text');
        
        glitchElements.forEach(element => {
            const text = element.textContent;
            element.setAttribute('data-text', text);
        });
    };
    
    // Инициализация темного режима
    const initDarkMode = () => {
        // Проверяем предпочтения пользователя
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Проверяем сохраненные настройки
        const savedMode = localStorage.getItem('darkMode');
        
        // Применяем тему
        if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
        }
        
        // Обработчик для кнопки переключения темы (если есть)
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                
                // Сохраняем предпочтение пользователя
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
            });
        }
    };
    
    // Плавный скролл при клике на внутренние ссылки
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                
                // Если ссылка на якорь, а не просто #
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Закрываем мобильное меню если оно открыто
                        const mainMenu = document.querySelector('.main-menu');
                        const menuToggle = document.querySelector('.menu-toggle');
                        
                        if (mainMenu && mainMenu.classList.contains('active')) {
                            mainMenu.classList.remove('active');
                            if (menuToggle) menuToggle.classList.remove('active');
                        }
                        
                        // Плавный скролл к элементу
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    };
    
    // Управление ленивой загрузкой изображений
    const initLazyLoading = () => {
        if ('loading' in HTMLImageElement.prototype) {
            // Используем нативную ленивую загрузку
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Полифилл для старых браузеров
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            if (lazyImages.length === 0) return;
            
            const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                lazyLoadObserver.observe(image);
            });
        }
    };
    
    // Обработка отправки форм AJAX
    const initFormSubmission = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                // В демо-версии просто предотвращаем отправку формы
                // В реальном проекте здесь должен быть AJAX запрос на сервер
                e.preventDefault();
                
                const submitButton = form.querySelector('button[type="submit"]');
                
                if (submitButton) {
                    // Меняем текст кнопки
                    const originalText = submitButton.textContent;
                    submitButton.textContent = 'Отправляется...';
                    submitButton.disabled = true;
                    
                    // Имитация отправки
                    setTimeout(() => {
                        form.reset();
                        submitButton.textContent = 'Отправлено!';
                        
                        // Возвращаем исходный текст
                        setTimeout(() => {
                            submitButton.textContent = originalText;
                            submitButton.disabled = false;
                        }, 2000);
                    }, 1500);
                }
            });
        });
    };
    
    // Обнаружение и активация анимаций при скролле
    const initScrollTriggers = () => {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');
        
        if (animatedElements.length === 0) return;
        
        const checkScroll = () => {
            animatedElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // Проверяем, виден ли элемент в области просмотра
                if (rect.top <= windowHeight * 0.85 && rect.bottom >= 0) {
                    element.classList.add('active');
                }
            });
        };
        
        // Проверяем при загрузке страницы и при скролле
        window.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);
        checkScroll();
    };
    
    // Управление активными пунктами меню при скролле
    const initActiveMenuOnScroll = () => {
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;
        
        window.addEventListener('scroll', () => {
            let scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.main-menu a').forEach(link => {
                        link.parentElement.classList.remove('active');
                        
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.parentElement.classList.add('active');
                        }
                    });
                }
            });
        });
    };
    
    // Запуск всех инициализаций
    pageLoader();
    initGlitchText();
    initDarkMode();
    initSmoothScroll();
    initLazyLoading();
    initFormSubmission();
    initScrollTriggers();
    initActiveMenuOnScroll();
}); 