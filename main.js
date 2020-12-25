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

    function startAnimation(quantity, fps) {
        let t = [];
        for (let i = 0; i < quantity; i++) {
              t.push(i * 5);
        }
        const intervalFrames = quantity < 4 ? 0 : t[quantity - 4];
        const animationFrames = 200;
        const totalFrames = intervalFrames + animationFrames;
        return (
            setInterval(() => {
                resetCanvas(canvas, ctx, colors.black);
                for (let i = 0; i < t.length; i++) {
                    if (t[i] > intervalFrames) {
                        ball.draw(ctx, (t[i] - intervalFrames) * Math.PI / 100);
                    }
                    t[i] = t[i] >= totalFrames ? 0 : t[i] + 1;
                }
            }, 1000 / fps)
        );    
    }

    function validate(node, errorMessage) {
        const quantity = Number(node.value);
        if (Number.isInteger(quantity) && quantity >= 0) {
            node.classList.remove('error');
            errorMessage.textContent = '';
            return true;
        } else {
            node.classList.add('error');
            errorMessage.textContent = '非負整数値を入力してください';
            return false;
        }

    }
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const colors = {
        black: '#000000',
        white: '#ffffff',
    };

    const ball = {
        quantity: 6,
        color: colors.white,
        orbit_radius: 100,
        ball_radius_max: 4,
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

    let intervalid;
    const fps = 50;
    
    intervalid = startAnimation(ball.quantity, fps);
    
    const $inputQuantity = document.getElementById('quantity');
    const $errorMessage = document.getElementById('error-message');

    document.getElementById("btn").addEventListener('click', () => {
        const quantity = Number($inputQuantity.value);
        if (validate($inputQuantity, $errorMessage)) {
            clearInterval(intervalid);
            ball.quantity = quantity;
            intervalid = startAnimation(ball.quantity, fps);
        }
    });

    $inputQuantity.addEventListener('change', () => {
        validate($inputQuantity, $errorMessage);
    })

})();