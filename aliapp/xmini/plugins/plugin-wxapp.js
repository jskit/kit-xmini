import PluginBase from '../core/plugin-base';
import storage from '../core/storage';

class Plugin extends PluginBase {
  name = 'wxapp';
  constructor(...rest) {
    super(...rest);
  }

  // 兼容处理微信小程序和支付宝小程序的差异
  me() {
    /* eslint no-global-assign: 0 */
    const source = wx;
    source.httpRequest = source.request;
    wx = Object.assign({}, source);
    wx.$storage = storage;
    return wx;
  }
}

export default new Plugin();
