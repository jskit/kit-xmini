
import {
  log,
  copy,
  // uuid,
} from '../mini/utils';
import native from '../mini/native';

// prePageOnLoad
function pageQuery(options = {}, fnName) {
  this.pageQuery = copy(options);
  const {
    defaultPage,
    allPages,
  } = native.get();
  this.getPageName = function getPageName() {
    const { pageName, route = '' } = this;
    return pageName || route.split('/').reverse()[0] || defaultPage;
  };
  this.fullPagePath = this.route;
}

// 这里扩展支持获取当前页面，参数、列表相关 mixins 等
exports.init = function(opts = {}) {
  log.warn(':::x-mini add extend');
  const {
    storage,
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  // xApp.use("onError", preAppOnError);
  // xApp.use("onLaunch", getAppOptions);
  // xApp.use("onLaunch", preAppOnLaunch);
  // xApp.use("onLaunch", postAppOnLaunch, 'post');
  // xApp.use("onShow", getAppOptions);
  // xApp.use("onShow", preAppOnShow);
  // xApp.use("onShow", postAppOnShow, 'post');
  // xApp.use("onHide", preAppOnHide);
  // xApp.use("onUnlaunch", preAppOnUnlaunch);

  xPage.use("onLoad", pageQuery);
  // xPage.use("onLoad", getPageName);
  // xPage.use("onLoad", getPageOptions);
  // xPage.use("onUnload", prePageOnUnload);
  // xPage.use("onShow", prePageOnShow);
  // xPage.use("onShow", getPageOptions);
  // xPage.use("onHide", prePageOnHide);
  // xPage.use("onReachBottom", prePageOnReachBottom);
  // xPage.use("onPullDownRefresh", prePageOnPullDownRefresh);
  // xPage.use("onShareAppMessage", postPageOnShareAppMessage, 'post');
}
