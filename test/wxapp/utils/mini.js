
import {
  init,
  xApp,
  xPage,
} from '../src/index';

// 对wx变量进行处理
const me = Object.assign({}, wx);
wx = me;

const mini = init({
  me,
  stat: true,
  report: true,
});

module.exports = {
  me,
  xApp,
  xPage,
}

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('/app.json');

// const mini = new XMini({
//   appConfig,
//   me: wx,

//   xPage(opts) {
//     // 可以处理数据
//     Page(opts);
//   },
//   getCurrentPages,
//   deepLength: 10,
// });

// module.exports = mini;
