
// 暂定封装小程序的方法

import XMini from './mini/index';
import stat from './stat/index';
import debug from './debug/index';
import report from './report/index';

const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

const mini = {};

function init(opts = {}) {
  if (opts.stat) {
    stat.init({
      app: xApp,
      page: xPage,
      getLocation: true,
    });
    Object.assign(mini, stat);
  }
  if (opts.report) {
    report.init({
      app: xApp,
      page: xPage,
    });
    Object.assign(mini, report);
  }
  if (opts.debug) {
    debug.init({
      app: xApp,
      page: xPage,
    });
    Object.assign(mini, debug);
  }
  return mini;
}

module.exports = {
  init,
  xApp,
  xPage,
}
