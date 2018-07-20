
import {
  init,
  xApp,
  xPage,
} from '../src/index';

const mini = init({
  stat: true,
  report: true,
});

module.exports = {
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
