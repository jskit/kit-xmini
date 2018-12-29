import PluginBase from './core/plugin-base';
import xmini from './core/xmini';

// https://tongji.doweidu.com/log.php

class Plugin extends PluginBase {
  name = 'error-report';
  events = {
    preAppOnError: 'preOnError',
  };

  constructor(config) {
    super(config);

    // console.log(this);
  }

  preOnError(err, ctx) {
    if (!err) return;
    // const config = this.getConfig();
    // const config = this.getConfig();
    // const systemInfo = xmini.getSystemInfo('string');
    // const pluginConfig = this.getPluginConfig();
    // const request = xmini.getFn('request');
    const pluginConfig = this.getConfig();
    const config = xmini.getConfig();

    console.log('error-report');
    console.log(this.getGlobalConfig());
    console.log(this.getConfig());
    const { httpRequest } = xmini.me;
    // 错误上报

    httpRequest({
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
