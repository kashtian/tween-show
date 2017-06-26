let timeDis = 0, point = {}, radius = 5, animationId = 0,
    ps = [
        {x: 0, y: 0},
        {x: 0.05, y: 1.03},
        {x: 0.42, y: 1.23},
        {x: 1, y: 1}
    ];

export default {
    // 二项式求值
    binomial(i, n) {
        return this.factorial(n) / (this.factorial(i) * this.factorial(n - i));
    },

    // 求阶乘
    factorial(n) {
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    },

    // 贝兹曲线通用公式 ( t∈[0,1] )
    getCommonBt(pts, t, field) {
        let res = 0;
        field = field || 'x';

        for (let i = 0, n = pts.length - 1; i <= n; i++) {
            res += this.binomial(i, n) * pts[i][field] * Math.pow(1 - t, n - i) * Math.pow(t, i);
        }
        return res;
    },

    /**
     * 绘制曲线
     * @param {Object} canvas 
     */
    draw(canvas) {
        canvas.width = 300;
        canvas.height = 300;
        let ctx = canvas.getContext('2d');
        ctx.translate(50, 250);
        ctx.beginPath();
        ctx.arc(- radius, - radius, radius, 0, 2 * Math.PI);
        ctx.fill();
        this.drawLine(new Date(), 3000, 200, ctx);
    },

    drawLine(date, time, dis, ctx) {  
        if (timeDis == time) {
            cancelAnimationFrame(animationId);
            return;
        } else if (timeDis > time) {
            ctx.clearRect(-50,-250,300,300);
            timeDis = time;
        } else {
            ctx.clearRect(-50,-250,300,300);
            timeDis = new Date() - date;
        }     
        point.x = this.getCommonBt(ps, timeDis / time) * dis;
        point.y = this.getCommonBt(ps, timeDis / time, 'y') * dis;
        // ctx.beginPath();
        // ctx.arc(point.x - radius, point.y - radius, radius, 0, 2 * Math.PI);
        // ctx.fill();
        ctx.save();
        ctx.translate(point.x, -point.y);
        ctx.beginPath();
        ctx.arc(-radius, -radius, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
        animationId = requestAnimationFrame(()=> {
            this.drawLine(date, time, dis, ctx);
        })
    }
}