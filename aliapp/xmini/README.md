# xmini

配置及使用

- const xmini = new Core();
  - 使用单例 xmini
  - 实现管理插件，生命周期，配置，通信；
  - 暴露添加插件，暴露全局配置；
  - 提供给插件调用注册公开方法
    - 提供一个公共方法来调用这些注册的方法（是唯一的） 例如 xxx.call('getChannelInfo', callback);
    - 注册的方法不唯一时，提供映射关系绑定
- class Plugin extends PluginBase;
  - 实现调用 core 注册方法，注册自己的公开方法
  - 实现自己的生命周期，配置
  - 实现具体功能

这里要把 每个插件要完成的功能进行划分限定，功能一致的使用同一种方式处理

- xmini
  - core
  - xmini
    - 实现集成，通过配置来适配各项目
    - 支持全局配置
    - 支持调度中心，用来和各个插件通信、调用等
- plugins
  - plugin-base
    - 支持 呼叫调度中心，通过 xmini 调度来完成以下功能
      - 支持 获取全局配置等
      - 支持 插件间通信
      - 支持 混入机制
      - 支持 hooks 机制
    - 实现通过引入 xmini 或 继承 core 来实现
  - plugin-channel
    - 支持业务参数、渠道等的获取，传递、合并等
    - 实现通过结合 @jskit/qs 的 parse，merge，stringify 来处理
  - plugin-work
    - 针对指定任务提供一个工作队列服务，来序列、可控数量的完成要做的工作
    - 可以用 work 来实现，针对 request、大计算提供分片队列服务
  - plugin-storage
    - 提供统一的小程序持久缓存
  - plugin-tongji
    - 封装统计事件等行为，将通用配置及自定义配置上报到统计 api
  - plugin-error-report
    - 错误收集上报
- demo 示例
  - demo-wxapp
  - demo-wxapp

xmini.init({
  appId: '',
  plugins: [
    xxx,
  ],
})

core.getConfig()

插件

关于数据配置

- 每个插件要能拿到全局 xminiConfig
- 插件的 pluginConfig 要挂载到 xminiConfig 上
  - 是否支持全局共享，部分插件有需要，如 channel
- 插件内的方法，要和页面的 options 打通，数据能共享，相当于执行的作用域在页面上

```js
import XMini from '@xmini/xmini';
import PluginCore from '@xmini/plugin-core';

// 插件
export default class PluginDemo1 extends PluginCore {
  name = 'plugin-demo1';
  events = {
    preOnShow: 'preOnShow',
    postOnShow: 'postOnShow',
  };

  constructor(config) {
    super(config);

    this.config = config;
  }

  preOnShow(e, ctx) {
    // 自定义各种事件
  }

  postOnShow(e, ctx) {}
}
```
