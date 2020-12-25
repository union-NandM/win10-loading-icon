(() => {
    function drawCircle(ctx, centerX, centerY, radius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    
    function resetCanvas(canvas, ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 
    

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const colors = {
        black: '#000000',
        white: '#ffffff',
    };

    const ball = {
        ball_radius_max: 4,
        color: colors.white,
        orbit_radius: 100,
        orbit_center: {
            x: 250,
            y: 250,
        },
        
        angle(t) {
            return 2*(2*t*(75 + 3 * Math.PI * t - t*t) - 75*Math.sin(2 * t)) / (2 * (75 + 2*Math.PI * Math.PI));
        },

        x(t) {
            return this.orbit_center.x + this.orbit_radius * Math.sin(this.angle(t));
        },

        y(t) {
            return this.orbit_center.y + this.orbit_radius * Math.cos(this.angle(t));
        },

        ballRadius(t) {
            let angle = this.angle(t);
            if (angle < Math.PI / 4) {
                return this.ball_radius_max * Math.sin(angle / 2 * 3);
            } else if (angle < Math.PI * 119 / 30) {
                return this.ball_radius_max;
            } else {
                return Math.max(this.ball_radius_max * Math.sin((2 * Math.PI - angle - Math.PI / 60) * 10), 0);
            }
        },

        draw(ctx, t) {
            drawCircle(
                ctx,
                this.x(t),
                this.y(t),
                this.ballRadius(t),
                this.color
                );
        },
    };

    let t = [0,5,10,15,20,25];
    const interval = 10;
    const animationFlames = 200;
    const totalFlames = interval + animationFlames;
    const fps = 50;
    setInterval(() => {
        resetCanvas(canvas, ctx, colors.black);
        for (let i = 0; i < t.length; i++) {
            if (t[i] < animationFlames) {
                ball.draw(ctx, t[i] * Math.PI / 100);
            }
            t[i] = t[i] >= totalFlames ? 0 : t[i] + 1;
        }
    }, 1000 / fps);

})();


