import { copy } from './utils';

// 缓存下外部变量，供内部统一调用

let nativeObj = {};

const native = {
  init(data) {
    nativeObj = data;
  },
  set(obj) {
    Object.assign(nativeObj, obj);
  },
  get() {
    return nativeObj;
  },
};

module.exports = native;
