export default {
    name: 'picker',

    data() {
        return {
            list: [],
            itemH: 30,
            r: 100,
            boxStyle: null,
            dis: 0,
            test: [],
            realDis: 0,
            curIndex: 0,
        }
    },

    created() {
        this.initList();
        this.initSemicircle();
    },

    methods: {
        initList() {
            for (let i = 0; i <= 50; i++) {
                this.list.push({
                    value: i
                })
            }
        },

        initSemicircle() {
            let deg = this.getDeg();

            for (let i = 0; i < this.list.length; i++) {
                
                if (deg * i > 180) {
                    this.list[i].hidden = true;
                }
                this.list[i].deg = deg * i;
                this.list[i].style = `transform: rotateX(${-deg * i}deg) translateZ(${this.r}px);`;
                
                this.test.push(this.list[i]);
            }
        },

        getDeg() {
            return Math.ceil(Math.asin(this.itemH / 2 / this.r) * 2 * 180 / Math.PI);
        },

        start(event) {
            let touch = event.changedTouches[0];
            this.startY = touch.screenY;
            this.startTime = Date.now();
        },

        move(event) {
            let touch = event.changedTouches[0],
                dis = this.dis + this.startY - touch.screenY;

            if (dis < 0) {
                dis = 0;
            } else if (dis > 900) {
                dis = 900;
            }
            this.realDis = dis;
            this.boxStyle = {
                transform: `rotateX(${dis}deg) rotateY(0deg)`,
                transition: `all 0s`
            }
            
            
        },

        end(event) {
            let touch = event.changedTouches[0],
                dis = this.dis + this.startY - touch.screenY,
                time = 0;
            if (Date.now() - this.startTime > 500) {
                time = 100;
            } else {
                dis = dis * 2;
                time = 1000;
            }
            if (dis < 0) {
                dis = 0;
            } else if (dis > 900) {
                dis = 900;
            }
            this.curIndex = Math.round(Math.abs(dis) / this.getDeg());
            this.animate({
                v0: this.realDis,
                vt:  (dis > 0 ? this.curIndex * this.getDeg() : -this.curIndex * this.getDeg()),
                time: time,
                cb: (value) => {                  
                    this.realDis = this.dis = value;
                    this.boxStyle = {
                        transform: `rotateX(${this.dis}deg) rotateY(0deg)`
                    }
                }
            })
        },

        animate(opts) {
            let date = Date.now(),
                dis = opts.vt - opts.v0,
                a = dis / opts.time,
                tDiff = 0,
                uDis = 0;
                console.log('v0: ', opts.v0);
                console.log('vt: ', opts.vt)
    
            function go() {
                console.log('go');
                tDiff = Date.now() - date;
                if (tDiff >= opts.time) {
                    uDis = opts.vt;
                    opts.cb(uDis);
                    return;
                } 
                uDis = opts.v0 + a * tDiff;
                if (a < 0 && uDis < opts.vt || (a > 0 && uDis > opts.vt)) {
                    uDis = opts.vt;
                }
                console.log('uDis: ', uDis);
                opts.cb(uDis);
                opts.aid = requestAnimationFrame(() => {
                    go.call(this);
                })
            }
            go.call(this);
        }
    }
}