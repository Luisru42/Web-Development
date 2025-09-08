// ======================= Background Particle Animation =======================
// Elegant particle system with soft color gradients and black canvas background

const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Particle configuration
const PARTICLE_COUNT = 100;
const PARTICLE_RADIUS = 2;
const INTERACTION_DISTANCE = 100;
let particles = [];
let mouse = { x: null, y: null };

// Soft professional color palette (blues and grays)
const COLORS = [
  'rgba(43, 122, 239, OPACITY)',   // soft blue
  'rgba(87, 196, 209, OPACITY)',   // teal
  'rgba(148, 181, 209, OPACITY)',  // light blue-gray
  'rgba(200, 210, 218, OPACITY)',  // lighter gray-blue
  'rgba(240, 245, 250, OPACITY)'   // very light gray
];

// Resize canvas to full screen and initialize particles
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

// Particle class with motion, interaction, and fade-in effect
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.opacity = 0;
    this.fadeIn = true;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off canvas edges
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // Mouse interaction
    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < INTERACTION_DISTANCE) {
        const force = (INTERACTION_DISTANCE - distance) / INTERACTION_DISTANCE;
        this.x += dx * force * 0.3;
        this.y += dy * force * 0.3;
      }
    }

    // Fade-in effect
    if (this.fadeIn) {
      this.opacity += 0.02;
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.fadeIn = false;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, PARTICLE_RADIUS, 0, Math.PI * 2);
    const colorWithOpacity = this.color.replace('OPACITY', this.opacity.toFixed(2));
    ctx.fillStyle = colorWithOpacity;
    ctx.fill();
    ctx.closePath();
  }
}

// Create initial particle set
function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    particles.push(new Particle(x, y));
  }
}

// Connect nearby particles with gradient lines
function connectParticles() {
  const opacityFactor = 0.008;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < INTERACTION_DISTANCE) {
        const opacity = Math.max(0, 1 - distance * opacityFactor);
        const gradient = ctx.createLinearGradient(
          particles[i].x, particles[i].y,
          particles[j].x, particles[j].y
        );
        gradient.addColorStop(0, particles[i].color.replace('OPACITY', opacity.toFixed(2)));
        gradient.addColorStop(1, particles[j].color.replace('OPACITY', opacity.toFixed(2)));

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Main animation loop
function animate() {
  // Set black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

// Initialize and start animation
resizeCanvas();
animate();