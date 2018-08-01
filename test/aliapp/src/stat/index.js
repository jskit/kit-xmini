
import {
  uuid,
} from '../mini/utils';

import piwik from './piwik';
import {
  getAppOptions,
  getPageOptions,
} from './channel';
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
  console.log(':::x-mini add stat');
  const {
    storage,
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  Object.assign(me, {
    piwikEvent: piwik.onTrackEvent,
    onPageCreate: piwik.onPageCreate,
    onPageDestroy: piwik.onPageDestroy,
    updateTrackInfo: piwik.updateTrackInfo,
    getTrackInfo: piwik.getTrackInfo,
    getCurrentPagePath: () => {
      let p = getCurrentPages();
      if (p && p.length > 0) {
        return p[p.length - 1];
      }
      return null;
    },
  });

  xApp.use("onError", preAppOnError);
  xApp.use("onLaunch", getAppOptions);
  xApp.use("onLaunch", preAppOnLaunch);
  xApp.use("onLaunch", postAppOnLaunch, 'post');
  xApp.use("onShow", getAppOptions);
  xApp.use("onShow", preAppOnShow);
  xApp.use("onShow", postAppOnShow, 'post');
  xApp.use("onHide", preAppOnHide);
  xApp.use("onUnlaunch", preAppOnUnlaunch);

  xPage.use("onLoad", prePageOnLoad);
  xPage.use("onLoad", getPageOptions);
  xPage.use("onUnload", prePageOnUnload);
  xPage.use("onShow", prePageOnShow);
  xPage.use("onShow", getPageOptions);
  xPage.use("onHide", prePageOnHide);
  xPage.use("onReachBottom", prePageOnReachBottom);
  xPage.use("onPullDownRefresh", prePageOnPullDownRefresh);
  xPage.use("onShareAppMessage", postPageOnShareAppMessage, 'post');
}
