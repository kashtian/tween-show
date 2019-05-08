(function() {
  var root = this 

  var cache = {}

  var fileArr = []
  var keyArr = []
  var fileLoading = false
  
  function _require(arr, cb) {
    var curscript = document.currentScript
    var filename = curscript.getAttribute('data-modulename')
    filename = filename || ('require' + Date.now())
    cache[filename] = new Module(filename, arr, cb)
    keyArr.push(filename)

    if (!arr || !arr.length) {
      return
    }

    var newarr = arr.filter(item => !cache[item])

    fileArr.push(...newarr)

    if (!fileLoading) {
      load()
    }
  }

  function Module(id, arr, cb) {
    this.id = id
    this.dependences = arr || []
    this.cb = cb
    this.loaded = false
    this.exports = {}
  }

  function load() {
    var len = fileArr.length
    if (!len) {
      fileLoading = false
      allFileLoaded()
      return
    }
    fileLoading = true
    fileArr.forEach(file => {
      createNode(file, (url) => {
        var index = fileArr.indexOf(url)
        fileArr.splice(index, 1)
        len--
        if (!len) {
          load()
        }
      })
    })
  }

  function allFileLoaded() {
    var len = keyArr.length
    var curmodule
    while(len--) {
      curmodule = cache[keyArr[len]]
      if (!curmodule.loaded) {
        curmodule.loaded = true
        curmodule.exports = curmodule.cb.apply(null, curmodule.dependences.map(item => cache[item].exports))
      }
    }
    keyArr = []
  }

  function createNode(url, cb) {
    var script = document.createElement('script')
    script.setAttribute('data-modulename', url)
    script.onload = function() {
      cb(url)
    }
    script.src = url
    document.body.appendChild(script)
  }

  root.require = _require
  root.define = _require
})()
