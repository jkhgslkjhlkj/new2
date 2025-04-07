/**
 * Overwatch 2 - 3D Hero Scene
 * Создает 3D сцену с вращающимся логотипом Overwatch и эффектами
 */

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('hero-scene');
    if (!container) return;

    let scene, camera, renderer, logo, particles;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    function init() {
        // Создаем сцену
        scene = new THREE.Scene();
        
        // Настраиваем камеру
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        camera.position.z = 20;
        
        // Создаем рендерер
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Создаем свет
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xfa9c1e, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        const blueLight = new THREE.PointLight(0x218ffe, 1, 50);
        blueLight.position.set(-10, 5, 10);
        scene.add(blueLight);
        
        // Создаем логотип Overwatch
        createLogo();
        
        // Создаем частицы
        createParticles();
        
        // Добавляем обработчики событий
        document.addEventListener('mousemove', onDocumentMouseMove);
        window.addEventListener('resize', onWindowResize);
        
        // Запускаем анимацию
        animate();
    }
    
    function createLogo() {
        // Создаем круглую основу логотипа
        const circleGeometry = new THREE.CircleGeometry(5, 32);
        const circleMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xfa9c1e, 
            emissive: 0xfa9c1e,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        
        // Создаем внутренний квадрат логотипа
        const squareGeometry = new THREE.BoxGeometry(7, 7, 0.5);
        const squareMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x1c2340,
            side: THREE.DoubleSide
        });
        const square = new THREE.Mesh(squareGeometry, squareMaterial);
        square.scale.set(0.6, 0.6, 1);
        
        // Создаем линии для креста
        const horizontalLineGeometry = new THREE.BoxGeometry(8, 0.8, 0.5);
        const verticalLineGeometry = new THREE.BoxGeometry(0.8, 8, 0.5);
        const lineMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.3
        });
        
        const horizontalLine = new THREE.Mesh(horizontalLineGeometry, lineMaterial);
        const verticalLine = new THREE.Mesh(verticalLineGeometry, lineMaterial);
        
        // Группируем все элементы логотипа
        logo = new THREE.Group();
        logo.add(circle);
        logo.add(square);
        logo.add(horizontalLine);
        logo.add(verticalLine);
        
        // Добавляем логотип на сцену
        logo.position.set(0, 0, 0);
        scene.add(logo);
        
        // Добавляем эффект свечения
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                "c": { value: 0.2 },
                "p": { value: 1.0 },
                glowColor: { value: new THREE.Color(0xfa9c1e) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                uniform float c;
                uniform float p;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
                    gl_FragColor = vec4(glowColor, intensity);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        const glowGeometry = new THREE.CircleGeometry(6, 32);
        const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        glowMesh.position.set(0, 0, -0.1);
        logo.add(glowMesh);
    }
    
    function createParticles() {
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 15 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i + 2] = radius * Math.cos(phi);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
    }
    
    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    }
    
    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Плавное вращение логотипа
        if (logo) {
            logo.rotation.y += 0.005;
            
            // Влияние мыши на положение
            logo.rotation.x += (mouseY * 0.01 - logo.rotation.x) * 0.05;
            logo.rotation.y += (mouseX * 0.01 - logo.rotation.y) * 0.05;
        }
        
        // Анимация частиц
        if (particles) {
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;
        }
        
        renderer.render(scene, camera);
    }
    
    // Запускаем инициализацию
    init();
}); 