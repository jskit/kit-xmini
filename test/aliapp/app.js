
// Object.defineProperty(AFAppX, 'App', {
//     configurable: true, // 能否使用delete、能否修改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
//     enumerable: false, // 对象属性是否可通过for-in循环，flase为不可循环，默认值为true
//     writable: true, // 对象属性是否可修改,flase为不可修改，默认值为true
//     // value:'xiaoming' // 对象属性的默认值，默认值为undefined
// });

// const desc = Object.getOwnPropertyDescriptor(global, 'App');
// console.log(desc)

// var oldApp = App;
// App = function(obj) {
//   my.alert({
//     content: '1111',
//   })
//   oldApp(obj);
// };

// import {
//   prepend,
//   append,
// } from '/mini/utils';
// import { mini } from './mini/mini'

import {
  xApp,
} from './utils/mini';

// 初始化，必须最先执行
// init({
//   // appConfig: require('/app.json'),
//   // appConfig: __wxConfig,
//   xApp(opts) {
//     prepend(opts, 'onShow', function() {
//       console.log('before onShow')
//     })
//     append(opts, 'onShow', function() {
//       console.log('after onShow')
//     })
//     App(opts);
//   },
// });

// async function timeout(ms) {
//   await new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function asyncPrint(value, ms) {
//   await timeout(ms);
//   console.warn(value);
// }

// asyncPrint('hello world', 50);

App(xApp.entry({
  onError(err) {
    console.error(err);
  },
  onLaunch() {
    console.log('app.js on launch')
    // my.getSystemInfo({
    //   success: (res) => {
    //     console.log(res);
    //   },
    // });
    // my.getNetworkType({
    //   success: (res) => {
    //     console.log(res);
    //   },
    // });
  },
  onShow(query) {
    console.log('app.js onShow')
    console.log('query:', query);
  },
  onHide() {
    console.log('App Hide');
  },
}));
