// import { Emitter } from '../utils/index';
import Core from './core';

class PluginBase extends Core {
  name = 'base';
  constructor(config) {
    super(config);
    // this.bindEvents();
  }

  // 将插件暴露的东西挂载到 xmini 上
  // 具体实现自己处理
  install(xm, options) {
    // 添加监听事件
    // xm.addEvents([

    // ]);
    // xm.addMathod([

    // ]);
  }

  // bindEvents() {}

  // getConfig() {
  //   return core.getConfig();
  // }
}

export default PluginBase;
