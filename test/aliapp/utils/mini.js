
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
