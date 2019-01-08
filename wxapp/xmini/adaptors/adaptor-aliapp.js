import PluginBase from '../core/plugin-base';
import storage from '../core/storage';

class Plugin extends PluginBase {
  name = 'aliapp';
  constructor(...rest) {
    super(...rest);
  }

  me() {
    const me = my;
    // 兼容处理微信小程序和支付宝小程序的差异
    // source.httpRequest = source.request;
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
