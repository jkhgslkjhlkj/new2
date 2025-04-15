// Анимация для плавного скролла
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Анимация для появления элементов при скролле
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.content-wrapper, .feature-icon, .security-feature, .metric, .chain-icon').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Анимированные соединения для DeFi нодов
function createConnections() {
    const defiVisualization = document.querySelector('.defi-visualization');
    if (!defiVisualization) return;
    
    const centralNode = document.querySelector('.defi-node.central');
    const otherNodes = document.querySelectorAll('.defi-node:not(.central)');
    
    const centralRect = centralNode.getBoundingClientRect();
    const centralX = centralRect.left + centralRect.width / 2;
    const centralY = centralRect.top + centralRect.height / 2;
    
    otherNodes.forEach(node => {
        const nodeRect = node.getBoundingClientRect();
        const nodeX = nodeRect.left + nodeRect.width / 2;
        const nodeY = nodeRect.top + nodeRect.height / 2;
        
        const connection = document.createElement('div');
        connection.classList.add('connection');
        connection.style.position = 'absolute';
        
        const length = Math.sqrt(Math.pow(nodeX - centralX, 2) + Math.pow(nodeY - centralY, 2));
        const angle = Math.atan2(nodeY - centralY, nodeX - centralX) * 180 / Math.PI;
        
        connection.style.width = `${length}px`;
        connection.style.height = '2px';
        connection.style.backgroundColor = '#6c31ff';
        connection.style.position = 'absolute';
        connection.style.top = `${centralY - defiVisualization.getBoundingClientRect().top}px`;
        connection.style.left = `${centralX - defiVisualization.getBoundingClientRect().left}px`;
        connection.style.transformOrigin = '0 0';
        connection.style.transform = `rotate(${angle}deg)`;
        connection.style.opacity = '0.5';
        
        defiVisualization.appendChild(connection);
    });
}

window.addEventListener('resize', createConnections);
window.addEventListener('load', createConnections);

// Фиксированное меню при скролле
const header = document.querySelector('header');
let lastScrollPosition = 0;

window.addEventListener('scroll', () => {
    const currentScrollPosition = window.pageYOffset;
    
    if (currentScrollPosition > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (currentScrollPosition > lastScrollPosition) {
        header.classList.add('header-hidden');
    } else {
        header.classList.remove('header-hidden');
    }
    
    lastScrollPosition = currentScrollPosition;
});

// Инициализация графиков
function initCharts() {
    // Маркет чарт
    const marketChartElement = document.getElementById('marketChart');
    if (marketChartElement) {
        const marketChart = new Chart(marketChartElement, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'BNB Price',
                    data: [240, 235, 260, 255, 270, 285, 290, 285, 295, 300, 310, 312],
                    borderColor: '#00c8ff',
                    backgroundColor: 'rgba(0, 200, 255, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0e0e2a',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0c0',
                        borderColor: '#6c31ff',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0c0',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(160, 160, 192, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0c0',
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }

    // Чарт предсказаний
    const predictionChartElement = document.getElementById('predictionChart');
    if (predictionChartElement) {
        const predictionChart = new Chart(predictionChartElement, {
            type: 'line',
            data: {
                labels: ['6h', '12h', '18h', '24h', '30h', '36h', '42h', '48h'],
                datasets: [{
                    label: 'Historical',
                    data: [280, 285, 290, 285, 288, null, null, null],
                    borderColor: '#6c31ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }, {
                    label: 'Prediction',
                    data: [null, null, null, 288, 295, 305, 310, 312.45],
                    borderColor: '#00e376',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#0e0e2a',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0c0',
                        borderColor: '#6c31ff',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0c0',
                            font: {
                                size: 9
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(160, 160, 192, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#a0a0c0',
                            font: {
                                size: 9
                            }
                        }
                    }
                }
            }
        });
    }

    // Портфолио чарт
    const portfolioChartElement = document.getElementById('portfolioChart');
    if (portfolioChartElement) {
        const portfolioChart = new Chart(portfolioChartElement, {
            type: 'doughnut',
            data: {
                labels: ['BNB', 'BUSD', 'CAKE', 'ETH', 'Others'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#6c31ff',
                        '#00e376',
                        '#00c8ff',
                        '#2b3af9',
                        '#ffbb00'
                    ],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#0e0e2a',
                        titleColor: '#ffffff',
                        bodyColor: '#a0a0c0',
                        borderColor: '#6c31ff',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Инициализация графиков после загрузки страницы
window.addEventListener('load', initCharts);

// Добавление класса для анимации
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    // Добавляем эффект печатной машинки для заголовков
    const typingElements = document.querySelectorAll('.typing-effect');
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
    });

    // Добавляем эффект счетчика для метрик
    const counterElements = document.querySelectorAll('.counter');
    counterElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 секунды
        const step = (target / duration) * 10;
        let current = 0;
        
        const counterInterval = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counterInterval);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 10);
    });
});

// Дополнительные эффекты при наведении
document.querySelectorAll('.platform-icon, .chain-icon, .security-feature').forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.classList.add('hover-effect');
    });
    
    element.addEventListener('mouseleave', () => {
        element.classList.remove('hover-effect');
    });
});

// CSS классы для анимации
document.head.insertAdjacentHTML('beforeend', `
<style>
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .fade-in.animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .header-hidden {
        transform: translateY(-100%);
    }
    
    .scrolled {
        background: rgba(5, 5, 23, 0.95);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }
    
    .hover-effect {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 15px 40px rgba(108, 49, 255, 0.3);
    }
    
    .connection {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            opacity: 0.2;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0.2;
        }
    }
    
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body.loaded::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--background-color);
        z-index: 9999;
        animation: fadeOut 1s forwards;
    }
    
    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>
`);

// Анимация конекций DeFi
function animateConnections() {
    const connections = document.querySelectorAll('.connection');
    
    connections.forEach((connection, index) => {
        setTimeout(() => {
            connection.style.animation = 'pulse 2s infinite';
        }, index * 200);
    });
}

window.addEventListener('load', () => {
    setTimeout(() => {
        animateConnections();
    }, 1000);
}); 