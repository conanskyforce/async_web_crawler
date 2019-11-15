const request = require('request')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const utils = require('./utils')

// 改善
// 1.错误处理 -> return callback(err)
// 2.功能拆分模块
function spider(url, callback=()=>{}) {
  const filename = utils.urlToFilename(url);
  fs.exists(filename, exists => {
    if (!exists) {
      download(url,filename,err =>{
        if(err) return callback(err)
        callback(null,filename,true)
      })
    } else {
      callback(null, filename, false)
    }
  })
}

function saveFile(filename,contents,callback){
  mkdirp(path.dirname(filename),err=>{
    if(err) return callback(err)
    fs.writeFile(filename,contents,callback)
  })
}
function download(url,filename,callback){
  console.log(`Downloading ${url}`)
  request(url, (err, response, body) => {
    if (err) return callback(err)
    saveFile(filename,body,err => {
      if (err) return callback(err)
      console.log(`Downloaded and saved ${url}`)
      callback(null)
    })
  })
}
console.log(process.argv)
spider(process.argv[2], (err, filename, downloaded) => {
  if (err) return console.log(err);
  if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});
process.argv.slice(2).forEach(arg=>spider(arg,()=>{}))