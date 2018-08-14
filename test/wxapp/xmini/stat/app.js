import {
  log,
  isDef,
  isUnDef,
} from '../mini/utils';
import native from '../mini/native';
import { storage } from '../mini/storage';
import {
  // getAccessToken,
  getNetworkType,
  getSystemInfo,
  getLocation,
  getUserInfo,
} from '../mini/fn';
import {
  miniInit,
} from './fn';
import piwik from './piwik';
import $log from './log';
import {
  getAppOptions,
  // getPageOptions,
} from './channel';

// app 相关统计
// 生命周期统计
// 网络类型统计
// 系统设备统计
// 用户相关信息统计
// 地理位置统计

function getMiniInfo() {
  getNetworkType(function (res) {
    $log.set({
      mini_network_type: res['networkType'],
    });
  });
  getSystemInfo(function (res){
    $log.set({
      sdk_version: isUndef(res['SDKVersion']) ? '1.0.0' : res['SDKVersion'],
      phone_model: res['model'],
      pixel_ratio: res['pixelRatio'],
      window_width: res['windowWidth'],
      window_height: res['windowHeight'],
      language: res['language'],
      wechat_version: res['version'],
      system: res['system'],
      platform: res['platform'],
    });
  });

  if (config['getLocation']) {
    getLocation(function (res){
      log.log(res);
      $log.set({
        mini_lat: res['latitude'],
        mini_lng: res['longitude'],
        mini_speed: res['speed'],
      })
    });
  }

  getUserInfo(this);
}

exports.getMiniInfo = getMiniInfo;

exports.preAppOnLaunch = function preAppOnLaunch(options, fnName) {
  log.log('stat pre app.js onLaunch:', this);
  log.warn('app.js options:', JSON.stringify(options));
  const {
    me,
    appName,
  } = native.get();
  const data = miniInit();

  // const logData = {
  //   timestamp: Date.now(),
  //   showtime: Date.now(),
  //   error_count: 0,
  //   page_count: 1,
  //   first_page: 0,
  //   showoption: options || {},
  // };

  // log.warn('miniInit:', logData);
  let userInfo;
  if (typeof this.getUserInfo === 'function') {
    let userInfo = this.getUserInfo();
  }
  const channelInfo = storage.get('channelInfo') || {};
  // 必须设定
  // piwik.init({
  //   siteId: 2,
  //   category: appName,  // 默认事件分类
  //   channelId: 'iqg-aliapp',      // 默认channelId
  //   spm: 'iqg-aliapp',            // 默认spm
  // });

  // piwik.update({
  //   userId: userInfo.userId || uuid,  // 用户Id
  //   openId: userInfo.openId || uuid,  // 用于用户唯一标识
  //   // channel: channelInfo.channel_id || '',
  //   spm: channelInfo.spm || '',
  // });

  // getNetworkType(this);
  // // getSystemInfo(this);
  // // getLocation(this);
  // // getUserInfo(this);
  // getAccessToken(this, 'launch');

  // appLog(this, 'app', 'launch');
}

exports.preAppOnShow = function preAppOnShow(options = {}) {
  log.log('pre app.js onShow:', this);
  log.warn('app.js options:', JSON.stringify(options));
  const {
    me,
    appName,
  } = native.get();
  me.$appQuery = getAppOptions(options);
}

exports.postAppOnShow = function postAppOnShow() {
  log.log('post app.js onShow')
}

exports.preAppOnHide = function preAppOnHide(opts, fnName) {
  const {
    me,
  } = native.get();
}

exports.preAppOnUnlaunch = function preAppOnUnlaunch(opts, fnName) {

}

exports.preAppOnError = function preAppOnError(opts, fnName) {

}
