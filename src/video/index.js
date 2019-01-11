// 获取解析器
function getParser(page) {
  if (page.indexOf('iqiyi') > -1) {
    return require('./iqiyi').default
  }
}

export {
  getParser
}
