import PluginBase from '../core/plugin-base';
import xmini from '../core/xmini';

// https://tongji.doweidu.com/log.php

class Plugin extends PluginBase {
  name = 'error-report';
  events = {
    preAppOnError: 'preOnError',
  };

  methods = {
    errReport: 'errReport',
  };

  constructor(config) {
    super(config);
  }

  install(xm, options) {
    //
  }

  errReport(err) {
    this.preOnError(err);
  }

  preOnError(err, ctx) {
    if (!err) return;
    // err 的数据格式是？
    console.log(err);

    const config = this.getConfig();
    const xminiConfig = xmini.getConfig();
    const { me } = xmini;
    const systemInfo = me.$getSystemInfo();
    const pageInfo = me.$getPageInfo();

    // 错误上报
    // 要记录报错信息，平台信息以及当前页面
    xmini.me.httpRequest({
      url: config.reportURI,
      method: 'POST',
      data: {
        ...systemInfo,
        pagePath: pageInfo.pagePath,
        pageQuery: JSON.stringify(pageInfo.pageQuery),
        appName: xminiConfig.appName,
        value: JSON.stringify(err),
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
