export default {
    /**
     * 公式：B(t)=P0(1-t)³+3P1t(1-t)²+3P2t²(1-t)+P3t³,  t∈[0,1]
     */
    getPoints(ps, pointNum, dis) {
        let arr = [], t = 0;
        dis = dis || 1;
        for (let i = 0; i < pointNum; i++) {
            t = i / (pointNum - 1);
            arr[i] = {
                x: this.getBt(ps, t) * dis,
                y: -this.getBt(ps, t, 'y') * dis
            }
        }
        return arr;
    },

    /**
     * 根据公式求值
     * @param {Array} ps 三次贝塞尔曲线中的点
     * @param {Number} t 曲率
     * @param {String} field 'x' || 'y'
     */
    getBt(ps, t, field) {
        let a, b, c, tSquared = t * t, tCubed = t * tSquared;
        field = field || 'x';

        c = 3 * (ps[1][field] - ps[0][field]);
        b = 3 * (ps[2][field] - ps[1][field]) - c;
        a = ps[3][field] - ps[0][field] - c - b;

        return a * tCubed + b * tSquared + c * t + ps[0][field];
    },

    /**
     * 绘制曲线
     * @param {Object} canvas 
     */
    draw(canvas) {
        canvas.width = 300;
        canvas.height = 300;
        let ctx = canvas.getContext('2d'),
            ps = [
                {x: 0, y: 0},
                {x: 0.05, y: 1.03},
                {x: 0.42, y: 1.23},
                {x: 1, y: 1}
            ],
            radius = 2;
        let points = this.getPoints(ps, 20, 200);
        ctx.translate(50, 250);
        points.forEach(v => {
            ctx.beginPath();
            ctx.arc(v.x - radius, v.y - radius, radius, 0, 2 * Math.PI);
            ctx.fill();
        })
    }
}