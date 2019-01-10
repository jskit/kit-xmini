import PluginBase from '../core/plugin-base';
import storage from '../core/storage';
// import queue from '../core/queue';

// 适配小程序方法等
// 增强方法或属性全使用$开头
//   - $storage   优化缓存设置
//   - $getSystemInfo  获取系统信息
//   - $getCurPage() 获取当前页面
//   - $getPageInfo() 获取当前页面信息，如 pageName pagePath pageQuery

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
    me.$getSystemInfo = () => {
      let systemInfo = storage.get('systemInfo');
      if (!systemInfo) {
        systemInfo = me.getSystemInfoSync();
        storage.set('systemInfo', systemInfo, 86400 * 365);
      }
      return systemInfo;
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
      const { route = '', $query = {} } = currentPage;
      return {
        query: { ...$query },
        pagePath: route,
        pageName: route.split('/').reverse()[0] || '',
      };
    };

    return me;
  }
}

export default new Plugin();
