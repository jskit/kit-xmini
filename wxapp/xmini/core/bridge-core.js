// 为插件机制提供一种通信方案
// 默认通信为直接通信，可选消息模式通信
// plugin 通过在 core 注册方法来暴露公有方法
// plugin 调用非自己方法，通过 core 调度中心来调用

class BridgeCore extends Core {
  constructor(config = {}) {
    super(config);
  }

  // 初始化，默认为直接通信，可选消息模式 `message`
  init(config = {}) {
    if (!config.mode) {
      config.mode = '';
    }
    this.setConfig(config);
  }

  // 注册 pluginMethod 方法，提供给 core 来调用
  registerHandler(handlerName, data, callback) {

  }

  // plugin 调用 core 方法
  // 传入 `handlerName`和`data` 数据给 core，bridge 记录 `responseCallback`
  // 在 core 端，可以有多个 handler，所以`callHandler`需要一个key来寻找指定方法
  callHandler(handlerName, data, callback) {
    // if (arguments.length == 2 && isFunction(data)) {
    //   responseCallback = data;
    //   data = null;
    // }
    _doSend(
      {
        handlerName: handlerName,
        data: data,
      },
      responseCallback
    );
  }
}

export default BridgeCore;
