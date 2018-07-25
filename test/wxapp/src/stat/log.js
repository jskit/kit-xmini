
function log(...rest) {
  // 自定义事件
  console.info('log:', JSON.stringify(rest));
}

module.exports = log;
