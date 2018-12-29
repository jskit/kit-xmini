import PluginBase from './core/plugin-base';

class Plugin extends PluginBase {
  constructor(...rest) {
    super(...rest);
  }

  me() {
    // 兼容处理微信小程序和支付宝小程序的差异
    // source.httpRequest = source.request;
    return my;
  }
}

export default new Plugin();
