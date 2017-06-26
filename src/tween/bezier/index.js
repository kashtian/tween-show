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
    }
}
