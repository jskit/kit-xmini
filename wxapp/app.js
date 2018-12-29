import { xApp } from './utils/xmini';

// console.log(xApp);

xApp({
  onError(err) {},
  onShow() {
    console.log(121212);
    // 模拟错误信息
    // xxx;
  },
})(App);
