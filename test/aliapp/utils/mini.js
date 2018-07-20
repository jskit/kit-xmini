// import {
//   prepend,
//   append,
// } from '../mini/utils';

import {
  init,
  xApp,
  xPage,
} from '../mini/index';

const mini = init({
  stat: true,
  report: true,
});

module.exports = {
  xApp,
  xPage,
}

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('/app.json');
