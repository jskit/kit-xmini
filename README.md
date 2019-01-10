# x-mini 小程序最佳实践

**注意** 此项目为老版本，新版请看 @xmini/xmini

此项目研究如何更方便的开发使用小程序，`x-mini` 助力实现以下功能

支持在每个生命周期插入自定义的方法，这样便于处理需求，而不影响业务开发。

## 注意事项

-**注意**：如果模块只有一个输出值，就使用export default，如果模块有多个输出值，
就不使用export default，export default与普通的export不要同时使用。(http://es6.ruanyifeng.com/#docs/style#%E6%A8%A1%E5%9D%97)

经过测试，存在以下问题，

- aliapp 不能引入 npm模块的es6格式，需要编译成es5
- wxapp 不能引入node_modules路径下内容，而其他路径可以
- 综上，建议使用独立文件夹路径引入，直接使用es6源文件即可

## 模块功能

- 模块间逻辑相互独立，按需引用
- 支持配置以及扩展功能

## 使用

新建 `/utils/mini.js` 文件

```js
import { Storage, storage } from '../npm/x-mini/lib/mini/storage';
import native from '../npm/x-mini/lib/mini/native';
import XMini from '../npm/x-mini/lib/mini/index';
import extend from '../npm/x-mini/lib/mini/extend';

const plugins = {
  stat: require('../npm/x-mini/lib/stat/index'),
  debug: require('../npm/x-mini/lib/debug/index'),
  report: require('../npm/x-mini/lib/report/index'),
}

// const storage = new Storage('mini');
const xApp = new XMini({ type: 'app' });
const xPage = new XMini({ type: 'page' });

function init(opts = {}) {
  const temp = {};
  native.init({
    ...opts,
    me: opts.me,
    xApp,
    xPage,
    getLocation: opts.getLocation || false,
  });
  extend.init(native.get());
  Object.assign(temp, {
    extend,
  });
  // 缓存下全局变量，供内部使用
  for (const key in plugins) {
    const plugin = plugins[key];
    plugin.init(native.get());
    Object.assign(temp, {
      [`${key}`]: plugin,
    });
  }
  return temp;
}

const appId = '';
const appName = 'iqg';
let me = {};
let host;
let appConfig;

// 对工具变量进行处理，方便输出
if (typeof __wxConfig !== 'undefined') {
  host = 'wxapp';
  appConfig = __wxConfig;
  me = Object.assign({}, wx);
  wx = me;
} else {
  host = 'aliapp';
  appConfig = require('../app.json');
  me = my;
}

// 以下变量必须设置
const mini = init({
  host, // aliapp or wxapp
  me,
  appId,
  appName: `${appName}-${host}`,
  appConfig,
});

// storage.set('test', {a:1}, 100);
// var aa = storage.get('test')
// console.warn(111, aa)

module.exports = {
  storage,
  Storage,
  me,
  xApp,
  xPage,
};
```

页面具体使用如下

```js
// app.js
import {
  xApp,
} from './utils/mini';

App(xApp.entry({
  onLaunch() {},
  onShow() {},
}));
```

```js
// page.js
import {
  xPage,
} from './utils/mini';

Page(xPage.entry({
  onLoad() {},
  onShow() {},
}));
```

### x-mini

支持对生命周期方法进行前置、后置的方法混入

### 数据统计方案

stat 实现统计方案接入

### 错误上报机制

report 实现错误上报机制

### my 方法优化与扩展

- my 方法使用优化 如 showToast 等
- 扩展 my 方法，如 $forward

### 缓存方案

封装 storage，实现缓存方案

### 数据请求优化

- 封装请求队列
- 统一处理报错
- 优化接口、公共参数配置，统一管理
- 支持缓存
- 支持请求拦截

### debug 调试模式

- 支持api环境切换
- 支持一定的调试手段，如开关log弹窗

### formId 解决方案

### 组件最佳实践

### 模板共用最佳实践

## Testing

可以以微信小程序为例进行测试研究，相对来说调试更方便并且功能更齐全。
