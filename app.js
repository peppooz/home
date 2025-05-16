// Loading Screen Animation
window.addEventListener('load', function() {
    const loadingBar = document.getElementById('loading-bar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 18;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('loading-screen').style.display = 'none';
                }, 500);
            }, 300);
        }
        loadingBar.style.width = progress + '%';
    }, 150);
});

//Points
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

class Paricle{
    constructor(x, y, effect){
        this.originX = x;
        this.originY = y;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = 'floralwhite';
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.04;
        this.friction = 0.06;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.size = Math.floor(Math.random() * 4.5);
        this.floatAngle = Math.random() * Math.PI * 2; // for subtle motion
        this.floatSpeed = 0.02 + Math.random() * 0.02; // small variance
        this.floatRadius = 0.5 + Math.random() * 1; // how far it floats
        this.draw();
    }

    draw(){
    const dx = this.effect.mouse.x - this.x;
    const dy = this.effect.mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxVisibleDistance = 150; // adjust visibility range

    let alpha = 0;
    if (distance < maxVisibleDistance) {
        alpha = 1 - (distance / maxVisibleDistance); // fades out with distance
    }

    const floatX = Math.cos(this.floatAngle) * this.floatRadius;
    const floatY = Math.sin(this.floatAngle) * this.floatRadius;

    if (alpha > 0) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        this.ctx.beginPath();
        this.ctx.fillRect(this.x + floatX, this.y + floatY, this.size, this.size);
    }
  }

    update(){
        this.floatAngle += this.floatSpeed;
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance * 20;

        if(this.distance < this.effect.mouse.radius){
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw()
    }
}

class Effect {
    constructor(width, height, context){
        this.width = width;
        this.height = height;
        this.ctx = context;
      this.particlesArray = [];
        this.gap = window.innerWidth / 90;
        this.mouse = {
            radius: 15000,
            x: 0,
            y: 0
        }
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX * window.devicePixelRatio;
            this.mouse.y = e.clientY * window.devicePixelRatio;
        })

 window.addEventListener('resize', () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            this.width = canvas.width
            this.height = canvas.height
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            this.particlesArray = [];
            this.init();
        })
        this.init();
    }

    init(){
        for(let x = 0; x < this.width; x += this.gap){
            for(let y = 0; y < this.height; y += this.gap){
                this.particlesArray.push(new Paricle(x, y, this))
            }
        }
    }

    update(){
      // Draw a translucent black rectangle to fade previous frame
   this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Lower alpha = longer trails
   this.ctx.fillRect(0, 0, this.width, this.height);
   //this.ctx.clearRect(0, 0, this.width, this.height);
        for(let i = 0; i < this.particlesArray.length; i++){
            this.particlesArray[i].update();
        }
    }
}

let effect = new Effect(canvas.width, canvas.height, ctx);
function animate(){
    effect.update();
    requestAnimationFrame(animate)
}
animate()
