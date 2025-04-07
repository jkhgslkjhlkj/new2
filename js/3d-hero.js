/**
 * TechFuture - 3D анимация для Hero секции
 * Создает интерактивную 3D визуализацию с использованием Three.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const heroContainer = document.getElementById('hero-3d');
    
    if (!heroContainer || typeof THREE === 'undefined') return;

    // Настройки
    const settings = {
        particlesCount: window.innerWidth < 768 ? 500 : 1000,
        cameraZ: 300,
        cameraFov: 75,
        rotationSpeed: 0.001,
        mouseInfluence: 0.1
    };

    let scene, camera, renderer, geometry, material, points;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    
    // Инициализация сцены
    function init() {
        // Создаем сцену
        scene = new THREE.Scene();
        
        // Настраиваем камеру
        camera = new THREE.PerspectiveCamera(
            settings.cameraFov, 
            heroContainer.clientWidth / heroContainer.clientHeight, 
            1, 
            10000
        );
        camera.position.z = settings.cameraZ;
        
        // Создаем геометрию для частиц
        geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        // Создаем вершины и цвета для каждой частицы
        for (let i = 0; i < settings.particlesCount; i++) {
            // Позиция частицы (сферическая форма)
            const radius = 150 + Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            vertices.push(x, y, z);
            
            // Цвет частицы
            let color;
            if (Math.random() < 0.33) {
                color = new THREE.Color(0x00b2ff); // неоновый синий
            } else if (Math.random() < 0.66) {
                color = new THREE.Color(0x8a2be2); // неоновый фиолетовый 
            } else {
                color = new THREE.Color(0x00ffd5); // неоновый мятный
            }
            
            colors.push(color.r, color.g, color.b);
        }
        
        // Добавляем вершины и цвета к геометрии
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        // Создаем материал для частиц
        material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        // Создаем систему частиц
        points = new THREE.Points(geometry, material);
        scene.add(points);
        
        // Создаем рендерер
        renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        renderer.setClearColor(0x000000, 0);
        
        // Добавляем рендерер на страницу
        heroContainer.appendChild(renderer.domElement);
        
        // Добавляем обработчики событий
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
    }
    
    // Обработка движения мыши
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) * settings.mouseInfluence;
        mouseY = (event.clientY - windowHalfY) * settings.mouseInfluence;
    }
    
    // Обработка изменения размера окна
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    }
    
    // Анимация
    function animate() {
        requestAnimationFrame(animate);
        
        // Вращение сферы частиц
        points.rotation.x += settings.rotationSpeed;
        points.rotation.y += settings.rotationSpeed * 1.5;
        
        // Влияние мыши на камеру
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        // Рендеринг
        renderer.render(scene, camera);
    }
    
    // Запуск визуализации
    init();
    animate();
}); 