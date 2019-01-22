import { xApp } from './config/xmini';

// console.log(xApp);

xApp({
  onError(err) {},
  onShow() {
    console.log('app onShow');
    // 模拟错误信息
    // xxx;
  },
})(App);
