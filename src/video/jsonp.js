function myJsonp(url, cn) {
  if (!url || !cn) {
    return Promise.reject('url or cn cannot be empty.')
  }
  return new Promise((resolve, reject) => {
    window[cn] = function(data) {
      resolve(data)
    }
    let script = document.createElement('script')
    script.setAttribute('referrerpolicy', 'no-referrer')
    script.src = url
    script.onerror = function(evt) {
      removeJsonp(script, cn)
      reject(evt)
    }
    script.onload = function() {
      removeJsonp(script, cn)
    }
    document.body.appendChild(script)
  })
}

function removeJsonp(dom, cn) {
  delete window[cn]
  document.body.removeChild(dom)
}

export {
  myJsonp
}
