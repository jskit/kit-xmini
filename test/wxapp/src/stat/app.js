import {
  isDef,
  isUnDef,
} from '../mini/utils';
import native from '../mini/native';
import {
  // getAccessToken,
  getNetworkType,
  getSystemInfo,
  getLocation,
  getUserInfo,
} from '../mini/fn';
import {
  getUUID,
  miniInit,
} from './fn';
import piwik from './piwik';
import log from './log';

// app 相关统计
// 生命周期统计
// 网络类型统计
// 系统设备统计
// 用户相关信息统计
// 地理位置统计

function getMiniInfo() {

  // this.$log = new Log({
  //   app: this,
  //   // start,
  // })


  getNetworkType(function (res) {
    console.log(res);
    scope.mini_network_type = res['networkType'];
  });
  getSystemInfo(function (res){
    const systemInfo = {
      sdk_version: isUndef(res['SDKVersion']) ? '1.0.0' : res['SDKVersion'],
      phone_model: res['model'],
      pixel_ratio: res['pixelRatio'],
      window_width: res['windowWidth'],
      window_height: res['windowHeight'],
      language: res['language'],
      wechat_version: res['version'],
      system: res['system'],
      platform: res['platform'],
    };
  });

  if (config['getLocation']) {
    console.log(res);
    getLocation(function (res){
      console.log(res);
      scope.mini_lat = res['latitude'];
      scope.mini_lng = res['longitude'];
      scope.mini_speed = res['speed'];
    });
  }

  getUserInfo(this);
}

exports.getMiniInfo = getMiniInfo;

exports.preAppOnLaunch = function preAppOnLaunch(options, fnName) {
  console.log('stat pre app.js onLaunch:', this);
  const {
    storage,
  } = native.get();
  const data = miniInit();

  const logData = {
    uuid: getUUID.call(this),
    timestamp: Date.now(),
    showtime: Date.now(),
    error_count: 0,
    page_count: 1,
    first_page: 0,
    showoption: options || {},
  };

  console.warn('miniInit:', logData);

  // getNetworkType(this);
  // // getSystemInfo(this);
  // // getLocation(this);
  // // getUserInfo(this);
  // getAccessToken(this, 'launch');

  // appLog(this, 'app', 'launch');
}

exports.preAppOnShow = function preAppOnShow(options) {
  console.log('pre app.js onShow:', this);
  const {
    me,
    appName,
    storage,
  } = native.get();
  const userInfo = storage.get('userInfo') || {};
  const channel = storage.get('channel') || {};
  const logInfo = {
    siteId: 2,
    url: 'https://tongji.haoshiqi.net/piwik.php',
    siteId: 6,
    category: appName,     // 默认事件分类
    userId: userInfo.userId || '',  // 用户Id
    openId: userInfo.openId || '',  // 用于用户唯一标识
    channel: channel.channel_id || '',
    spm: channel.spm || '',
  }
  piwik.init(logInfo);
}

exports.postAppOnShow = function postAppOnShow() {
  console.log('post app.js onShow')
}

exports.preAppOnHide = function preAppOnHide(opts, fnName) {

}

exports.preAppOnUnlaunch = function preAppOnUnlaunch(opts, fnName) {

}

exports.preAppOnError = function preAppOnError(opts, fnName) {

}
