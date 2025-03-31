// =================== Canvas Particle Animation ===================
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 100;
const particleRadius = 2;
let mouse = { x: null, y: null };
const interactionDistance = 100; // Distancia de interacción entre partículas y el mouse

// Configuración responsiva del canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Re-inicializa las partículas al cambiar el tamaño del canvas para evitar problemas de posición
}

// Eventos del navegador
window.addEventListener('resize', resizeCanvas); // Llama a resizeCanvas al cambiar el tamaño de la ventana
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

// Clase Particle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1; // Velocidad inicial aleatoria en el eje X
        this.vy = Math.random() * 2 - 1; // Velocidad inicial aleatoria en el eje Y
        this.opacity = 0; // Opacidad inicial de la partícula
        this.fadeIn = true; // Controla si la partícula debe aparecer gradualmente
    }

    update() {
        // Actualiza la posición de la partícula
        this.x += this.vx;
        this.y += this.vy;

        // Rebotar en los bordes del canvas
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1; // Invierte la velocidad en X si alcanza un borde horizontal
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1; // Invierte la velocidad en Y si alcanza un borde vertical

        // Interacción con el mouse
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < interactionDistance) {
            // Aplica una fuerza que aleja la partícula del mouse
            const force = (interactionDistance - distance) / interactionDistance; // Fuerza basada en la distancia
            this.x -= dx * force * 0.3; // Ajusta la fuerza y la dirección del desplazamiento
            this.y -= dy * force * 0.3;
        }

        //Aparecer gradualmente
        if (this.fadeIn) {
            this.opacity += 0.03; // Incrementa la opacidad
            if (this.opacity >= 1) {
                this.opacity = 1;
                this.fadeIn = false; // Detiene el efecto de aparición gradual
            }
        }
    }

    draw() {
        // Dibuja la partícula como un círculo
        ctx.beginPath();
        ctx.arc(this.x, this.y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; // Usa la opacidad de la partícula
        ctx.fill();
        ctx.closePath(); // Cierra el path del círculo
    }
}

// Inicializar partículas
function initParticles() {
    particles = []; // Reinicia el array de partículas
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y)); // Crea una nueva partícula y la añade al array
    }
}

// Conectar partículas con líneas
function connectParticles() {
    const opacityFactor = 0.008; // Ajusta este valor para controlar la opacidad de las líneas

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < interactionDistance) {
                // Conecta las partículas con una línea si están lo suficientemente cerca
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const opacity = Math.max(0, 1 - distance * opacityFactor); // Opacidad basada en la distancia
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`; // Color de la línea con opacidad variable
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// Animación del canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas en cada frame
    particles.forEach((particle) => {
        particle.update(); // Actualiza la posición y propiedades de cada partícula
        particle.draw(); // Dibuja cada partícula
    });
    connectParticles(); // Conecta las partículas con líneas
    requestAnimationFrame(animate); // Solicita el próximo frame de animación
}

// Inicialización
resizeCanvas(); // Inicializa el tamaño del canvas y las partículas
animate(); // Comienza el ciclo de animación
