import {
  log,
  isDef,
  isUnDef,
  stringify,
  isEmptyObject,
} from '../mini/utils';
import native from '../mini/native';
import { storage } from '../mini/storage';
import piwik from './piwik';
import {
  // getAppOptions,
  getPageOptions,
} from './channel';

// page 相关统计
exports.prePageOnLoad = function prePageOnLoad(opts, fnName) {
  log.log('pre page.js onLoad: ', this);
  const {
    me,
  } = native.get();

  // 要求页面跳转要透传spm，返回时要恢复spm
  // 若无统计相关数据，则使用之前的
  const { pageQuery = {}, fullPagePath } = this;
  me.$logUpdate({
    path: fullPagePath,
    spm: pageQuery.spm,
    channel: pageQuery.channel_id,
    refer: pageQuery.refer || 'istoppage',
  });
}

exports.prePageOnShow = function prePageOnShow(opts, fnName) {
  const app = getApp();
  log.log('pre page.js onShow:', this);
  // pageLog(app, this, 'page_onshow');
  const {
    me,
  } = native.get();
  const { pageQuery = {}, fullPagePath } = this;

  // 统计页面PV
  const p = this.getPageName();
  let param = stringify(pageQuery);
  me.$logUpdate({
    path: fullPagePath,
    spm: pageQuery.spm,
    channel: pageQuery.channel_id,
    refer: pageQuery.refer || 'istoppage',
  });
  // me.$updateChannel({
  //   spm: pageQuery.spm,
  //   channel: pageQuery.channel_id,
  // });
  me.$logPv('pages/' + p + '/' + p + (param ? "?" + param : ''), p);
}

exports.prePageOnHide = function prePageOnHide(opts, fnName) {
  const app = getApp();
  // pageLog(app, this, 'page_onhide');
}

exports.prePageOnUnload = function prePageOnUnload(opts, fnName) {
  const app = getApp();
  const {
    me,
  } = native.get();
  const { pageQuery, pagePath } = this;
  // 统计页面关闭事件
  const p = this.getPageName();
  let param = stringify(pageQuery);
  me.$log('end_page', {
    'end_page': pagePath + (param ? '?' + param : ''),
  });
  // pageLog(app, this, 'page_unload');
}

exports.prePageOnReachBottom = function prePageOnReachBottom(opts, fnName) {
  const {
    me,
  } = native.get();
  const app = getApp();
  // eventLog(app, 'event', 'reachbottom', 1);
  me.$log('reach_bottom', {
    pageName: this.getPageName(),
  });
}

exports.prePageOnPullDownRefresh = function prePageOnPullDownRefresh(opts, fnName) {
  const {
    me,
  } = native.get();
  const app = getApp();
  me.$log('pulldown_refresh', {
    pageName: this.getPageName(),
  });
  // eventLog(app, 'event', 'pulldownrefresh', 1);
}

exports.postPageOnShareAppMessage = function postPageOnShareAppMessage(arr, shareInfo) {
  const {
    me,
  } = native.get();
  me.$log('share_message', {
    pageName: this.getPageName(),
  });
}
