/**
 * TechFuture - Анимированные частицы
 * Создает интерактивные частицы в фоне сайта
 */

document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles-background');
    
    if (!particlesContainer) return;

    // Настройки
    const settings = {
        particlesCount: window.innerWidth < 768 ? 50 : 100,
        particleColor: ['rgba(0, 178, 255, 0.7)', 'rgba(138, 43, 226, 0.7)', 'rgba(0, 255, 213, 0.7)'],
        minSize: 1,
        maxSize: 3,
        minSpeed: 0.3,
        maxSpeed: 0.8,
        connectDistance: 150,
        connectWidth: 0.5,
        responsiveWidth: 0.0005 // ширина соединений в зависимости от расстояния
    };

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Создаем canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    particlesContainer.appendChild(canvas);
    
    // Массив частиц
    let particles = [];
    
    // Класс частицы
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
            this.speedX = (Math.random() - 0.5) * (settings.maxSpeed - settings.minSpeed) * 2;
            this.speedY = (Math.random() - 0.5) * (settings.maxSpeed - settings.minSpeed) * 2;
            this.color = settings.particleColor[Math.floor(Math.random() * settings.particleColor.length)];
            this.opacity = Math.random() * 0.8 + 0.2;
        }
        
        update() {
            // Движение
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Границы
            if (this.x > width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`);
            ctx.fill();
        }
    }
    
    // Создаем частицы
    function createParticles() {
        for (let i = 0; i < settings.particlesCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Соединяем близкие частицы линиями
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < settings.connectDistance) {
                    // Прозрачность зависит от расстояния
                    const opacity = 1 - (distance / settings.connectDistance);
                    const width = settings.connectWidth + (distance * settings.responsiveWidth);
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 178, 255, ${opacity * 0.5})`;
                    ctx.lineWidth = width;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Основная анимация
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Обновляем и рисуем каждую частицу
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    // Обработчик изменения размера окна
    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        // Пересоздаем частицы
        particles = [];
        settings.particlesCount = window.innerWidth < 768 ? 50 : 100;
        createParticles();
    }
    
    // Интерактивность при движении мыши
    function handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Влияем на некоторые частицы при наведении
        for (let i = 0; i < particles.length; i++) {
            const dx = mouseX - particles[i].x;
            const dy = mouseY - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = 0.1; // сила отталкивания/притяжения
                const angle = Math.atan2(dy, dx);
                
                particles[i].x -= Math.cos(angle) * force;
                particles[i].y -= Math.sin(angle) * force;
            }
        }
    }
    
    // Обработчики событий
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    
    // Инициализация
    createParticles();
    animate();
}); 