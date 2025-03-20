// =================== Canvas Particle Animation ===================
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
const particleRadius = 2;
let mouse = { x: null, y: null };

// Configuración responsiva del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}

// Eventos del navegador
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Clase Particle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar en los bordes del canvas
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Interacción con el mouse
        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.x -= dx / 20;
                this.y -= dy / 20;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
}

// Inicializar partículas
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

// Conectar partículas con líneas
function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
            }
        }
    }
}

// Animación del canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
}

// Configuración inicial
resizeCanvas();
animate();