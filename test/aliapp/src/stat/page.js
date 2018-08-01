import {
  isDef,
  isUnDef,
  stringify,
  isEmptyObject,
} from '../mini/utils';
import native from '../mini/native';
import piwik from './piwik';

// page 相关统计
exports.prePageOnLoad = function prePageOnLoad(opts, fnName) {
  console.log('pre page.js onLoad: ', this);
  const { pageQuery = {}, pagePath } = this;
  piwik.updateTrackInfo({
    path: pagePath,
    spm: pageQuery.spm || '',
    channelId: pageQuery.channel_id || '',
    refer: pageQuery.refer || 'istoppage',
  });
}

exports.prePageOnUnload = function prePageOnUnload(opts, fnName) {
  const app = getApp();

  const { pageQuery, pagePath } = this;
  // 统计页面关闭事件
  const p = this.getPageName();
  let param = stringify(pageQuery);
  // my.onPageDestroy('pages/' + p + '/' + p + (param ? "?" + param : ''));
  piwik.onPageDestroy(pagePath + (param ? '?' + param : ''));
  // pageLog(app, this, 'page_unload');
}

exports.prePageOnShow = function prePageOnShow(opts, fnName) {
  const app = getApp();
  console.log('pre page.js onShow:', this);
  // pageLog(app, this, 'page_onshow');

  const { pageQuery = {}, pagePath } = this;

  // 统计页面PV
  const p = this.getPageName();
  let param = stringify(pageQuery);
  piwik.onPageCreate('pages/' + p + '/' + p + (param ? "?" + param : ''), p);
  piwik.updateTrackInfo({
    path: pagePath,
    spm: pageQuery.spm || '',
    channelId: pageQuery.channel_id || '',
    refer: pageQuery.refer || 'istoppage',
  });
}

exports.prePageOnHide = function prePageOnHide(opts, fnName) {
  const app = getApp();
  // pageLog(app, this, 'page_onhide');
}

exports.prePageOnReachBottom = function prePageOnReachBottom(opts, fnName) {
  const app = getApp();
  // eventLog(app, 'event', 'reachbottom', 1);
}

exports.prePageOnPullDownRefresh = function prePageOnPullDownRefresh(opts, fnName) {
  const app = getApp();
  // eventLog(app, 'event', 'pulldownrefresh', 1);
}

exports.postPageOnShareAppMessage = function postPageOnShareAppMessage(arr, shareInfo) {

}
