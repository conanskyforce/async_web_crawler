const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utils = require('./utils')
const oriUrl = process.argv[2];
const deepMap = {}
const spidering = new Map();
// 改善
// 1.错误处理 -> return callback(err)
// 2.功能拆分模块
function spider(url, nesting, callback, ) {
  if(spidering.has(url)){
    return process.nextTick(callback)
  }
  spidering.set(url, true);
  const filename = utils.urlToFilename(url);
  if (!deepMap[oriUrl]) {
    deepMap[oriUrl] = filename
    mkdirp.sync(deepMap[oriUrl])
  }
  console.log('deepMap:', nesting, url)
  fs.readFile(resolveSavePath(filename), 'utf8', (err, body) => {
    if (err) {
      if (err.code != 'ENOENT') {
        return callback(err)
      }
      return download(url, filename, (err, body) => {
        if (err) {
          return callback(err);
        }
        spiderLinks(url, body, nesting, callback);
      });
    }
    spiderLinks(url, body, nesting, callback);
  })
}

function resolveSavePath(filename) {
  return path.resolve(deepMap[oriUrl], filename)
}

function saveFile(filename, contents, callback) {
  setTimeout(()=>{
    fs.writeFile(resolveSavePath(filename), contents, callback)
  },1000)
}

function download(url, filename, callback) {
  console.log(`Downloading ${url}`)
  request({
    url,
    rejectUnauthorized: false,
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
    }
  }, (err, response, body) => {
    if (err) return callback(err)
    saveFile(filename, body, err => {
      if (err) return callback(err)
      console.log(`Downloaded and saved ${url}`)
      callback(null, body)
    })
  })
}

function spiderLinks(currentUrl, body, nesting, callback) {
  const filename = utils.urlToFilename(currentUrl);
  if (nesting === 0) {
    return process.nextTick(callback)
  }
  let links = utils.getPageLinks(currentUrl, body);

  function iterate(index) {
    if (index === links.length - 1) {
      return callback(null, filename, true)
    }
    let completed = 0;
    hasErrors = false;
    // 并发下载
    function done(err) {
      if (err) {
        hasErrors = true;
        return callback(err);
      }
      if (++completed === links.length && !hasErrors) {
        return callback(null, filename, true)
      }
    }
    links.forEach((link,index) => {
      spider(link, nesting - 1, done)
    })
  }
  iterate(0)
}

spider(oriUrl, 1, (err, filename, downloaded) => {
  if (err) return console.log(err);
  if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});