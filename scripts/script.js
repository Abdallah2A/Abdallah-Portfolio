// Background Animation with Neural Network Effect
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const colors = ["#C5A880", "#C5A880", "#C5A880", "#532E1C"];

canvas.width = document.body.scrollWidth;
canvas.height = window.innerHeight;
canvas.style.display = "block";
ctx.lineWidth = 0.6;

let mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

let isLinkedInHovered = false;

const windowWidth = window.innerWidth;
const config = windowWidth > 1600 ? { nb: 500, distance: 80, d_radius: 350, maxConnections: 3, array: [] } :
               windowWidth > 1300 ? { nb: 450, distance: 70, d_radius: 320, maxConnections: 3, array: [] } :
               windowWidth > 1100 ? { nb: 400, distance: 60, d_radius: 280, maxConnections: 3, array: [] } :
               windowWidth > 800  ? { nb: 250, distance: 50, d_radius: 220, maxConnections: 2, array: [] } :
               windowWidth > 600  ? { nb: 150, distance: 40, d_radius: 160, maxConnections: 2, array: [] } :
                                    { nb: 80,  distance: 30, d_radius: 120, maxConnections: 2, array: [] };

function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = -0.3 + Math.random() * 0.6;
    this.vy = -0.3 + Math.random() * 0.6;
    this.radius = 1 + Math.random() * 1.5;
    this.colour = colors[Math.floor(Math.random() * colors.length)];
    this.pulse = Math.random() * Math.PI * 2;
    this.opacity = isLinkedInHovered ? 0 : 1; // Initial opacity for hover effect
}

Particle.prototype = {
    create: function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        const dist = Math.sqrt((this.x - mouse.x) ** 2 + (this.y - mouse.y) ** 2) / (windowWidth / 1.5);
        const pulse = Math.sin(this.pulse) * 0.5 + 0.5;
        ctx.fillStyle = this.colour + `,${1 - dist * 0.7 + pulse * 0.3})`;
        ctx.fill();
    },
    animate: function() {
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.05;
        // Fade in/out opacity for hover effect
        if (isLinkedInHovered && this.opacity < 1) {
            this.opacity = Math.min(this.opacity + 0.05, 1);
        } else if (!isLinkedInHovered && this.opacity > 0) {
            this.opacity = Math.max(this.opacity - 0.05, 0);
        }
    },
    findNearest: function(particles) {
        const distances = particles.map((other, index) => ({
            index,
            dist: Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2),
            particle: other
        }));
        return distances
            .filter(d => d.dist > 0) // Exclude self
            .sort((a, b) => a.dist - b.dist)
            .slice(0, config.maxConnections)
            .map(d => d.particle);
    },
    line: function(other, isHover) {
        const distX = this.x - other.x;
        const distY = this.y - other.y;
        const dist = Math.sqrt(distX ** 2 + distY ** 2);
        if (isHover || dist < config.distance) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(other.x, other.y);
            const mouseDist = Math.sqrt((this.x - mouse.x) ** 2 + (this.y - mouse.y) ** 2) / config.d_radius;
            let opacity = isHover ? this.opacity * (0.4 + 0.2 * Math.sin(this.pulse)) : 1 - (dist / config.distance) * 0.7 - mouseDist * 0.3;
            opacity = Math.max(0, Math.min(opacity, 1));
            ctx.strokeStyle = `rgba(230, 230, 230, ${opacity})`;
            ctx.stroke();
            ctx.closePath();
        }
    }
};

// Initialize particles
for (let i = 0; i < config.nb; i++) {
    config.array.push(new Particle());
}

window.onmousemove = function(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
};

// LinkedIn hover effect
const linkedInIcon = document.querySelector('.linkedin-icon');
linkedInIcon.addEventListener('mouseenter', () => {
    isLinkedInHovered = true;
    config.array.forEach(p => p.opacity = 0); // Reset opacity for fade-in
});
linkedInIcon.addEventListener('mouseleave', () => {
    isLinkedInHovered = false;
});

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles and lines
    for (let i = 0; i < config.array.length; i++) {
        const particle = config.array[i];
        particle.create();
        particle.animate();
        if (isLinkedInHovered) {
            // Connect to nearest neighbors during hover
            const nearest = particle.findNearest(config.array);
            nearest.forEach(other => particle.line(other, true));
        } else {
            // Normal distance-based connections
            for (let j = i + 1; j < config.array.length; j++) {
                particle.line(config.array[j], false);
            }
        }
    }

    requestAnimationFrame(animateBackground);
}

animateBackground();

window.onresize = function() {
    canvas.width = document.body.scrollWidth;
    canvas.height = window.innerHeight;
    config.array = [];
    for (let i = 0; i < config.nb; i++) {
        config.array.push(new Particle());
    }
};

// Card Interaction
const cards = document.querySelectorAll('.card');
const fullScreenContent = document.querySelector('.full-screen-content');
const closeBtn = document.querySelector('.close-btn');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const section = card.getAttribute('data-section');
        document.querySelectorAll('.content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');
        fullScreenContent.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => {
    fullScreenContent.classList.remove('active');
});
