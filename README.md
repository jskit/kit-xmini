# x-mini 小程序最佳实践

**注意**

- 此项目老版本 `1.x.x` 可用，结构比较乱
- 当前 `2.x.x` 正在构建中...

此项目研究如何更方便的开发使用小程序，`x-mini` 助力实现以下功能

支持在每个生命周期插入自定义的方法，这样便于处理需求，而不影响业务开发。

产出原由：

因为小程序要加不少公共逻辑，比如功能扩展，数据埋点统计，错误上报等，有些需要遍布所有页面，单独抽离后引用实在不美观。

大体思想是改写生命周期方法，把我们要做的事情放进去，可用后记为1.0.0，算是第一版。

为了同时支持微信小程序和支付宝小程序，各种联调后导致功能越发混乱，调试扩展不方便，于是决定重新设计下，就是这一版。

## 注意事项

经过测试，存在以下问题，

- aliapp 不能引入 npm模块的es6格式，需要编译成es5
- wxapp 不能引入node_modules路径下内容，而其他路径可以（目前最新版也不是 node_modules 文件夹）
- 综上，最好还是手动源码引入，将安装后的代码，拖入自定义文件夹中使用

**注意**：如果模块只有一个输出值，就使用export default，如果模块有多个输出值，
就不使用export default，export default与普通的export不要同时使用。(http://es6.ruanyifeng.com/#docs/style#%E6%A8%A1%E5%9D%97)

## 使用

- 新版本支持按需引入
- 以插件形式随意扩展功能，也可以自己实现功能后引入

引入过程，新建 `/utils/xmini.js` 文件如下（假如你自定义的引用文件夹为 npm）

```js
import xm from '../xmini/core/xmini';
// import { App, Page } from '../xmini/utils/mockMini';
import miniapp from '../xmini/adaptors/adaptor-wxapp';

import PluginErrorReport from '../xmini/plugins/plugin-error-report';
import PluginChannel from '../xmini/plugins/plugin-channel';
import PluginStat from '../xmini/plugins/plugin-stat/index';
import PluginPiwik from '../xmini/plugins/plugin-piwik/index';

xm.init({
  appId: 123,
  appName: 'test',
  me: miniapp.me(),
  getCurrentPages: miniapp.getCurrentPages,
  plugins: [
    new PluginErrorReport({
      reportURI: 'https://tongji.xxx.com/log.php',
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
      reportURI: 'https://tongji.xxx.com/piwik.php',
      authToken: 'xxx',
    }),
  ],
});

export const xmini = xm;

export const xApp = xm.xApp;
export const xPage = xm.xPage;
export const xComponent = xm.xPage;
```

页面引用如下

```js
// app.js
import { xApp } from './utils/xmini';

xApp({
  onError(err) {},
  onShow() {
    console.log('app onShow');
    // 模拟错误信息
    // xxx;
  },
})(App);
```

```js
// page.js
import { xPage } from './utils/xmini';

xPage({
  onLoad(query) {},
  onShow() {
    console.log('page onShow');
  },
})(Page);
```

## 适配扩展及插件

- adaptors 包含差异化封装以及功能扩展
  - adaptor-wxapp
  - adaptor-aliapp
- plugins
  - [x] plugin-error-report 错误上报
  - [x] plugin-channel 渠道跟踪
  - [ ] plugin-stat 数据收集（是否可以无埋点）
  - [ ] plugin-piwik 统计数据上报到 piwik
  - [ ] formId 解决方案
  - [ ] 封装请求队列

## Testing

可以以微信小程序为例进行测试研究，相对来说调试更方便并且功能更齐全。

或使用 `mockMini` 来完成自动化测试
