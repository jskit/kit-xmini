# x-mini 小程序最佳实践

此项目研究如何更方便的开发使用小程序，`x-mini` 助力实现以下功能

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
import {
  init,
  xApp,
  xPage,
} from 'x-mini';

const mini = init({
  me,
  stat: true,
  report: true,
});

module.exports = {
  xApp,
  xPage,
}
```

页面引用如下

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
