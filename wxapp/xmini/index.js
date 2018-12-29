import xm from './core/xmini';
// import { App, Page } from './utils/mockMini';
import PluginDemo1 from './plugin-demo1';
import PluginDemo2 from './plugin-demo2';
import PluginErrorReport from './plugin-error-report';
import PluginChannel from './plugin-channel';

import miniapp from './plugin-wxapp';

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
    }),
    new PluginDemo1({ siteId: 2 }),
    new PluginDemo2({ url: 'www.baidu.com' }),
    new PluginErrorReport({ reportURI: 'https://tongji.doweidu.com/log.php' }),
  ],
});

// console.log(xmini.getConfig());

export const xmini = xm;

export const xApp = xm.xApp;
export const xPage = xm.xPage;

// const { xApp, xPage } = xmini;
// console.log(xmini.prototype);
// console.log(xmini.test());

// xApp({
//   onShow() {
//     console.log('page: onShow');
//   },
// });

// xPage({
//   onShow() {
//     console.log('page: onShow');
//   },
// });
