<template>
  <div class="dir-picker"
    @touchstart="start" @touchmove="move" @touchend="end"
    @mousedown="start" @mousemove="move" @mouseup="end"
    :style="{height: this.opts.r * 2 + 'px'}">
      <div class="list-wrapper" :style="boxStyle">
        <div class="item" v-for="(item, index) in sList" :key="index" :style="item.style">{{getName(item)}}</div>
      </div>
      <div class="mask-wrapper" :style="{transform: 'translateZ(' + this.opts.r + 'px)'}">
        <div class="mask" :style="{height: (this.opts.r * 2 - this.opts.itemH - 2) / 2 + 'px'}"></div>
        <div class="line" :style="{height: this.opts.itemH + 'px'}"></div>
        <div class="mask reverse" :style="{height: (this.opts.r * 2 - this.opts.itemH - 2) / 2 + 'px'}"></div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'picker',

  props: ['list', 'value', 'options', 'displayFn', 'valueField', 'nameField', 'isPlain', 'isCycle'],

  data() {
    return {
      opts: Object.assign({
        itemH: 35, // 每个元素的高度
        r: 100, // 半径
        buffer: 30 // 到达边界的动画缓冲值
      }, this.options),
      curValue: {}, // 当前选中的值
      boxStyle: null,
      scrollY: 0, // 已经滚动的值
      sList: [],
      moveMap: {},
      count: 0
    }
  },

  mounted() {
    this.init()
  },

  computed: {
    // 滚动列表元素个数
    scrollLen() {
      return Math.floor(2 * Math.PI * this.opts.r / this.opts.itemH)
    },
    
    unitDeg() {
      // 根据列表元素的高度和半径，算出单位角度
      return 360 / this.scrollLen
    },

    // 滚动时展示的元素个数
    showlen() {
      return Math.ceil(this.opts.r * 2 / this.unitDeg)
    }
  },

  watch: {
    value(val) {
      if (val) {
        this.setScrollByValue(val)
      }
    },

    curValue(val) {
      if (!val) {
        return
      }
      let curVal = this.getValue(val)
      if (this.value == curVal) {
        return
      }
      this.$emit('input', curVal)
    },

    list() {
      this.init()
    }
  },

  methods: {
    init() {
      this.initList()

      if (this.value) {
        this.setScrollByValue(this.value)
      }
    },

    // 遍历数组，设置每个元素的style, 形成以x为轴的圆形
    initList() {
      if (!Array.isArray(this.list)) {
        return []
      }
      let tempList = []

      for (let i = 0; i < this.scrollLen; i++) {
        tempList.push({
          style: this.getItemStyle(this.unitDeg * i)
        })
      }
      this.sList = tempList

     this.setListValue(this.scrollY)
    },

    getItemStyle(deg) {
      return `height: ${this.opts.itemH}px; margin-top: ${-this.opts.itemH / 2}px; transform: rotateX(${-deg}deg) translateZ(${this.opts.r}px);`
    },

    // 根据滚动值赋值
    setListValue(y) {
      // 滚动列表当前index
      let start1 = Math.ceil(y / this.unitDeg % this.scrollLen)
      // 真实列表当前index
      let start2 = this.isCycle ? Math.ceil(y / this.unitDeg % this.list.length) : Math.ceil(y / this.unitDeg)
      
      if (this.moveMap[start1 + ',' + start2]) {
        return
      }
      let len = Math.ceil(this.showlen / 2) 
      let i = -len
      let sindex = 0
      let oindex = 0
      this.moveMap[start1 + ',' + start2] = true
      this.count++

      for (; i < len; i++) {
        sindex = this.getRealIndex(start1 + i, this.scrollLen)
        if (this.isCycle || (start2 + i >= 0 && start2 + i <= this.list.length - 1)) {          
          oindex = this.getRealIndex(start2 + i, this.list.length)
          this.sList[sindex] = Object.assign(this.sList[sindex], this.isPlain ? { value: this.list[oindex] } : this.list[oindex])
        } else {
          this.sList[sindex] = {
            style: this.sList[sindex].style
          }
        }        
      }
    },

    getRealIndex(index, len) {
      return (index + len) % len
    },

    // 获取当前选项的名称
    getName(val) {
      if (this.nameField) {
        return val[this.nameField]
      } else if (typeof this.displayFn == 'function') {
        return this.displayFn(val)
      } else if (this.isPlain) {
        return val.value
      }
      return ''
    },

    // 获取当前选项的值
    getValue(val) {
      if (this.valueField) {
        return val[this.valueField]
      } else if (this.isPlain) {
        return val.value
      }
      return val
    },

    // 根据传入的值获取index
    getIndex(value) {
      if (this.valueField || !this.isPlain) {
        for (let i = 0; i < this.list.length; i++) {
          if (this.valueField) {
            if (value == this.list[i][this.valueField]) {
              return i
            }
          } else {
            if (value == this.list[i]) {
              return i
            }
          }
        }
        return -1
      } else {
        return this.list.indexOf(value)
      }
    },

    // 根据传入的值将picker滚动至相应的位置
    setScrollByValue(val) {
      let index = this.getIndex(val)
      if (index > -1) {
        this.scrollY = index * this.unitDeg
        this.setBoxRotate(this.scrollY)
        this.setListValue(this.scrollY)
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
      let touch = event.changedTouches ? event.changedTouches[0] : event
      this.startY = touch.screenY
      this.startTime = Date.now()
      cancelAnimationFrame(this.aid)
      // 记录鼠标左键点击
      if (event.which == 1) {
        this.mouseleft = true
      }
      this.moveMap = {}
      this.count = 0
    },

    // 记录手指滑动中的位置，并滚动元素
    move(event) {
      if (!event.changedTouches && !this.mouseleft) {
        return
      }
      event.preventDefault()
      let touch = event.changedTouches ? event.changedTouches[0] : event
      let dis = this.scrollY + this.startY - touch.screenY
      if (!this.isCycle) {
        if (dis < -this.opts.buffer) {
          dis = -this.opts.buffer
        } else if (dis > (this.list.length - 1) * this.unitDeg + this.opts.buffer) {
          dis = (this.list.length - 1) * this.unitDeg + this.opts.buffer
        }
      }
      this.moveY = dis
      this.setListValue(dis)
      this.setBoxRotate(dis)
    },

    // 手指滑动结束，根据手指滑动的时间及距离滚动元素
    end(event) {
      let touch = event.changedTouches ? event.changedTouches[0] : event
      // 手指滑动的距离
      let moveDis = this.startY - touch.screenY
      let dis = this.scrollY + moveDis
      // picker滚动时长
      let time = 0
      // picker可见总高度
      let total = this.opts.r * 2

      if (Date.now() - this.startTime > 200) {
        time = 500
      } else {
        dis = this.scrollY + (moveDis / total * 720)
        time = 1000
      }
      let index = Math.round(dis / this.unitDeg)
      if (!this.isCycle) {
        if (index < 0) {
          index = 0
        } else if (index > this.list.length - 1) {
          index = this.list.length - 1
        }
      }
      this.animate({
        s0: this.moveY,
        st: index * this.unitDeg,
        time: time,
        cb: (value, isEnd) => {
          this.scrollY = value
          this.setBoxRotate(this.scrollY)
          this.setListValue(this.scrollY)
          if (isEnd) {
            console.log('count---->', this.count, this.moveMap)
          }
        }
      })
      this.mouseleft = false
    },

    // 获得匀减速运动位移函数
    getVariableMotionFn(dis, time) {
      let a = -2 * dis / Math.pow(time, 2)
      let v0 = -a * time
      // s0初始位置，t运动时间
      return function (s0, t) {
        return s0 + v0 * t + a * Math.pow(t, 2) / 2
      }
    },

    // 匀减速运动动画函数
    animate(opts) {
      let date = Date.now()
      let dis = opts.st - opts.s0
      let tDiff = 0
      let uDis = 0
      let getMotionDis = this.getVariableMotionFn(dis, opts.time)

      function go() {
        tDiff = Date.now() - date
        if (tDiff >= opts.time) {
          uDis = opts.st
          opts.cb(uDis, true)
          return
        }
        uDis = getMotionDis(opts.s0, tDiff)
        if ((dis < 0 && uDis < opts.st) || (dis > 0 && uDis > opts.st)) {
          uDis = opts.st
        }
        opts.cb(uDis)
        this.aid = requestAnimationFrame(() => {
          go.call(this)
        })
      }
      go.call(this)
    }

  }
}
</script>

<style lang="less">
.dir-picker {
  position: relative;
  padding: 30pr 0px;
  font-size: 20px;
  background: rgb(209, 213, 219);
  .mask-wrapper {
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    .mask {
      padding-top: 30pr;
      background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0.3)
      );
      &.reverse {
        padding: 0px 0px 30pr;
        background-image: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0.3)
        );
      }
    }
  }
  .line {
    border: 1px solid rgb(190, 194, 200);
    border-width: 1px 0px;
  }
  .list-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    transform-style: preserve-3d;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 0px;
      width: 100%;
      backface-visibility: hidden;
      visibility: visible;
      &.hidden {
        visibility: hidden;
      }
    }
  }
}
</style>
