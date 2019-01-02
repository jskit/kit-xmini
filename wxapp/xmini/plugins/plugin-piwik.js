  import PluginBase from '../core/plugin-base';
import storage from '../core/storage';
import xmini from '../core/xmini';

/**
 * 处理小程序参数
 * 支持配置必备业务参数透传
 * 支持参数的 parse stringify merge 等操作
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'piwik';
  events = {};
  methods = {
    piwikConfig: 'piwikConfig',
    piwikConfigUpdate: 'piwikConfigUpdate',
    piwikReport: 'piwikReport',
    piwikEvent: 'piwikEvent',
  };
  constructor(config) {
    super(config);
  }

  piwikConfig() {}
  piwikUpdate() {}
  piwikReport() {}
  piwikEvent() {}
  piwikPageView() {}
}

export default Plugin;
