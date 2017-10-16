export default {
    name: 'picker',

    props: ['list', 'value', 'options', 'displayFn', 'valueField', 'nameField', 'isPlain'],

    data() {
        return {
            arr: [],
            opts: Object.assign({
                itemH: 30,  // 每个元素的高度
                r: 100,     // 半径
                buffer: 30  // 到达边界的动画缓冲值
            }, this.options),
            curValue: {},   // 当前选中的值
            boxStyle: null,
            curIndex: 0,
            scrollY: 0,     // 已经滚动的值
            realY: 0      // 实时滚动值
        }
    },

    mounted() {
        this.arr = this.initList();
        this.setScrollByValue(this.value);
    },

    computed: {
        unitDeg() {
            // 根据列表元素的高度和半径，算出单位角度
            return Math.ceil(Math.asin(this.opts.itemH / 2 / this.opts.r) * 2 * 180 / Math.PI) || 0;
        },

        maxDeg() {
            if (!this.list) {
                return 0;
            }
            return this.unitDeg * (this.list.length - 1);
        }
    },

    watch: {
        value(val) {
            if (val) {
                this.setScrollByValue(val);
            }            
        },

        curValue(val) {
            if (!val) {
                return;
            }
            let curVal = this.getValue();
            if (this.value == curVal) {
                return;
            }
            this.$emit('input', curVal);
        }
    },

    methods: {
        // 遍历数组，设置每个元素的style, 形成以x为轴的圆形
        initList() {
            if (!Array.isArray(this.list)) {
                return [];
            }
            let deg = this.unitDeg,
                obj = {};

            return this.list.map((v, i) => {
                obj.hidden = (deg * i > 180);
                obj.deg = deg * i;
                obj.style = `height: ${this.opts.itemH}px; margin-top: ${-this.opts.itemH / 2}px; transform: rotateX(${-deg * i}deg) translateZ(${this.opts.r}px);`;
                return Object.assign({}, this.isPlain ? {value: v} : v, obj)
            })
        },

        // 获取当前选项的名称
        getName(val) {
            if (this.nameField) {
                return val[this.nameField];
            } else if (typeof this.displayFn == 'function') {
                return this.displayFn(val);
            } else if (this.isPlain) {
                return val.value;
            }
            return '';
        },

        // 获取当前选项的值
        getValue() {
            if (this.valueField) {
                return this.curValue[this.valueField];
            } else if (this.isPlain) {
                return this.curValue.value;
            }
            return this.curValue;
        },

        // 根据传入的值获取index
        getIndex(value) {
            if (this.valueField || !this.isPlain) {
                for (let i = 0; i < this.list.length; i++) {
                    if (this.valueField) {
                        if (value == this.list[i][this.valueField]) {
                            return i;
                        }
                    } else {
                        if (value == this.list[i]) {
                            return i;
                        }
                    }                    
                }
                return -1;
            } else {
                return this.list.indexOf(value);
            }
        },

        // 根据传入的值将picker滚动至相应的位置
        setScrollByValue(val) {
            let index = this.getIndex(val);
            if (index > -1) {
                this.scrollY = this.realY = index * this.unitDeg;
                this.setBoxRotate(this.realY);
            }
        },

        // 设置容器的旋转角度
        setBoxRotate(deg) {
            this.boxStyle = {
                transform: `rotateX(${deg}deg)`
            }
        },

        // 记录手指开始滑动的位置和时间
        start(event) {
            let touch = event.changedTouches[0];
            this.startY = touch.screenY;
            this.startTime = Date.now();
            cancelAnimationFrame(this.aid);
        },

        // 记录手指滑动中的位置，并滚动元素
        move(event) {
            event.preventDefault();
            let touch = event.changedTouches[0],
            dis = this.scrollY + this.startY - touch.screenY;

            if (dis < -this.opts.buffer) {
                dis = -this.opts.buffer;
            } else if (dis > this.maxDeg + this.opts.buffer) {
                dis = this.maxDeg + this.opts.buffer;
            }
            this.realY = dis;
            this.setBoxRotate(dis);
        },

        // 手指滑动结束，根据手指滑动的时间及距离滚动元素
        end(event) {
            let touch = event.changedTouches[0],
            // 手指滑动的距离
            moveDis = this.startY - touch.screenY,
            dis = this.scrollY + moveDis,
            // picker滚动时长
            time = 0,
            // picker可见总高度
            total = this.opts.r * 2;

            if (Date.now() - this.startTime > 500) {
                time = 500;
            } else {
                dis = this.scrollY + (moveDis / total * 720);
                time = 1000;
            }
            if (dis < 0) {
                dis = 0;
            } else if (dis > this.maxDeg) {
                dis = this.maxDeg;
            }

            this.curIndex = Math.round(Math.abs(dis) / this.unitDeg);
            this.animate({
                s0: this.realY,
                st:  (dis > 0 ? this.curIndex * this.unitDeg : -this.curIndex * this.unitDeg),
                time: time,
                cb: (value, isEnd) => {                  
                    this.realY = this.scrollY = value;
                    this.setBoxRotate(this.scrollY);
                    if (isEnd) {
                        this.curValue = this.arr[this.curIndex];
                    }
                }
            })
        },

        // 获得匀减速运动位移函数
        getVariableMotionFn(dis, time) {
            let a = -2 * dis / Math.pow(time, 2),
                v0 = -a * time;
            // s0初始位置，t运动时间
            return function(s0, t) {
                return s0 + v0 * t + a * Math.pow(t, 2) / 2;
            }
        },

        // 匀减速运动动画函数
        animate(opts) {
            let date = Date.now(),
                dis = opts.st - opts.s0,
                tDiff = 0,
                uDis = 0,
                getMotionDis = this.getVariableMotionFn(dis, opts.time);
    
            function go() {
                tDiff = Date.now() - date;
                if (tDiff >= opts.time) {
                    uDis = opts.st;
                    opts.cb(uDis, true);
                    return;
                } 
                uDis = getMotionDis(opts.s0, tDiff);
                if (dis < 0 && uDis < opts.st || (dis > 0 && uDis > opts.st)) {
                    uDis = opts.st;
                }
                opts.cb(uDis);
                this.aid = requestAnimationFrame(() => {
                    go.call(this);
                })
            }
            go.call(this);
        },
    
    }
}