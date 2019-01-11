import bidMap from './bid-map'
import { myJsonp } from '../jsonp'

// 调用cache.video.iqiyi.com/jp/dash
function getCacheData(chacheInfo) {
  return myJsonp(chacheInfo.url, chacheInfo.params.callback)
    .then(res => {
      if (!res || res.code != 'A00000') {
        return 
      }
      let jsonInfo = res.data
      if (!jsonInfo || !jsonInfo.program) {
        return
      }
      let videoArr = jsonInfo.program.video || []
      Object.assign(chacheInfo, getFsAndQuality(videoArr))
      chacheInfo.stl = getSubtitle(jsonInfo)
      return chacheInfo
    }).catch(err => {
      console.error(err.message || err)
    })
}

// 解析cache.video.iqiyi.com/jp/dash接口返回的结果
function parseCacheResult(txt) {
  txt = txt.replace(new RegExp(`try\\{\\w+\\(([^\\)]*)\\).*`), '$1')
  let info = JSON.parse(txt)
  return info.data || {}
}

// 获取视频资源和清晰度列表
function getFsAndQuality(arr) {
  let item
  let selectedItem
  let clarities = []
  for (let i = 0, len = arr.length; i < len; i++) {
    item = arr[i]
    if ('fs' in item && item['_selected']) {
      selectedItem = item
    }
    if (item.bid in bidMap) {
      clarities.push(bidMap[item.bid])
    }
  }
  return {
    video: selectedItem || '',
    quality: clarities.sort((a, b) => b.nbid - a.nbid)
  }
}

// 获取字幕链接
function getSubtitle(data) {
  let stl = data.program.stl || []
  let item = stl.find(item => item.pre == 1)
  item && (item.host = data.dstl)
  return item
}

// 调用data.video接口，获取完整的视频地址
function getVideoUrl({params, video}, protocol) {
  let otherParams = {
    'cross-domain': 1,
    'qyid': params['k_uid'],
    'qypid': params['tvid'] + '_01080031010000000000',
    rn: Date.now(),
    pv: 0.1
  }
  let otherStr = ''
  for (let key in otherParams) {
    otherStr += `&${key}=${otherParams[key]}`
  }
  return video.fs.map(item => {
    return {
      duration: item.d,
      filesize: item.b,
      getUrl: videoUrlFn(`${protocol}//data.video.iqiyi.com/videos` + item.l + otherStr)
    }
  })
}

// 获取视频地址函数
function videoUrlFn(url) {
  return function() {
    return fetch(`https://api.kashtian.com/video/again?url=${encodeURIComponent(url)}`, {
      referrerPolicy: 'no-referrer'
    }).then(res => res.json())
    .then(data => {
      return `https://api.kashtian.com/video/again?url=${encodeURIComponent(data.l)}`
    }).catch(err => {
      console.error(err.message || err)
    })
  }
}

// 解析入口
async function parse(chacheInfo) {
  if (!chacheInfo) {
    return Promise.reject('chacheInfo can not be empty')
  }
  let cacheData = await getCacheData(chacheInfo)
  if (!cacheData) {
    return Promise.reject('iqiyi get cache data failed')
  }
  let videoResult = getVideoUrl(cacheData, chacheInfo.protocol)
  if (!videoResult || !videoResult.length) {
    return Promise.reject('iqiyi get video result failed')
  }
  let videoDetail = {
    type: cacheData.video.ff == 'f4v' ? 'flv' : cacheData.video.ff,
    duration: cacheData.video.duration,
    scrsz: cacheData.video.scrsz,
    filesize: cacheData.video.vsize,
    stl: cacheData.stl || '',
    quality: cacheData.quality,
    qualityIndex: cacheData.quality.findIndex(item => item.nbid == chacheInfo.qualitynum)
  }
  if (videoResult.length > 1) {
    videoDetail.segments = videoResult
  } else {
    videoDetail.getUrl = videoResult[0].getUrl
  }
  return videoDetail
}

export default {
  parse
}
