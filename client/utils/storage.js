
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
} = wx;

// wxapp 本地数据存储的大小限制为 10MB

const noop = () => {};
// 数据都存在这里
let storageData = getStorageSync('storageData') || {};
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

export class Storage {
  set(key, value, time) {
    // 单位秒
    const timeout = +new Date() - 1 + time * 1000;
    // console.log(timeout);
    const data = {
      value,
      timeout,
    };
    Object.assign(storageData, {
      [`${key}`]: data,
    });
    // console.log(JSON.stringify(storageData));
    setStorage({
      key,
      data: storageData,
      success(res) {
        // console.log('数据缓存成功');
        // console.log(res);
      },
    });
  }
  get(key) {
    if (!key) return;
    const temp = storageData[key] || {}
    // 缓存不存在
    if (!temp.timeout || !temp.value) return null;
    const now = +new Date();
    if (temp.timeout && temp.timeout < now) {
      // 缓存过期
      this.remove(key);
      return '';
    }
    return temp.value;
  }
  remove(key) {
    if (!key) return;
    delete storageData[key];
    removeStorage({
      key,
    });
  }
  clear() {
    storageData = {};
    return clearStorage();
  }
  getStorageInfo() {
    return getStorageInfo()
  }
}

const storage = new Storage();

module.exports = storage
