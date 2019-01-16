import xm from '../xmini/core/xmini';
// import { App, Page } from '../xmini/utils/mockMini';
import miniapp from '../xmini/adaptors/adaptor-wxapp';

import PluginErrorReport from '../xmini/plugins/plugin-error-report';
import PluginChannel from '../xmini/plugins/plugin-channel';
import PluginStat from '../xmini/plugins/plugin-stat/index';
import PluginPiwik from '../xmini/plugins/plugin-piwik/index';

// xm.init()
//   .use()
//   .use()
//   .use();

xm.init({
  appId: 123,
  appName: 'test',
  me: miniapp.me(),
  getCurrentPages: miniapp.getCurrentPages,
  plugins: [
    new PluginErrorReport({
      reportURI: 'https://tongji.doweidu.com/log.php',
    }),
    new PluginChannel({
      spm: 'wxapp',
      channel: 'wxapp',
      channel_id: 'wxapp',
    }),
    new PluginStat({}),
    new PluginPiwik({
      size: 10,
      // time: '', // 上报时间间隔
      siteId: 2, // 测试用 2，本站点使用 5
      reportURI: 'https://tongji.doweidu.com/piwik.php',
      token_auth: '5db85cb262e7423aa6bdca05a0283643',
    }),
  ],
});

export const xmini = xm;

export const xApp = xm.xApp;
export const xPage = xm.xPage;
export const xComponent = xm.xPage;
