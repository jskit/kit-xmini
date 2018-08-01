
// function log(...rest) {
//   // 自定义事件
//   console.info('log:', JSON.stringify(rest));
// }

import { copy } from '../mini/utils';
// import Storage from './storage';
// 缓存下外部变量，供内部统一调用

let logData = {};

const log = {
  set(obj) {
    Object.assign(logData, obj);
  },
  get() {
    // 不要拷贝，全局引用
    return copy(logData);
  },
};

module.exports = log;
