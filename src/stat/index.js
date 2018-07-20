
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
  console.log('stat post app.js onLaunch:', this);
}

exports.event = function() {
  // 自定义事件
}

exports.init = function(app, page) {
  app.use("onLaunch", preAppOnLaunch);
  app.use("onLaunch", postAppOnLaunch, 'post');
  app.use("onUnlaunch", preAppOnUnlaunch);
  app.use("onShow", preAppOnShow);
  app.use("onShow", postAppOnShow, 'post');
  app.use("onHide", preAppOnHide);
  app.use("onError", preAppOnError);

  page.use("onLoad", prePageOnLoad);
  page.use("onUnload", prePageOnUnload);
  page.use("onShow", prePageOnShow);
  page.use("onHide", prePageOnHide);
  page.use("onReachBottom", prePageOnReachBottom);
  page.use("onPullDownRefresh", prePageOnPullDownRefresh);
  page.use("onShareAppMessage", postPageOnShareAppMessage, 'post');
}



