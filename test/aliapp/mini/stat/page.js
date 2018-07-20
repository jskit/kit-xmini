
import {
  isDef,
  isUnDef,
  isEmptyObject,
} from '../utils';

// page 相关统计
exports.prePageOnLoad = function prePageOnLoad(opts, fnName) {
  console.log('pre page.js onLoad: ', this);
}

exports.prePageOnUnload = function prePageOnUnload(opts, fnName) {
  const app = getApp();
  // init(app, this, 'page_unload');
}

exports.prePageOnShow = function prePageOnShow(opts, fnName) {
  const app = getApp();
  console.log('pre page.js onShow:', this);
  // init(app, this, 'page_onshow');
}

exports.prePageOnHide = function prePageOnHide(opts, fnName) {
  const app = getApp();
  // init(app, this, 'page_onhide');
}

exports.prePageOnReachBottom = function prePageOnReachBottom(opts, fnName) {
  const app = getApp();
  // start(app, 'event', 'reachbottom', 1);
}

exports.prePageOnPullDownRefresh = function prePageOnPullDownRefresh(opts, fnName) {
  const app = getApp();
  // start(app, 'event', 'pulldownrefresh', 1);
}

exports.postPageOnShareAppMessage = function postPageOnShareAppMessage(arr, shareInfo) {

}
