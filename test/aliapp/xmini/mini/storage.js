// 小程序的 storage 方法使用不完全一致，所以放在项目中引用

// import native from '../src/mini/native';

const noop = () => {};
let inited;
// 数据都存在这里
let storageData = {};
// let me = {};

// wxapp 本地数据存储的大小限制为 10MB

const {
  setStorage,
  setStorageSync,
  getStorage,
  getStorageSync,
  removeStorage,
  removeStorageSync,
  clearStorage,
  clearStorageSync,
  getStorageInfo,
  getStorageInfoSync,
} = typeof my !== 'undefined' ? my : wx;

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
class Storage {
  constructor(store = 'x-mini') {
    this.store = store || `store-${i++}`;

    let data = {};
    if (typeof my !== 'undefined') {
      // aliapp
      data = getStorageSync({ key: this.store }).data || {};
    } else {
      // wxapp
      data = getStorageSync(this.store) || {};
    }
    storageData[this.store] = data;
  }
  set(key, value, time) {
    // 单位秒
    const timeout = Date.now() - 1 + time * 1000;
    console.log(timeout);
    const data = {
      value,
      timeout,
    };
    Object.assign(storageData[this.store], {
      [`${key}`]: data,
    });
    // console.log(JSON.stringify(storageData[this.store]));
    setStorage({
      key: this.store,
      data: storageData[this.store],
      success(res) {
        console.log('数据缓存成功');
        console.log(res);
      },
    });
  }
  get(key) {
    if (!key) return;
    const temp = storageData[this.store][key] || {}
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
    delete storageData[this.store][key];
    setStorage({
      key: this.store,
      data: storageData[this.store],
      success(res) {
      },
    });
    // removeStorage({
    //   key,
    // });
  }
  clear(bool) {
    if (!(bool === true)) {
      storageData[this.store] = {};
      return removeStorage({
        key: this.store,
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

const storage = new Storage();

// export default storage

exports.storage = storage;
exports.Storage = Storage;
