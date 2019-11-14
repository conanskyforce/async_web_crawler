const urlLib = require('url')



module.exports = {
  urlToFilename(url) {
    return url.replace(/http(s?)\:\/\//g, '')
  },
  getPageLinks(url, body) {
    let {
      hostname,
      protocol
    } = urlLib.parse(url);
    let hostArr = hostname.split('.');
    let hostName = hostArr[hostArr.length - 2] + '\\.' + hostArr[hostArr.length - 1]
    let reg = new RegExp(`\/\/\(\.\*\?\)${hostName}`, 'gm')
    let matches = body.match(reg) || []
    if (matches.length) {
      matches = matches.filter(i=>i).map(item => protocol + item).filter(item=>item.indexOf('i5')==-1)
      matches = [...new Set(matches)]
      matches = matches.map(mat => {
        host = urlLib.parse(mat).hostname
        return protocol + "//" + host
      })
    }
    console.log(`getPageLinks: ${url}`)
    console.log(matches)
    return matches
  }
}