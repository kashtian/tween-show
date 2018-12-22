<template>
  <div class="custom-video-box" @mousemove="openTools" @mouseenter="openTools" @mouseleave="closeTools">
    <video ref="video" class="custom-video" controls autoplay>
      <track v-if="config && config.subtitle" 
        kind="metadata" default :src="config.subtitle" @cuechange="setSubtitle" />
    </video>
    <div class="video-subtitle">{{subtitle}}</div>
    <div class="video-tools" :class="{hide: !showTools}" @mousemove.stop @mouseenter="closeAutoHide" @mouseleave="openAutoHide">
      <div class="tool-item" @click="openClarity" @mouseleave="closeClarity">
        <span class="cur-clarity">高清</span>
        <div class="clarity-panel" :class="{show: showClarity}">
          <div class="clarity-item">标清</div>
          <div class="clarity-item">高清</div>
        </div>
      </div>
      <div class="tool-item"><span class="cur-clarity">字幕</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'custom-video',

  props: {
    config: Object
  },

  watch: {
    config() {
      this.initVideo()
    }
  },

  data() {
    return {
      subtitle: '',
      showTools: false,
      showClarity: false,
      toolAutoHide: true
    }
  },

  destroyed() {
    if (this.player) {
      this.player = this.player.destroy()
    }
  },

  methods: {
    // 初始化视频信息
    initVideo() {
      if (!this.config || this.player) return

      const flv = require('flv.js').default
      if (flv.isSupported()) {
        this.player = flv.createPlayer(this.config, {
          seekType: 'custom',
          customSeekHandler: CustomHandler
        })
        this.player.attachMediaElement(this.$refs.video)
        this.player.load()
        this.player.play()
      } else if (this.config.url) {
        this.$refs.video = this.config.url
      }
    },

    // 字幕信息改变
    setSubtitle(event) {
      let cue = event.target.track.activeCues[0]
      this.subtitle = cue ? cue.text : ''
    },

    // 显示工具栏2.5秒后自动隐藏
    openTools() {
      if (this.$refs.video.played.length) {
        this.showTools = true
      }
      if (this.toolid) {
        this.toolid = clearTimeout(this.toolid)
      }
      this.toolid = setTimeout(() => {
        if (this.$refs.video.played.length && !this.$refs.video.paused && this.toolAutoHide) {
          this.showTools = false
        }
      }, 2500)
    },

    // 关闭工具栏
    closeTools() {
      this.showTools = false
    },

    // 打开清晰度面板
    openClarity() {
      this.showClarity = true
    },

    // 关闭清晰度面板
    closeClarity() {
      this.showClarity = false
    },

    // 关闭自动关闭
    closeAutoHide() {
      this.toolAutoHide = false
    },

    // 打开自动关闭
    openAutoHide() {
      this.toolAutoHide = true
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

<style lang="less">
.custom-video-box {
  position: relative;
  color: rgba(255,255,255,.9);
  font-size: 14px;
  overflow: hidden;
  .video-subtitle {
    position: absolute;
    width: 100%;
    bottom: 30px;
    font-size: 16px;
    text-align: center;
    text-shadow: 0px 0px 5px #000;
  }
  .video-tools {
    position: absolute;
    top: 50%;
    right: 30px;
    border-radius: 3px;
    background-color: rgba(0,0,0,.6);
    transform: translate(0px, -50%);
    opacity: 1;
    &.hide {
      opacity: 0;
      transition: opacity .8s;
    }
  }
  .tool-item {
    position: relative;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    &:hover {
      .cur-clarity {
        color: #00be06;
      }
    }
  }
  .clarity-panel {
    position: absolute;
    width: 90px;
    top: -10px;
    right: 100%;
    padding: 10px 0px;
    text-align: center;
    line-height: 30px;
    background-color: rgba(0,0,0,.6);
    border-radius: 3px;
    display: none;
    &.show {
      display: block;
    }
  }
  .clarity-item {
    &:hover {
      color: #00be06;
    }
  }
}
</style>
