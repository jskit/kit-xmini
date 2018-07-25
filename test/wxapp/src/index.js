
// 暂定封装小程序的方法

import native from './mini/native';
import XMini from './mini/index';

const plugins = {
  stat: require('./stat/index'),
  debug: require('./debug/index'),
  report: require('./report/index'),
}

const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

const mini = {};

function init(opts = {}) {
  native.init({
    me: opts.me,
    xApp,
    xPage,
    getLocation: opts.getLocation || false,
  });
  // 缓存下全局变量，供内部使用
  for (const key in plugins) {
    if (opts[key]) {
      const plugin = plugins[key];
      plugin.init(native.get());
      Object.assign(mini, {
        [`${key}`]: plugin,
      });
    }
  }
  return mini;
}

module.exports = {
  native,
  init,
  xApp,
  xPage,
}
