<template>
  <div>
    <!-- <iframe ref="iframe" src="/static/video.js" @load="iframeLoaded"></iframe> -->
  </div>
</template>

<script>
export default {
  name: 'custom-video',

  route: {
    path: '/video',
    title: '视频'
  },

  mounted() {
  },

  destroyed() {
    this.$refs.iframe.contentWindow.destroy()
  },

  methods: {
    iframeLoaded() {
      console.log('iframe--->', this.$refs.iframe)
      // this.$refs.iframe.contentWindow.init(this.getInfo)
    },
    getInfo(quality) {
      return fetch(`http://172.20.36.4:3012/video?page=https://www.iqiyi.com/v_19rrbp46t4.html&quality=${quality || 300}`).then(res => {
        console.log('res--->', res)
        return res.json()
      }).then(res => {
        return res.data
      })
    }
  }
}
</script>

<style src="DPlayer/dist/DPlayer.min.css"></style>
