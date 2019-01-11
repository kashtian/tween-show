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

function xhrp(config) {
  return new Promise((resolve, reject) => {
    if (typeof config == 'string') {
      config = { url: config }
    }
    if (!config.responseType) {
      config.responseType = 'json'
    }
    
    let request = new XMLHttpRequest()

    request.open((config.method || 'get').toUpperCase(), config.url, true)

    request.timeout = config.timeout || 5 * 1000

    request.onreadystatechange = function() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }
      let response = config.responseType === 'text' ? request.responseText : str2json(request.response)
      if (request.status >= 200 && request.status < 300) {
        resolve(response)
      } else {
        reject(new Error('xhrp failed with status code: ', request.status, response))
      }
      request = null
    }

    request.onerror = function() {
      reject(new Error('Network Error: ', request))
      request = null
    }

    request.ontimeout = function() {
      reject(new Error('timeout: ', request))
      request = null
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    request.send(config.data)
  })
}

function str2json(data) {
  if (typeof data == 'string') {
    try {
      data = JSON.parse(data)
    } catch(e) {}
  }
  return data
}

export {
  myJsonp,
  xhrp
}
