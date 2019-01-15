import PluginBase from '../core/plugin-base';
import { storage, storageSystem } from '../core/storage';
import { uuid } from '../utils/index';
// import queue from '../core/queue';

// 适配小程序方法等
// 增强方法或属性全使用$开头
//   - $storage   优化缓存设置
//   - $getSystemInfo  获取系统信息
//   - $getCurPage() 获取当前页面
//   - $getPageInfo() 获取当前页面信息，如 pageName pagePath pageQuery

// 微信小程序是否是并发6个，怎么判断，目前在开发者工具上是6个（这个可能和浏览器有关系 http/1.1）
class Plugin extends PluginBase {
  name = 'wxapp';
  constructor(config = {}) {
    super(config);
  }

  getCurrentPages() {
    return getCurrentPages();
  }

  // 兼容处理微信小程序和支付宝小程序的差异
  me() {
    /* eslint no-global-assign: 0 */
    wx = Object.assign({}, wx);
    const me = wx;
    // const request = me.request;
    // Object.defineProperty(me, 'request', {
    //   get() {
    //     return queue(request, 10);
    //   },
    // });
    me.httpRequest = me.request;
    me.$storage = storage;
    me.$getUUID = () => {
      let uid = storageSystem.get('uuid');
      if (!uid) {
        uid = uuid(32);
        storageSystem.set('uuid', uid);
        // $log.set({ is_first_open: true });
      }
      // console.warn(':::uuid:', uid);
      return uid;
    },
    me.$getSystemInfo = () => {
      let systemInfo = storageSystem.get('systemInfo');
      if (!systemInfo) {
        systemInfo = me.getSystemInfoSync();
        storageSystem.set('systemInfo', systemInfo, 86400 * 365);
      }
      return systemInfo;
    };

    // 此方法没必要缓存，因为网络状态随时可手动变
    // me.$getNetworkType = (cb) => {
    //   let natworkType = storageSystem.get('natworkType');
    //   if (!natworkType) {
    //     me.getNetworkType({
    //       success(res) {
    //         storageSystem.set('natworkType', res.natworkType);
    //         cb && cb(res);
    //       },
    //       fail(err) {
    //         cb && cb({});
    //       },
    //     });
    //   } else {
    //     cb && cb({
    //       natworkType,
    //     });
    //   }
    // };
    me.$getLocation = (cb) => {
      let location = storageSystem.get('location');
      if (!location) {
        me.getLocation({
          type: 'wgs84',
          success(res) {
            // 缓存15分钟
            storageSystem.set('location', res, 900);
            cb && cb(res);
          },
          fail(err) {
            cb && cb({});
          },
        });
      } else {
        cb && cb(location);
      }
    };
    me.$getCurPage = () => {
      const pages = getCurrentPages();
      const length = pages.length;
      if (!length) return {};
      const currentPage = pages[length - 1] || {};
      return currentPage;
    };
    me.$getPageInfo = () => {
      const currentPage = me.$getCurPage();
      const { route = '', $pageQuery = {} } = currentPage;
      return {
        pageQuery: { ...$pageQuery },
        pagePath: route,
        pageName: route.split('/').reverse()[0] || '',
        referer: '',
      };
    };

    return me;
  }
}

export default new Plugin();
