
// 暂定封装小程序的方法

import XMini from './mini/index';
import stat from './stat/index';
import report from './report/index';

const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

function init(opts = {}) {
  if (opts.stat) {
    stat.init(xApp, xPage);
  }
  if (opts.report) {
    report.init(xApp, xPage);
  }
}

module.exports = {
  init,
  xApp,
  xPage,
}
