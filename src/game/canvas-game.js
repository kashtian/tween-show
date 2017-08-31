export default class Game {
    constructor(options) {
        this.opts = Object.assign({
            cw: 500,
            ch: 500,
            parent: 'body'
        }, options);

        // 动画队列
        this.queue = [];
        // 图片缓存
        this.imgCache = {};
        // 动画是否正在进行中
        this.isAnimating = false;

        this.init();
    }

    // 初始化canvas
    init() {
        let canvas = document.createElement('canvas'),
            parent = document.querySelector(this.opts.parent);

        canvas.width = this.opts.cw;
        canvas.height = this.opts.ch;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        parent.appendChild(canvas);
    }

    // 清除canvas
    clear() {
        this.ctx.clearRect(0, 0, this.opts.cw, this.opts.ch);
    }

    // 加载并缓存图片
    loadImage(url) {
        return new Promise((resolve, reject) => {
            if (this.imgCache[url]) {
                resolve(this.imgCache[url]);
            }
            let img = new Image();
            img.onload = () => {
                this.imgCache[url] = img;
                resolve(img);
            }
            img.onerror = (err) => {
                console.log('img load error: ', err);
                reject(err);
            }
            img.src = url;
        })
    }

    // 动画函数(匀速动画)
    animate(opts) {
        if (this.isAnimating) {
            this.queue.push(opts);
            return;
        }
        this.isAnimating = true;
        let date = Date.now(),
            dis = opts.vt - opts.v0,
            a = dis / opts.time,
            tDiff = 0,
            uDis = 0;

        function go() {
            tDiff = Date.now() - date;
            if (tDiff >= opts.time) {
                this.isAnimating = false;
                this.runQueue();
                return;
            } 
            uDis = opts.v0 + a * tDiff;
            if (a < 0 && uDis < opts.vt || (a > 0 && uDis > opts.vt)) {
                uDis = opts.vt;
            }
            opts.cb(uDis);
            requestAnimationFrame(() => {
                go.call(this);
            })
        }
        go.call(this);
    }

    // 执行动画队列
    runQueue() {
        if (this.queue.length) {
            let opts = this.queue.shift();
            this.animate(opts);
        }
    }

    // 检查动画队列是否执行完毕
    isAnimateEnd() {
        return !this.queue.length && !this.isAnimating;
    }

    // 给canvas添加事件
    addEvent(type, handler) {
        this.canvas.addEventListener(type, handler)
    }
}