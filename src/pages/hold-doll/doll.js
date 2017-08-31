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
            dolls: [],
            cache: {},
            queue: []
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
                }, 500);
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
            let doll = null, item = null, index = null;
            for (let i = 0; i < this.dolls.length; i++) {
                item = this.dolls[i];
                if (event.offsetX >= item.x[0] && event.offsetX <= item.x[1] && event.offsetY >= item.y[0] && event.offsetY <= item.y[1]) {
                    console.log('item: ', item);
                    index = i;
                    doll = {x: item.x[0], y: item.y[0]};
                    break;
                }
            }
            if (!doll) {
                return;
            }
            this.stopSwing();
            this.clear();
            this.loadBg();
            this.loadDoll();
            this.moveToTarget(doll, index);
        },

        moveToTarget(pos, index) {
            this.addAnimation({
                cb: (v) => {
                    this.clear();
                    this.loadBg();
                    this.loadDoll();
                    this.drawClaws({
                        x: v
                    })
                },
                v0: this.opts.cw / 2 - 108 / 2,
                vt: pos.x - (108 - 78)/2,
                time: (index == 1 || index == 4) ? 0 : 2000
            })
            this.addAnimation({
                cb: (v) => {
                    this.clear();
                    this.loadBg();
                    this.loadDoll();
                    this.drawClaws({
                        x: pos.x - (108 - 78)/2,
                        lh: v
                    })
                },
                v0: 15,
                vt: pos.y - 152 / 2 - 15,
                time: 2000
            })
            this.addAnimation({
                cb: (v) => {
                    this.clear();
                    this.loadBg();
                    this.loadDoll(index, v);
                    this.drawClaws({
                        x: pos.x - (108 - 78)/2,
                        lh: v,
                        isClose: true
                    })
                },
                v0: pos.y - 152 / 2 - 15,
                vt: 15,
                time: 2000
            })
            this.startAnimation();
        },

        addAnimation(opts) {
            this.queue.push(opts);
        },

        startAnimation() {
            if (this.queue.length) {
                let opts = this.queue.shift();
                this.uniformMotion(opts);
            }
        },

        uniformMotion(opts) {
            let date = Date.now(),
                dis = opts.vt - opts.v0,
                a = dis / opts.time,
                tDiff = 0,
                uDis = 0;

            function go() {
                tDiff = Date.now() - date;
                if (tDiff >= opts.time) {
                    this.startAnimation();
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
        },

        loadDoll(index, v) {
            let dollw = 78,
                dollh = 112,
                count = 6,
                half = count / 2,
                x = 15,
                y = this.opts.ch / 2 - dollh + 20,
                margin = (this.opts.cw - x * 2 - dollw * half) / (half - 1),
                dx = 0,
                dy = 0;
                this.dolls.length = 0;

            for (let i = 0; i < count; i++) {
                dx = x + (i % half) * (dollw + margin);
                if (i == index) {
                    dy = v + dollh;
                } else {
                    dy = i < half ? y : y + dollh + 10;
                }
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
                x: this.opts.cw / 2 - 108 / 2,
                lh: 15
            }, cOpts);

            let sy = cOpts.isClose ? 152 : 0;

            this.loadImage({
                url: '/images/claws-top.png',
                w: 36,
                h: 15,
                x: cOpts.x + (108 - 36) / 2,
                y: 93
            })
            this.loadImage({
                url: '/images/claws-line.png',
                x: cOpts.x + (108 - 10) / 2,
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
                dx: cOpts.x,
                dy: 93 + 8 + cOpts.lh,
                dw: 108,
                dh: 152 / 2,
                isSlice: true
            })
        },

        loadImage(opts) {
            opts = Object.assign({
                x: 0,
                y: 0
            }, opts);
            let ctx = this.ctx;
            if (this.cache[opts.url]) {
                if (opts.isSlice) {
                    ctx.drawImage(this.cache[opts.url], opts.sx, opts.sy, opts.sw, opts.sh, opts.dx, opts.dy, opts.dw, opts.dh);
                } else {
                    ctx.drawImage(this.cache[opts.url], opts.x, opts.y, opts.w, opts.h);
                }
                return;
            }
            let img = new Image();
            img.onload = () => {
                this.cache[opts.url] = img;
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