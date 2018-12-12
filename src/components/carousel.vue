<template>
  <div class="scroller" @touchstart="start" @touchmove="move" @touchend="end">
    <div class="ul" :style="styleObj">
      <div class="li" v-for="(item, index) in list" :key="index" @click.stop="itemClick(item)">
        <slot :item="item"></slot>
      </div>
    </div>
    <div class="dots" v-if="opts.haveDot && (list.length > 1)" @touchstart.stop @touchmove.stop @touchend.stop>
      <span class="nav-dot" v-for="(item, index) in imgList" :key="index" :class="{active: activeIndex == index}"></span>
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
        speed: 0.3, // unit: second
        allowV: 20,
        interval: 5000, // unit: ms
        haveDot: false,
        minDis: 5
      }, this.options),
      pos: {},
      styleObj: {
        transform: 'translate3d(0, 0, 0)'
      },
      cur: 0,
      activeIndex: 0,
      boxwidth: 0
    }
  },
  mounted() {
    this.boxwidth = this.$el.offsetWidth
    if (this.opts.loop && this.imgList.length > 1) {
      this.cur = 1
      this.scroll(-this.boxwidth, true)
    }
    this.opts.auto && this.autoPlay()
    this.resizefn = () => {
      this.boxwidth = this.$el.offsetWidth
      this.scroll(-this.boxwidth * this.cur, true)
    }
    window.addEventListener('resize', this.resizefn)
  },
  beforeDestroy() {
    if (this.intervalId) {
      this.intervalId = clearInterval(this.intervalId)
    }
    window.removeEventListener('resize', this.resizefn)
  },
  watch: {
    cur: function (val) {
      this.opts.haveDot && this.setDotActive()
      this.opts.onChange && this.opts.onChange(this.list[val], val)
    },

    imgList: function () {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      this.cur = (this.opts.loop && this.imgList.length > 1) ? 1 : 0
      this.scroll(-this.boxwidth * this.cur, true)
      this.opts.auto && this.autoPlay()
    }
  },
  computed: {
    list() {
      let oldList = this.imgList
      let list = []
      if (Array.isArray(oldList)) {
        Object.assign(list, oldList)
      }
      if (list.length > 1 && this.opts.loop) {
        list.unshift(oldList[oldList.length - 1])
        list.push(oldList[0])
      }
      return list
    }
  },
  methods: {
    start(event) {
      if (this.intervalId) {
        clearInterval(this.intervalId)
      }
      if (this.opts.loop && this.list.length > 1) {
        this.reset()
      }
      let touch = event.targetTouches[0]
      this.pos.x = touch.screenX
      this.pos.y = touch.screenY
      this.pos.transX = parseInt(this.getTransX())
      this.date = new Date()
    },

    getAngle(angx, angy) {
      return Math.atan2(angy, angx) * 180 / Math.PI
    },

    move(event) {
      if (event.targetTouches.length > 1) {
        return
      }
      let touch = event.targetTouches[0]
      // let angle = this.getAngle(touch.screenX - this.pos.x, touch.screenY - this.pos.y)

      // 纵向滑动
      if (!this.isHorizontal(touch)) {
        return
      }
      event.preventDefault()
      let dis = touch.screenX - this.pos.x + this.pos.transX
      let noAnimate = true
      if (!this.opts.loop || (this.opts.loop && this.list.length < 2)) {
        if ((this.cur == 0 && touch.screenX > this.pos.x) || (this.cur == this.list.length - 1 && touch.screenX < this.pos.x)) {
          noAnimate = false
        }
        if (dis > (this.pos.transX + this.opts.allowV) && this.cur == 0) {
          dis = this.pos.transX + this.opts.allowV
        }
        if (dis < (this.pos.transX - this.opts.allowV) && this.cur == (this.list.length - 1)) {
          dis = this.pos.transX - this.opts.allowV
        }
      }
      this.scroll(dis, noAnimate)
    },

    end(event) {
      let interval = (new Date() - this.date) / 1000
      let touch = event.changedTouches[0]
      if (this.isHorizontal(touch)) {
        let dis = touch.screenX - this.pos.x
        let max = this.list.length - 1
        if (Math.abs(dis) > this.opts.minDis) {
          if ((interval > 1 && Math.abs(dis) > this.boxwidth / 2) || interval < 1) {
            if (dis > 0) {
              this.cur = this.cur - 1 < 0 ? 0 : this.cur - 1
            } else {
              this.cur = this.cur + 1 > max ? max : this.cur + 1
            }
          }
        }
      }

      this.scroll(-this.boxwidth * this.cur)
      this.opts.auto && this.autoPlay()
    },

    autoPlay() {
      if (this.list.length < 2) {
        return
      }
      let max = this.list.length - 1
      this.intervalId = setInterval(() => {
        if (this.opts.loop && this.cur == max) {
          this.reset()
        }
        this.cur += 1
        if (this.cur > max) {
          this.cur = 0
        }
        setTimeout(() => {
          this.scroll(-this.boxwidth * this.cur)
        }, 100)
      }, this.opts.interval)
    },

    scroll(dis, noAnimate) {
      let speed = noAnimate ? 0 : this.opts.speed
      this.styleObj.transform = `translate3d(${dis}px, 0, 0)`
      this.styleObj['transition-duration'] = `${speed}s`
    },

    reset() {
      let max = this.list.length - 1
      if (this.cur == 0) {
        this.cur = this.list.length - 2
        this.scroll(-this.boxwidth * this.cur, true)
      } else if (this.cur == max) {
        this.cur = 1
        this.scroll(-this.boxwidth * this.cur, true)
      }
    },

    isHorizontal(touch) {
      return Math.abs(touch.screenX - this.pos.x) >= Math.abs(touch.screenY - this.pos.y)
    },

    setDotActive() {
      if (this.opts.loop) {
        if (this.cur == 0) {
          this.activeIndex = this.imgList.length - 1
        } else if (this.cur == (this.list.length - 1)) {
          this.activeIndex = 0
        } else {
          this.activeIndex = this.cur - 1
        }
      } else {
        this.activeIndex = this.cur
      }
    },

    getTransX() {
      let arr = this.styleObj.transform.match(/translate3d\((-?\d+)px/)
      if (arr) {
        return arr[1]
      }
      return '0'
    },

    itemClick(item) {
      this.$emit('itemClick', item)
    }
  }
}
</script>

<style lang="less" scoped>
.scroller {
  position: relative;
  overflow: hidden;
  mask-image: -webkit-radial-gradient(white, black);
  .ul {
    height: 100%;
    margin: 0px;
    padding: 0px;
    white-space: nowrap;
    transition-property: transform;
    .li {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      text-align: center;
    }
  }
  .dots {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 100%;
    text-align: right;
    font-size: 0px;
  }
  .nav-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 5px;
    border-radius: 100%;
    background-color: rgba(255,255,255,.3);
    &:last-child {
      margin: 0px;
    }
    &.active {
      background-color: #fff;
    }
  }
}
</style>
