<template>
    <div class="scroller" @touchstart="start" @touchmove="move" @touchend="end">
        <ul :style="styleObj">
            <li v-for="(item, index) in list" :key="index" :class="{autoH: opts.isAutoH}">
                <a :href="opts.urlField ? item[opts.urlField] : false" target="_blank"><img :src="item[opts.field]" /></a>
            </li>
        </ul>
        <div class="dots" v-if="opts.haveDot && (list.length > 1)" @touchstart.stop @touchmove.stop @touchend.stop>
            <span v-for="(item, index) in imgList" :key="index" :class="{active: activeIndex == index}"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'carousel',
    props: {
        options: Object,
        imgList: Array
    },
    data() {
        return {
            opts: Object.assign({
                auto: false,
                loop: false,
                speed: 0.3,  //unit: second
                allowV: 20,
                interval: 5000, //unit: ms
                haveDot: false,
                minDis: 5,
                field: 'url' // 图片地址默认字段
            }, this.options),
            pos: {},
            styleObj: {
                transform: 'translate3d(0, 0, 0)'
            },
            cur: 0,
            activeIndex: 0
        }
    },
    mounted() {    
        if (this.opts.loop && this.list.length > 1) {
            let itemW = this.$el.offsetWidth;
            this.cur = 1;
            this.scroll(-itemW, true);
        }
        this.opts.auto && this.autoPlay();
    },
    watch: {
        cur: function (val) {
            this.opts.haveDot && this.setDotActive();
            this.opts.onChange && this.opts.onChange(this.list[val], val);
        },

        imgList: function() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            let itemW = this.$el.offsetWidth;
            this.cur = (this.opts.loop && this.list.length > 1) ? 1 : 0;          
            this.scroll(-itemW * this.cur, true);
            this.opts.auto && this.autoPlay();
        }
    },
    computed: {
        list() {
            let oldList = this.imgList;
            let list = [];
            if (Array.isArray(oldList)) {
                Object.assign(list, oldList);
            }
            if (list.length > 1 && this.opts.loop) {
                list.unshift(oldList[oldList.length - 1]);
                list.push(oldList[0]);
            }
            return list;
        }
    },
    methods: {
        start(event) {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            if (this.opts.loop && this.list.length > 1) {
                this.reset();
            }
            let touch = event.targetTouches[0];
            this.pos.x = touch.screenX;
            this.pos.y = touch.screenY;
            this.pos.transX = parseInt(this.getTransX());
            this.date = new Date();
        },
        
        getAngle(angx, angy) {
            return Math.atan2(angy, angx) * 180 / Math.PI;
        },

        move(event) {
            if (event.targetTouches.length > 1) {
                return;
            }
            let touch = event.targetTouches[0],
                angle = this.getAngle(touch.screenX - this.pos.x, touch.screenY - this.pos.y);

            // 纵向滑动
            if (angle >= -135 && angle <= -45 || (angle > 45 && angle < 135)) {                
                return;
            }
            event.preventDefault();
            let dis = touch.screenX - this.pos.x + this.pos.transX;
            let noAnimate = true;
            if (!this.opts.loop || (this.opts.loop && this.list.length < 2)) {
                if (this.cur == 0 && touch.screenX > this.pos.x || (this.cur == (this.list.length - 1)) && touch.screenX < this.pos.x) {
                    noAnimate = false;
                }
                if (dis > (this.pos.transX + this.opts.allowV) && this.cur == 0) {
                    dis = this.pos.transX + this.opts.allowV;
                }
                if (dis < (this.pos.transX - this.opts.allowV) && this.cur == (this.list.length - 1)) {
                    dis = this.pos.transX - this.opts.allowV;
                }
            }
            this.scroll(dis, noAnimate);
        },

        end(event) {
            let interval = (new Date() - this.date) / 1000;
            let touch = event.changedTouches[0];
            let itemW = this.$el.offsetWidth;
            if (this.isHorizontal(touch)) {
                let dis = touch.screenX - this.pos.x;
                let max = this.list.length - 1;
                if (Math.abs(dis) > this.opts.minDis) {
                    if ((interval > 1 && Math.abs(dis) > itemW / 2) || interval < 1) {
                        if (dis > 0) {
                            this.cur = this.cur - 1 < 0 ? 0 : this.cur - 1;
                        } else {
                            this.cur = this.cur + 1 > max ? max : this.cur + 1;
                        }
                    }            
                }
            }
            
            this.scroll(-itemW * this.cur);
            this.opts.auto && this.autoPlay();
        },

        autoPlay() {
            if (this.list.length < 2) {
                return;
            }
            let itemW = this.$el.offsetWidth;
            let max = this.list.length - 1;
            this.intervalId = setInterval(() => {
                if (this.opts.loop && this.cur == max) {
                    this.reset();
                }
                this.cur += 1;
                if (this.cur > max) {
                    this.cur = 0;
                }
                setTimeout(() => {
                    this.scroll(-itemW * this.cur);
                }, 100);

            }, this.opts.interval);
        },

        scroll(dis, noAnimate) {
            let speed = noAnimate ? 0 : this.opts.speed;
            this.styleObj.transform = `translate3d(${dis}px, 0, 0)`;
            this.styleObj['transition-duration'] = `${speed}s`;
        },

        reset() {
            let itemW = this.$el.offsetWidth;
            let max = this.list.length - 1;
            if (this.cur == 0) {
                this.cur = this.list.length - 2;
                this.scroll(-itemW * this.cur, true);
            } else if (this.cur == max) {
                this.cur = 1;
                this.scroll(-itemW * this.cur, true);
            }
        },

        isHorizontal(touch) {
            return Math.abs(touch.screenX - this.pos.x) >= Math.abs(touch.screenY - this.pos.y);
        },

        setDotActive() {
            let dots = this.$el.querySelectorAll('.dots span');
            this.activeIndex = this.cur;
            if (this.opts.loop) {
                this.activeIndex = this.cur - 1;
                if (this.cur == 0) {
                    this.activeIndex = dots.length - 1;
                }
                if (this.cur == (this.list.length - 1)) {
                    this.activeIndex = 0;
                }
            }
        },

        getTransX() {
            let arr = this.styleObj.transform.match(/translate3d\((\-?\d+)px/);
            if (arr) {
                return arr[1];
            }
            return '0';
        }
    }
}
</script>

<style lang="scss" scoped>
.scroller {
    position: relative;
    overflow: hidden;
    ul {
        height: 100%;
        margin: 0px;
        padding: 0px;
        white-space: nowrap;
        transition-property: transform;
        li {            
            width: 100%;
            height: 100%;
            display: inline-block;
            vertical-align: top;
            text-align: center;
            a, img {
                height: 100%;
                vertical-align: top;
            }
            a {
                display: inline-block;
            }
            &.autoH {
                display: inline-flex;
                align-items: center;
                a, img {
                    height: auto;
                }
            }
        }
    }
    .dots {
        position: absolute;
        bottom: 10px;
        right: 0px;
        width: 100%;
        text-align: center;
        font-size: 0px;
        span {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin-right: 5px;
            border-radius: 100%;
            background-color: #EBEBEB;
            &:last-child{
                margin: 0px;
            }
            &.active {
                background-color: #F55B65;
            }
        }
    }
}
</style>