const fs = require('fs')

let files = fs.readdirSync('./')
const whiteList = [ 'delExtra.js',
'node_modules',
'package.json',
'spider.js',
'spider2.js',
'spider3.js',
'utils.js',
'taskQueue.js',
'yarn.lock' ];
files.forEach(file=>{
  if(!~whiteList.indexOf(file)){
    console.log(`delete file ${file}`)
    fs.unlinkSync(file)
  }
})
