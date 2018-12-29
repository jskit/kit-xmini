
const fs = require('fs-extra')

// copy directory, even if it has subdirectories or files
fs.copySync('./test/wxapp/xmini', './lib')
