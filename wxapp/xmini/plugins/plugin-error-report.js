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

  install(xm, options) {
    //
  }

  preOnError(err, ctx) {
    if (!err) return;

    const config = this.getConfig();
    const xConfig = xmini.getConfig();

    // 错误上报
    xmini.me.httpRequest({
      url: config.reportURI,
      method: 'POST',
      data: {
        platform: xConfig.appName,
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
