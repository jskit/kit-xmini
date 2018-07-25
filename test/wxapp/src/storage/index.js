
const noop = () => {};
let inited;
// 数据都存在这里
let storageData = {};
let me = {};

let setStorage = noop
let setStorageSync = noop
let getStorage = noop
let getStorageSync = noop
let removeStorage = noop
let removeStorageSync = noop
let clearStorage = noop
let clearStorageSync = noop
let getStorageInfo = noop
let getStorageInfoSync = noop

exports.init = function(opts = {}) {
  console.log('x-mini add storage');
  const {
    me,
    xApp,
    xPage,
  } = opts;

  setStorage         = me.setStorage
  setStorageSync     = me.setStorageSync
  getStorage         = me.getStorage
  getStorageSync     = me.getStorageSync
  removeStorage      = me.removeStorage
  removeStorageSync  = me.removeStorageSync
  clearStorage       = me.clearStorage
  clearStorageSync   = me.clearStorageSync
  getStorageInfo     = me.getStorageInfo
  getStorageInfoSync = me.getStorageInfoSync

  inited = true;
}

// let storageData = getStorageSync({ key: 'storageData' }).data || {};
// console.log('storageData');
// console.log(storageData);
// const storageInfo = getStorageInfoSync();
// const {
//   keys,
//   currentSize,
//   limitSize,
// } = storageInfo;
// console.log(storageInfo)
// storageInfo.keys().forEach((key, index) => {
//   console.log(key);
// })
// const cache = {
//   set(key, value, time) {

//   },
//   get(key) {
//     return cache
//   },
//   data: getStorageSync('storageData').data || {},
// };

let i = 1;
export class Storage {
  constructor(data = {}, store) {
    if (!inited) {
      console.error('Storage must be inited once before use');
      return this;
    }
    this.key = store || `store-${i++}`;
    const temp = getStorageSync({ key: 'storageData' }).data || {};
    Object.assign(data);
    storageData[this.key] = data;
  }
  set(key, value, time) {
    // 单位秒
    const timeout = Date.now() - 1 + time * 1000;
    console.log(timeout);
    const data = {
      value,
      timeout,
    };
    Object.assign(storageData[this.key], {
      [`${this.key}-${key}`]: data,
    });
    console.log(JSON.stringify(storageData[this.key]));
    setStorage({
      key,
      data: storageData[this.key],
      success(res) {
        console.log('数据缓存成功');
        console.log(res);
      },
    });
  }
  get(key) {
    if (!key) return;
    const temp = storageData[this.key][key] || {}
    // 缓存不存在
    if (!temp.timeout || !temp.value) return null;
    const now = Date.now();
    if (temp.timeout && temp.timeout < now) {
      // 缓存过期
      this.remove(key);
      return '';
    }
    return temp.value;
  }
  remove(key) {
    if (!key) return;
    delete storageData[this.key][key];
    removeStorage({
      key,
    });
  }
  clear(bool) {
    if (!(bool === true)) {
      storageData[this.key] = {};
      return removeStorage({
        key: this.key,
      });
    } else {
      storageData = {};
      clearStorage();
    }
  }
  getStorageInfo() {
    return getStorageInfo()
  }
}

// const storage = new Storage();

// export default storage

// exports.storage = storage;
exports.Storage = Storage;
