import PluginBase from '../core/plugin-base';
import storage from '../core/storage';

class Plugin extends PluginBase {
  name = 'wxapp';
  constructor(...rest) {
    super(...rest);
  }

  getCurrentPages() {
    return getCurrentPages();
  }

  // 兼容处理微信小程序和支付宝小程序的差异
  me() {
    /* eslint no-global-assign: 0 */
    wx = Object.assign({}, wx);
    const me = wx;
    me.httpRequest = me.request;
    me.$storage = storage;
    me.$getSystemInfo = () => {
      let systemInfo = storage.get('systemInfo');
      if (!systemInfo) {
        systemInfo = me.getSystemInfoSync();
        storage.set('systemInfo', systemInfo, 86400 * 365);
      }
      return systemInfo;
    }
    return me;
  }
}

export default new Plugin();
