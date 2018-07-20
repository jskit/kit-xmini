
// 暂定封装小程序的方法

import XMini from './mini/index';
import stat from './stat/index';
import report from './report/index';

const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

const mini = {};

function init(opts = {}) {
  if (opts.stat) {
    stat.init(xApp, xPage);
    Object.assign(mini, stat);
  }
  if (opts.report) {
    report.init(xApp, xPage);
    Object.assign(mini, report);
  }
  return mini;
}

module.exports = {
  init,
  xApp,
  xPage,
}
