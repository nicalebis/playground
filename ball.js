// BALL ANIMATIONS CODE //
    function animateBouncingBalls(callback) {
        const canvasContainer = document.querySelector('#canvas-container');
        const canvas = document.createElement('canvas');
        canvas.id = 'attentionCheckCanvas';
        canvas.width = 800;
        canvas.height = 600;
        canvasContainer.appendChild(canvas);
    
    // Event Listeners
    let keyPresses = [];
        function keyDownHandler(event) {
            if (event.key === 'f' || event.key === 'F' || event.key === 'j' || event.key === 'J') {
                const keyPress = { key: event.key.toLowerCase(), time: new Date().getTime() };
                keyPresses.push(keyPress);
                console.log('Keypress:', keyPress); // Log the keypress to the console
            }
        }
    
    document.addEventListener('keydown', keyDownHandler);
    
    let collisionTimes = {
        ballWall: [],
        ballBall: [],
    };
    
    function task1() {
        for (let i = 0; i < balls.length; i++) {
            const ball = balls[i];
    
            // Ball-wall collision
            if (
                ball.x - ball.radius <= 0 ||
                ball.x + ball.radius >= canvas.width ||
                ball.y - ball.radius <= 0 ||
                ball.y + ball.radius >= canvas.height
            ) {
                const ballWallCollisionTime = new Date().getTime();
                collisionTimes.ballWall.push(ballWallCollisionTime);
                console.log('Ball-wall collision:', ballWallCollisionTime); // Log the collision time to the console
            }
    
            // Ball-ball collision
            for (let j = i + 1; j < balls.length; j++) {
                if (detectCollision(ball, balls[j])) {
                    const ballBallCollisionTime = new Date().getTime();
                    collisionTimes.ballBall.push(ballBallCollisionTime);
                    console.log('Ball-ball collision:', ballBallCollisionTime); // Log the collision time to the console
                }
            }
        }
    }
    
    
            class Ball {
                constructor(x, y, radius, dx, dy, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.dx = dx;
                this.dy = dy;
                this.color = color;
                }
    
                draw(ctx) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    ctx.closePath();
                }
    
                update(canvas) {
                    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                        this.dx = -this.dx;
                        }
    
                    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                        this.dy = -this.dy;
                        }
    
                    this.x += this.dx;
                    this.y += this.dy;
                }
    
                animate(ctx, canvas) {
                    this.x += this.dx;
                    this.y += this.dy;
    
                    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
                        this.dx = -this.dx;
                    }
    
                    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
                        this.dy = -this.dy;
                    }
    
                    this.draw(ctx);
                }
            }
                 
        const ctx = canvas.getContext("2d");
      
        function detectCollision(ball1, ball2) {
            const dx = ball1.x - ball2.x;
            const dy = ball1.y - ball2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < ball1.radius + ball2.radius;
            }
    
            const ball1 = new Ball(100, 100, 20, 2, 3, "red");
            const ball2 = new Ball(200, 200, 20, -2, -3, "blue");
            const ball3 = new Ball(300, 150, 20, 3, 2, "green");
            const balls = [ball1, ball2, ball3];
    
            const colors = ["red", "blue", "green"];
    
        function changeColor(ball) {
            const currentColorIndex = colors.indexOf(ball.color);
        
            let newColorIndex;
                do {
                newColorIndex = Math.floor(Math.random() * colors.length);
                } while (newColorIndex === currentColorIndex);
    
            ball.color = colors[newColorIndex];
        }
    
    let lastCollisionTime = null;
    
    function resolveCollision(ball1, ball2) {
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        if (distance < ball1.radius + ball2.radius) {
            // Calculate the unit vector of the collision normal
            const nx = dx / distance;
            const ny = dy / distance;
    
            // Calculate the relative velocity of the balls
            const dvx = ball2.dx - ball1.dx;
            const dvy = ball2.dy - ball1.dy;
            const dotProduct = dvx * nx + dvy * ny;
    
            // Calculate the impulse scalar
            const mass1 = Math.PI * ball1.radius ** 2;
            const mass2 = Math.PI * ball2.radius ** 2;
            const impulse = (2 * dotProduct) / (mass1 + mass2);
    
            // Apply the impulse to the velocities
            ball1.dx += impulse * nx * mass2;
            ball1.dy += impulse * ny * mass2;
            ball2.dx -= impulse * nx * mass1;
            ball2.dy -= impulse * ny * mass1;
    
            // Separate the balls along the collision normal
            const overlap = ball1.radius + ball2.radius - distance;
            ball1.x -= overlap * nx * 0.5;
            ball1.y -= overlap * ny * 0.5;
            ball2.x += overlap * nx * 0.5;
            ball2.y += overlap * ny * 0.5;
        }
    }
    
    let animationId;
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        for (const ball of balls) {
            ball.animate(ctx, canvas);
        }
    
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                if (detectCollision(balls[i], balls[j])) {
                    resolveCollision(balls[i], balls[j]);
                }
            }
        }
    
    task1(); // Call task1() to update collisionTimes
    
    animationId = requestAnimationFrame(draw); 
    }
    
    draw();
    
    
    function endTask() {
        cancelAnimationFrame(animationId);
        canvasContainer.removeChild(canvas);
        document.removeEventListener('keydown', keyDownHandler);
        callback(keyPresses, collisionTimes);
    }
    
    setTimeout(endTask, 20000);
    };
