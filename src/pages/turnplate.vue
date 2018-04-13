<template>
  <div class="turnplate-page">
    <div class="disc-wrapper">
      <div class="disc" :style="{transform: transform}"></div>
      <div class="pointer" @click="rotate"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'turnplate',

  route: {
      path: '/turn',
      title: '转盘'
  },

  data() {
    return {
      transform: 'none',
      isAnmationing: false
    }
  },

  methods: {
    rotate() {
      this.start(290)
    },

    start(end, start = 0, time = 3000, num = 4) {
      if (this.isAnmationing) {
        console.log('anmationing....')
        return
      }
      this.isAnmationing = true
      let a = (end + num * 360 - start) * 2 / Math.pow(time, 2)
      let duration = 0
      let stime = Date.now()
      let angle = 0

      function go() {
        if (duration >= time) {
          this.isAnmationing = false
          return
        }
        duration = Date.now() - stime
        angle = a * time * duration - a * Math.pow(duration, 2) / 2
        angle = angle % 360
        this.transform = `rotate(${angle}deg)`
        requestAnimationFrame(() => {
          go.call(this)
        })
      }
      go.call(this)
    }
  }
}
</script>

<style lang="less" scoped>
.disc-wrapper {
  position: relative;
  width: 270px;
  height: 270px;
  margin: 50px auto;
  .pointer {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 84px;
    height: 100px;
    margin: -50px 0px 0px -42px;
    background: no-repeat url('http://218.205.252.24:18081/scmccCampaign/dazhuanpan/images/turnplate-pointer.png?t=2');
    background-size: 100%;
  }
  .disc {
    width: 270px;
    height: 270px;
    background: no-repeat url('http://218.205.252.24:18081/scmccCampaign/dazhuanpan/images/zp-con.png?t=2');
    background-size: 100% 100%;
  }
}
</style>
