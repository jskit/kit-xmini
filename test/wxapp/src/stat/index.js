
import native from '../mini/native';
import log from './log';
import {
  preAppOnLaunch,
  preAppOnUnlaunch,
  preAppOnShow,
  postAppOnShow,
  preAppOnHide,
  preAppOnError,
} from './app';
import {
  prePageOnLoad,
  prePageOnUnload,
  prePageOnShow,
  prePageOnHide,
  prePageOnReachBottom,
  prePageOnPullDownRefresh,
  postPageOnShareAppMessage,
} from './page';

function postAppOnLaunch() {
  console.log('stat post xApp.js onLaunch:', this);
}

exports.init = function(opts = {}) {
  console.log('tip: x-mini add stat');
  const {
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  Object.assign(me, {
    $log: log,
  });

  xApp.use("onLaunch", preAppOnLaunch);
  xApp.use("onLaunch", postAppOnLaunch, 'post');
  xApp.use("onUnlaunch", preAppOnUnlaunch);
  xApp.use("onShow", preAppOnShow);
  xApp.use("onShow", postAppOnShow, 'post');
  xApp.use("onHide", preAppOnHide);
  xApp.use("onError", preAppOnError);

  xPage.use("onLoad", prePageOnLoad);
  xPage.use("onUnload", prePageOnUnload);
  xPage.use("onShow", prePageOnShow);
  xPage.use("onHide", prePageOnHide);
  xPage.use("onReachBottom", prePageOnReachBottom);
  xPage.use("onPullDownRefresh", prePageOnPullDownRefresh);
  xPage.use("onShareAppMessage", postPageOnShareAppMessage, 'post');
}



