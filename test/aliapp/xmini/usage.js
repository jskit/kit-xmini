
// import {
//   native,
//   init,
//   xApp,
//   xPage,
// } from '../src/index';

// ========================================

// 暂定封装小程序的方法
// x-mini/index.js
import { Storage, storage } from '../xmini/mini/storage';
import native from '../xmini/mini/native';
import XMini from '../xmini/mini/index';
import extend from '../xmini/mini/extend';

const plugins = {
  stat: require('../xmini/stat/index'),
  debug: require('../xmini/debug/index'),
  report: require('../xmini/report/index'),
}

// const storage = new Storage('mini');
const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

function init(opts = {}) {
  const temp = {};
  native.init({
    ...opts,
    me: opts.me,
    xApp,
    xPage,
    getLocation: opts.getLocation || false,
  });
  extend.init(native.get());
  Object.assign(temp, {
    extend,
  });
  // 缓存下全局变量，供内部使用
  for (const key in plugins) {
    const plugin = plugins[key];
    plugin.init(native.get());
    Object.assign(temp, {
      [`${key}`]: plugin,
    });
  }
  return temp;
}

// module.exports = {
//   native,
//   init,
//   xApp,
//   xPage,
// }

// ========================================

// utils/mini.js
const appId = '';
const appName = 'iqg';
let me = {};
let host;
let appConfig;

// 对工具变量进行处理，方便输出
if (typeof __wxConfig !== 'undefined') {
  host = 'wxapp';
  appConfig = __wxConfig;
  me = Object.assign({}, wx);
  wx = me;
} else {
  host = 'aliapp';
  appConfig = require('../app.json');
  me = my;
}

// 以下变量必须设置
const mini = init({
  host, // aliapp or wxapp
  me,
  appId,
  appName: `${appName}-${host}`,
  appConfig,
});

// storage.set('test', {a:1}, 100);
// var aa = storage.get('test')
// console.warn(111, aa)

module.exports = {
  storage,
  Storage,
  me,
  xApp,
  xPage,
};
