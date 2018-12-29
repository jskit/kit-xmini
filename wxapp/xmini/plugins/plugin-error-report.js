import PluginBase from '../core/plugin-base';
import xmini from '../core/xmini';

// https://tongji.doweidu.com/log.php

class Plugin extends PluginBase {
  name = 'error-report';
  events = {
    preAppOnError: 'preOnError',
  };

  constructor(config) {
    super(config);
  }

  preOnError(err, ctx) {
    if (!err) return;

    const pluginConfig = this.getConfig();
    const config = xmini.getConfig();

    // console.log('error-report');
    // console.log(this.getGlobalConfig());
    // console.log(this.getConfig());

    // 错误上报
    xmini.me.httpRequest({
      url: pluginConfig.reportURI,
      method: 'POST',
      data: {
        platform: config.appName,
        value: JSON.stringify(err),
        // systemInfo: systemInfo,
      },
      dataType: 'json',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  }
  preAppOnShow() {}
}

export default Plugin;
