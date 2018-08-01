// import { copy } from './utils';
// import Storage from './storage';
// 缓存下外部变量，供内部统一调用

let nativeObj = {};

const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('../../app.json');
const native = {
  init(opts = {}) {
    if (!opts.me) {
      console.error('must be input "me"');
      return this;
    }

    Object.assign(nativeObj, {
      ...opts,
      ...require('./pages')(opts.appConfig || appConfig),
    });
  },
  // set(obj) {
  //   Object.assign(nativeObj, obj);
  // },
  get() {
    // 不要拷贝，全局引用
    return nativeObj;
  },
};

module.exports = native;
