import xm from '../xmini/core/xmini';
// import { App, Page } from '../xmini/utils/mockMini';
import miniapp from '../xmini/adaptors/adaptor-wxapp';

import PluginChannel from '../xmini/plugins/plugin-channel';
import PluginErrorReport from '../xmini/plugins/plugin-error-report';
import PluginDemo1 from '../xmini/plugins/plugin-demo1';
import PluginDemo2 from '../xmini/plugins/plugin-demo2';

/* eslint no-global-assign: 0 */
const me = miniapp.me();

xm.init({
  appId: 123,
  appName: 'test',
  me,
  plugins: [
    new PluginChannel({
      spm: 'wxapp',
      channel: 'wxapp',
      filters: ['spm', 'channel'],
    }),
    new PluginErrorReport({ reportURI: 'https://tongji.doweidu.com/log.php' }),
    new PluginDemo1({ siteId: 2 }),
    new PluginDemo2({ url: 'www.baidu.com' }),
  ],
});

export const xmini = xm;

export const xApp = xm.xApp;
export const xPage = xm.xPage;
