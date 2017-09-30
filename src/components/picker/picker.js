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
                time = 2000;
            }
            if (dis < 0) {
                dis = 0;
            } else if (dis > 900) {
                dis = 900;
            }
            this.curIndex = Math.round(Math.abs(dis) / this.getDeg());
            this.realDis = this.dis = (dis > 0 ? this.curIndex * this.getDeg() : -this.curIndex * this.getDeg());
            this.boxStyle = {
                transform: `rotateX(${this.dis}deg) rotateY(0deg)`,
                transition: `transform ${time}ms`
            }
        }
    }
}