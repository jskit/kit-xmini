
function report(...rest) {
  // 错误上报
  console.error(JSON.stringify(rest));
}

module.exports = report;
