import {
  prepend,
  append,
} from '../src/mini/utils';

import {
  init,
  xApp,
  xPage,
} from '../src/index';

init({
  stat: true,
  report: true,
});

module.exports = {
  xApp,
  xPage,
}

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('/app.json');
