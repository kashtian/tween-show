import DPlayer from 'dplayer'

let _config = null
let _dp = null
let _flvPlayer = null
let _videoFn = null
let videoel = null

// 初始化
function init(cacheFn, options) {
  if (!videoel) {
    videoel = document.createElement('video')
    document.body.appendChild(videoel)
  }
  _videoFn = () => {
    return cacheFn().then(data => {
      let parser = _getParser()
      return parser.parse(data)
    })
  }
  _videoFn().then(data => {
    _config = data
    _initVideo()
  }).catch(err => {
    console.error(err)
  })
}

// 获取解析器
function _getParser() {
  if (options.page.indexOf('iqiyi') > -1) {
    return require('./iqiyi/iqiyi')
  }
}

// 初始化视频
function _initVideo() {
  if (!_config) return

  let videoConfig = null
  if (_config.type == 'flv' ) {
    videoConfig = _getFlvConfig()
  } else if (_config.url) {
    videoConfig = {
      type: 'mp4',
      url: _config.url
    }
  }
  if (!videoConfig) return
  
  _dp = new DPlayer({
    container: videoel,
    autoplay: true,
    subtitle: {
      url: '/ss.vtt',
      type: 'webvtt'
    },
    video: Object.assign({
      quality: _config.quality,
      defaultQuality: _config.qualityIndex
    }, videoConfig)
  })

}

// 获取flv视频配置信息
function _getFlvConfig() {
  const flv = require('flv.js').default
  if (flv.isSupported()) {
    return {
      type: 'customFlv',
      customType: {
        customFlv: async (video, player) => {
          if (!_config && _videoFn) {
            _config = await _videoFn(player.quality ? player.quality.nbid : null)
          }
          if (!_config) {
            return console.warn('_config can not empty')
          }
          _flvPlayer = flv.createPlayer(_config, {
            seekType: 'custom',
            customSeekHandler: CustomHandler
          })
          _flvPlayer.attachMediaElement(video)
          _flvPlayer.load()
          _config = null
        }
      }
    }
  } else {
    return alert('flv not supported')
  }
}

// 销毁不用的视频数据
function destroy() {
  if (_flvPlayer) {
    _flvPlayer = _flvPlayer.destroy()
  }
  if (_dp) {
    _dp = _dp.destroy()
  }
}

// 自定义seekHandler
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
