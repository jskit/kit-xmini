import xm from '../xmini/core/xmini';
// import { App, Page } from '../xmini/utils/mockMini';
import miniapp from '../xmini/adaptors/adaptor-aliapp';

import PluginErrorReport from '../xmini/plugins/plugin-error-report';
import PluginChannel from '../xmini/plugins/plugin-channel';
import PluginPiwik from '../xmini/plugins/plugin-piwik';

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
      spm: 'aliapp',
      channel: 'aliapp',
      channel_id: 'aliapp',
    }),
    new PluginPiwik({
      piwik: {
        reportURI: 'https://tongji.doweidu.com/piwik.php',
      },
    }),
  ],
});

export const xmini = xm;

export const xApp = xm.xApp;
export const xPage = xm.xPage;
