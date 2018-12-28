<template>
  <div class="custom-video-box"></div>
</template>

<script>
export default {
  name: 'custom-video',

  props: {
    videoFn: Function,
    options: Object
  },

  mounted() {
    this.videoFn().then(data => {
      this.config = data
      this.initVideo()
    })
  },

  destroyed() {
    if (this.flvPlayer) {
      this.flvPlayer = this.flvPlayer.destroy()
    }
    if (this.dp) {
      this.dp = this.dp.destroy()
    }
  },

  methods: {
    // 初始化视频信息
    initVideo() {
      if (!this.config) return

      const DPlayer = require('dplayer')

      let videoConfig = null
      if (this.config.type == 'flv' ) {
        videoConfig = this.getFlvConfig()
      } else if (this.config.url) {
        videoConfig = {
          type: 'mp4',
          url: this.config.url
        }
      }
      if (!videoConfig) return
      
      this.dp = new DPlayer(Object.assign({
        container: this.$el,
        autoplay: true,
        subtitle: {
          url: '/ss.vtt',
          type: 'webvtt'
        },
        video: Object.assign({
          quality: this.config.quality,
          defaultQuality: this.config.qualityIndex
        }, videoConfig)
      }, this.options))
    },

    // 获取flv视频配置信息
    getFlvConfig() {
      const flv = require('flv.js').default
      if (flv.isSupported()) {
        return {
          type: 'customFlv',
          customType: {
            customFlv: async (video, player) => {
              if (!this.config) {
                this.config = await this.videoFn(player.quality ? player.quality.nbid : null)
              }
              this.flvPlayer = flv.createPlayer(this.config, {
                seekType: 'custom',
                customSeekHandler: CustomHandler
              })
              this.flvPlayer.attachMediaElement(video)
              this.flvPlayer.load()
              this.config = null
            }
          }
        }
      } else {
        return alert('flv not supported')
      }
    }
  }
}

class CustomHandler {
  getConfig(url, range) {
    return {
        url: url + `&range=${range.from}-`,
        headers: {}
    }
  }

  removeURLParameters(seekedURL) {
    return seekedURL
  }
}
</script>

<style src="DPlayer/dist/DPlayer.min.css"></style>
