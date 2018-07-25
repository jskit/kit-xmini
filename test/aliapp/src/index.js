
// 暂定封装小程序的方法

import native form './native';
import XMini from './mini/index';
import stat from './stat/index';
import debug from './debug/index';
import report from './report/index';

const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

const mini = {};

function init(opts = {}) {
  native.init({
    opts,
  });
  // 缓存下全局变量，供内部使用
  if (opts.report) {
    report.init({
      me: opts.me,
      xApp,
      xPage,
    });
    Object.assign(mini, report);
  }

  if (opts.stat) {
    stat.init({
      me: opts.me,
      xApp,
      xPage,
      getLocation: opts.getLocation || true,
    });
    Object.assign(mini, stat);
  }

  if (opts.debug) {
    debug.init({
      me: opts.me,
      xApp,
      xPage,
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
