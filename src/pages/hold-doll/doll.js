export default {
    name: 'doll',
    route: {
        path: '/doll',
        title: '抓娃娃'
    },

    props: {
        options: Object
    },

    data() {
        return {
            opts: Object.assign({
                cw: 305,
                ch: 473
            }, this.options),
            swingTime: 500,
            dolls: []
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.canvas = this.$refs.stage;
            this.ctx = this.canvas.getContext('2d');
            this.canvas.width = this.opts.cw;
            this.canvas.height = this.opts.ch;
            this.draw(true, true);
        },

        clear() {
            this.ctx.clearRect(0, 0, this.opts.cw, this.opts.ch);
        },

        stopSwing() {
            clearTimeout(this.timeoutId);
        },

        draw(isSwing, isClose) {
            this.clear();
            isClose = !isClose;
            this.loadBg();
            this.loadDoll();
            this.drawClaws({ isClose: isClose });
            if (isSwing) {
                this.timeoutId = setTimeout(() => {
                    this.draw(isSwing, isClose);
                }, 1000);
            }
        },

        loadBg() {
            this.loadImage({
                url: '/images/bg_main.png',
                w: this.opts.cw,
                h: this.opts.ch
            })
        },

        catchDoll(event) {
            console.log(event);
            let doll = null, item = null;
            for (let i = 0; i < this.dolls.length; i++) {
                item = this.dolls[i];
                if (event.offsetX >= item.x[0] && event.offsetX <= item.x[1] && event.offsetY >= item.y[0] && event.offsetY <= item.y[1]) {
                    console.log('item: ', item);
                    doll = {x: item.x[0], y: item.y[0]};
                    break;
                }
            }
            if (!doll) {
                return;
            }
            this.stopSwing();
            // this.loadBg();
            // this.loadDoll();
            // this.drawClaws();
        },

        loadDoll() {
            let dollw = 78,
                dollh = 112,
                count = 6,
                half = count / 2,
                x = 15,
                y = this.opts.ch / 2 - dollh + 20,
                margin = (this.opts.cw - x * 2 - dollw * half) / (half - 1),
                dx = 0,
                dy = 0;

            for (let i = 0; i < count; i++) {
                dx = x + (i % half) * (dollw + margin);
                dy = i < half ? y : y + dollh + 10;
                this.dolls.push({
                    x: [dx, dx + dollw],
                    y: [dy, dy + dollh]
                })
                this.loadImage({
                    url: i % 2 == 0 ? '/images/doll1.png' : '/images/doll2.png',
                    x: dx,
                    y: dy,
                    w: dollw,
                    h: dollh
                })
            }
        },

        drawClaws(cOpts) {
            cOpts = Object.assign({
                isClose: false,
                x: this.opts.cw / 2,
                lh: 15
            }, cOpts);
            let sy = cOpts.isClose ? 152 : 0;
            this.loadImage({
                url: '/images/claws-top.png',
                w: 36,
                h: 15,
                x: cOpts.x - 18,
                y: 93
            })
            this.loadImage({
                url: '/images/claws-line.png',
                x: cOpts.x - 5,
                y: 93 + 13,
                w: 10,
                h: cOpts.lh
            })
            this.loadImage({
                url: '/images/claws.png',
                sx: 0,
                sy: sy,
                sw: 216,
                sh: 152,
                dx: cOpts.x - 108 / 2,
                dy: 93 + 8 + cOpts.lh,
                dw: 108,
                dh: 152 / 2,
                isSlice: true
            })
        },

        loadImage(opts) {
            let ctx = this.ctx;
            opts = Object.assign({
                x: 0,
                y: 0
            }, opts);
            let img = new Image();
            img.onload = () => {
                if (opts.isSlice) {
                    ctx.drawImage(img, opts.sx, opts.sy, opts.sw, opts.sh, opts.dx, opts.dy, opts.dw, opts.dh);
                } else {
                    ctx.drawImage(img, opts.x, opts.y, opts.w, opts.h);
                }
            }
            img.onerror = (err) => {
                console.log('img load error: ', err);
            }
            img.src = opts.url;
        },

    }
}