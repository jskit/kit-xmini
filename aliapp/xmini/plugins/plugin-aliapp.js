import PluginBase from '../core/plugin-base';
import storage from '../core/storage';

class Plugin extends PluginBase {
  name = 'aliapp';
  constructor(...rest) {
    super(...rest);
  }

  me() {
    // 兼容处理微信小程序和支付宝小程序的差异
    // source.httpRequest = source.request;
    my.$storage = storage;
    return my;
  }
}

export default new Plugin();
