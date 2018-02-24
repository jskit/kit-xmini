# x-mini

封装小程序，针对不同的小程序，不要将判断封装在里面，请自己选择使用

```js
// 需要注意的文件
./origin.js
./aliapp/me.js
./aliapp/pages.js
./wxapp/me.js
./wxapp/pages.js
```

## 常见问题

- [ ] request 统一处理请求报错
- [ ] api 优化接口请求方式，统一管理
- [x] rewrite 优化 `showToast` 方法的使用
- [x] xPage 已经混入一些增强的方法，如下：
  - 集成页面跳转 `forward`，统一使用该方式，内部处理了页面深度相关问题（支付宝5，微信10）
  - 集成了 postMessage 以及 onMessage 方法，用于页面间通知
  - 优化了分享相关设定，通过配置设定
- [x] 优化分享设置，通过配置 Page 的 `data.shareInfo` 来控制

```js
// 配置为true，则启用分享，默认分享首页
data: {
  shareInfo: true,
},

// 也可以自定义分享内容，此时分享当前页面，也可以自定义页面
this.setData({
  shareInfo: {
    title: '',
    desc: '',
    imageUrl: '',
    path: '',
  },
});
```

## 使用

支付宝小程序可以直接引用 `import XMini, { utils } from 'x-mini/lib/aliapp';`，微信小程序还有问题 （更多使用参看 [kit-xapp](https://github.com/jskit/kit-xapp)）

- 统一通过 `./utils/mini.js` 暴露接口来引用 `mini`
- 统一通过 `./config/api` 暴露 api 接口

```js
// ./utils/mini.js
import XMini, { utils } from 'x-mini/lib/aliapp';
import { pages, tabBar } from '../app.json';

const { noop, mapTo, pagesObj } = utils;

// wxapp
// __wxConfig 是微信小程序内的一个全局变量
// const { pages = [], tabBar = {} } = __wxConfig;
// const tabBarList = tabBar.list;
// const tabPages = mapTo(tabBarList, (item) => {
//   return item.pagePath.replace('.html', '')
// });

// alipay
const tabBarList = (tabBar || {}).list || [];
const tabPages = mapTo(tabBarList, (item) => {
  return item.pagePath;
});
const allPages = pagesObj(pages, tabPages);

const mini = new XMini({
  pages: allPages,
  me: my,
  xApp: noop,
  xPage: Page,
  getCurrentPages,
  miniType: 'aliapp', // wxapp
});

export default mini;
```

### 其他工具

- 微信小程序引用图片远程化工具 [kit-wxapp-remote](https://github.com/jskit/kit-wxapp-remote)

## Testing

可以以支付宝小程序为例测试
