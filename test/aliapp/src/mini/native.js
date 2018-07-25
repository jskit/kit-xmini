// 缓存下外部变量，供内部统一调用

let nativeObj = {};

const native = {
  init(data) {
    nativeObj = copy(data);
  },
  set(obj) {
    Object.assign(nativeObj, obj);
  },
  get(key) {
    return key ? nativeObj[key] : {...nativeObj};
  },
};

module.exports = native;
