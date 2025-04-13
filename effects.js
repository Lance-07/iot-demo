const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio; 

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

class Particle {
    constructor(x, y, effect) {
        this.originX = x;
        this.originY = y;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = "#fff";
        this.velocityX = 0;
        this.velocityY = 0;
        this.ease = 0.2;
        this.friction = 0.9;
        this.directionX = 0;
        this.directionY = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.size = Math.floor(Math.random() * 5) + 1;
        this.draw();
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.directionX = this.effect.mouse.x - this.x;
        this.directionY = this.effect.mouse.y - this.y;
        this.distance = this.directionX * this.directionX + this.directionY * this.directionY;
        this.force = -this.effect.mouse.radius / this.distance * 8; 

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.directionY, this.directionX);
            this.velocityX += this.force * Math.cos(this.angle);
            this.velocityY += this.force * Math.sin(this.angle);
        }

        this.x += (this.velocityX *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.velocityY *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw();
    }
}

class Effect {
    constructor(width, height, context) {
        this.width = width;
        this.height = height;
        this.ctx = context;
        this.gap = 20;
        this.particles = [];
        this.mouse = {
            radius: 3000,
            x: 0,
            y: 0
        }
        window.addEventListener("mousemove", e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = e.pageY * window.devicePixelRatio;
        });
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio; 
            this.width = canvas.width;
            this.height = canvas.height;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            this.particles = [];
            this.init();
        })
        this.init();
    }
    init() {
        for(let x = 0; x < this.width; x += this.gap) {
            for (let y = 0; y < this.height; y += this.gap) {
                this.particles.push(new Particle(x, y, this));
            }
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
    }
}

const effect = new Effect(canvas.width, canvas.height, ctx);

function animate() {
    effect.update();
    requestAnimationFrame(animate);
}

animate();
