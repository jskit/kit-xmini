import {
  log,
} from '../mini/utils';
import report from './report';

function preAppOnError(err) {
  log.log('report error:')
  report(err);
}

// function preAppOnLaunch() {
//   log.log('report pre app.js onLaunch:', this);
// }
// function postAppOnLaunch() {
//   log.log('report post app.js onLaunch:', this);
// }

exports.init = function(opts = {}) {
  log.warn(':::x-mini add report');
  const {
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  Object.assign(me, {
    $errLog: (...rest) => {
      report(...rest);
    },
  });

  xApp.use("onError", preAppOnError);
  // xApp.use("onLaunch", preAppOnLaunch);
  // xApp.use("onLaunch", postAppOnLaunch, 'post');
}
