
import {
  log,
  uuid,
} from '../mini/utils';
import { storage } from '../mini/storage';

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
  log.log('stat post xApp.js onLaunch:', this);
}

exports.init = function(opts = {}) {
  log.warn(':::x-mini add stat');
  const {
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  Object.assign(piwik, {
    $log: piwik.onTrackEvent,
    $logUpdate: piwik.update,
  });

  Object.assign(me, {
    $log: (...rest) => {
      piwik.onTrackEvent(...rest);
    },
    $logInit: (...rest) => {
      piwik.init(...rest);
    },
    $logUpdate: (...rest) => {
      piwik.update(...rest);
    },
    $logReport: (...rest) => {
      piwik.report(...rest);
    },
    $getChannel: (...rest) => {
      piwik.getChannel(...rest);
    },
    $logPv: (...rest) => {
      piwik.onPageView(...rest);
    },
    $logCurrentPage: () => {
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
  // xPage.use("onScrollToLower", prePageOnReachBottom);
  // xPage.use("onReachBottom", prePageOnReachBottom);
  xPage.use("onPullDownRefresh", prePageOnPullDownRefresh);
  xPage.use("onShareAppMessage", postPageOnShareAppMessage, 'post');
}
