
// import {
//   native,
//   init,
//   xApp,
//   xPage,
// } from '../src/index';

// ========================================

// 暂定封装小程序的方法
// x-mini/index.js
import native from '../src/mini/native';
import XMini from '../src/mini/index';
import Storage from './storage';
import extend from '../src/mini/extend';

const plugins = {
  stat: require('../src/stat/index'),
  debug: require('../src/debug/index'),
  report: require('../src/report/index'),
}
const appId = '';
const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('../app.json');

const storage = new Storage('mini');
const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

function init(opts = {}) {
  const temp = {};
  native.init({
    appId,
    appName: 'hsq_aliapp',
    appConfig,
    storage,
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
// 对wx变量进行处理
const me = Object.assign({}, wx);
wx = me;

const mini = init({
  me,
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

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('/app.json');

// const mini = new XMini({
//   appConfig,
//   me: wx,

//   xPage(opts) {
//     // 可以处理数据
//     Page(opts);
//   },
//   getCurrentPages,
//   deepLength: 10,
// });

// module.exports = mini;
