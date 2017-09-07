import Game from '../../game/canvas-game.js';

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

    beforeDestroy() {
        this.stopSwing();
        this.dGame.clearQueue();
    },

    methods: {
        init() {
            this.dGame = new Game({
                parent: '.doll-game',
                cw: this.opts.cw,
                ch: this.opts.ch
            })
            this.dGame.addEvent('click', event => {
                this.catchDoll(event);
            })
            this.ctx = this.dGame.ctx;
            this.initDolls();
            this.draw(true, true);
        },

        initDolls() {
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
                    dy = i < half ? y : y + dollh + 10;                    
                    this.dolls.push({
                        x: [dx, dx + dollw],
                        y: [dy, dy + dollh],
                        dx: dx,
                        dy: dy,
                        w: dollw,
                        h: dollh
                    })
                }
        },

        stopSwing() {
            clearTimeout(this.timeoutId);
        },

        draw(isSwing, isClose) {
            this.dGame.clear();
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
            this.dGame.loadImage('/images/bg_main.png').then(img => {
                this.ctx.drawImage(img, 0, 0, this.opts.cw, this.opts.ch);
            })
        },

        catchDoll(event) {
            if (!this.dGame.isAnimateEnd()) {
                return;
            }
            let doll = null, item = null, index = null;
            for (let i = 0; i < this.dolls.length; i++) {
                item = this.dolls[i];
                if (event.offsetX >= item.x[0] && event.offsetX <= item.x[1] && event.offsetY >= item.y[0] && event.offsetY <= item.y[1]) {
                    index = i;
                    doll = {x: item.x[0], y: item.y[0]};
                    break;
                }
            }
            if (!doll) {
                return;
            }
            this.stopSwing();
            this.dGame.clear();
            this.loadBg();
            this.loadDoll();
            this.moveToTarget(doll, index);
        },

        moveToTarget(pos, index) {
            this.dGame.animate({
                cb: (v) => {
                    this.dGame.clear();
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
            this.dGame.animate({
                cb: (v) => {
                    this.dGame.clear();
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
            this.dGame.animate({
                cb: (v) => {
                    this.dGame.clear();
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
        },

        loadDoll(index, v) {
            let dy = 0, item = null;
            this.dolls.forEach((item, i) => {
                this.dGame.loadImage(i % 2 == 0 ? '/images/doll1.png' : '/images/doll2.png').then(img => {
                    dy = i == index ? v + item.h : item.dy
                    this.ctx.drawImage(img, item.dx, dy, item.w, item.h);
                });
            })
        },

        drawClaws(cOpts) {
            cOpts = Object.assign({
                isClose: false,
                x: this.opts.cw / 2 - 108 / 2,
                lh: 15
            }, cOpts);

            let sy = cOpts.isClose ? 152 : 0;

            // {
            //     url: '/images/claws-top.png',
            //     w: 36,
            //     h: 15,
            //     x: cOpts.x + (108 - 36) / 2,
            //     y: 93
            // }

            this.dGame.loadImage('/images/claws-top.png').then(img => {
                this.ctx.drawImage(img, cOpts.x + (108 - 36) / 2, 93, 36, 15);
            })
            // {
            //     url: '/images/claws-line.png',
            //     x: cOpts.x + (108 - 10) / 2,
            //     y: 93 + 13,
            //     w: 10,
            //     h: cOpts.lh
            // }
            this.dGame.loadImage('/images/claws-line.png').then(img => {
                this.ctx.drawImage(img, cOpts.x + (108 - 10) / 2, 93 + 13, 10, cOpts.lh);
            })
            // {
            //     url: '/images/claws.png',
            //     sx: 0,
            //     sy: sy,
            //     sw: 216,
            //     sh: 152,
            //     dx: cOpts.x,
            //     dy: 93 + 8 + cOpts.lh,
            //     dw: 108,
            //     dh: 152 / 2
            // }
            this.dGame.loadImage('/images/claws.png').then(img => {
                this.ctx.drawImage(img, 0, sy, 216, 152, cOpts.x, 93 + 8 + cOpts.lh, 108, 152 / 2);
            })
        }

    }
}