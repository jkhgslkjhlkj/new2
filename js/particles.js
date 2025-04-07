/**
 * Particles JS для Overwatch 2
 * Создает эффект частиц в фоне, имитирующий энергетические частицы вселенной Overwatch
 */

document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('particles-container');
    
    if (!particlesContainer) return;
    
    // Настройки частиц
    const PARTICLE_COUNT = 80;
    const PARTICLE_SIZE_MIN = 1;
    const PARTICLE_SIZE_MAX = 4;
    const PARTICLE_SPEED_MIN = 0.2;
    const PARTICLE_SPEED_MAX = 0.8;
    const PARTICLE_COLORS = ['#fa9c1e', '#218ffe', '#ffffff', '#ff5252'];
    
    // Создаем частицы
    let particles = [];
    
    function createParticles() {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN;
            
            particle.className = 'particle';
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.borderRadius = '50%';
            particle.style.backgroundColor = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
            particle.style.opacity = Math.random() * 0.6 + 0.2;
            particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.backgroundColor}`;
            
            // Случайное начальное положение
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            
            // Случайная скорость и направление
            const speedX = (Math.random() - 0.5) * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN;
            const speedY = (Math.random() - 0.5) * (PARTICLE_SPEED_MAX - PARTICLE_SPEED_MIN) + PARTICLE_SPEED_MIN;
            
            particles.push({
                element: particle,
                x: x,
                y: y,
                speedX: speedX,
                speedY: speedY,
                size: size
            });
            
            particlesContainer.appendChild(particle);
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            // Обновляем положение
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Проверяем границы экрана
            if (particle.x < -particle.size) particle.x = window.innerWidth + particle.size;
            if (particle.x > window.innerWidth + particle.size) particle.x = -particle.size;
            if (particle.y < -particle.size) particle.y = window.innerHeight + particle.size;
            if (particle.y > window.innerHeight + particle.size) particle.y = -particle.size;
            
            // Применяем новое положение
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        requestAnimationFrame(updateParticles);
    }
    
    function connectParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        
        particlesContainer.appendChild(canvas);
        
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Рисуем соединения между близкими частицами
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(250, 156, 30, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            requestAnimationFrame(draw);
        }
        
        draw();
    }
    
    function handleResize() {
        particles.forEach(particle => {
            if (particle.x > window.innerWidth) {
                particle.x = Math.random() * window.innerWidth;
            }
            if (particle.y > window.innerHeight) {
                particle.y = Math.random() * window.innerHeight;
            }
        });
        
        // Обновляем размер canvas
        const canvas = particlesContainer.querySelector('canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }
    
    window.addEventListener('resize', handleResize);
    
    // Инициализация
    createParticles();
    updateParticles();
    connectParticles();
    
    // Добавляем эффект параллакса при движении мыши
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        particles.forEach(particle => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;
            
            // Вычисляем новую позицию с эффектом параллакса
            const parallaxX = deltaX * 3 * Math.random();
            const parallaxY = deltaY * 3 * Math.random();
            
            // Плавно двигаем частицы
            particle.element.style.transform = `translate(${particle.x + parallaxX}px, ${particle.y + parallaxY}px)`;
        });
    });
}); 