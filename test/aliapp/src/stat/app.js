import {
  // getAccessToken,
  getNetworkType,
  getSystemInfo,
  getLocation,
  getUserInfo,
} from '../mini/fn';
import {
  isDef,
  isUnDef,
} from '../mini/utils';
// import Log from './Log';

// app 相关统计
// 生命周期统计
// 网络类型统计
// 系统设备统计
// 用户相关信息统计
// 地理位置统计

exports.getStatInfo = function getStatInfo(scope) {
  // getNetworkType(function (res) {
  //   console.log(res);
  //   scope.mini_network_type = res['networkType'];
  // });
  // getSystemInfo(function (res){
  //   console.log(res);

  //   scope.mini_sdk_version = isUndef(res['SDKVersion']) ? '1.0.0' : res['SDKVersion'];
  //   scope.mini_phone_model = res['model'];
  //   scope.mini_pixel_ratio = res['pixelRatio'];
  //   scope.mini_window_width = res['windowWidth'];
  //   scope.mini_window_height = res['windowHeight'];
  //   scope.mini_language = res['language'];
  //   scope.mini_wechat_version = res['version'];
  //   scope.mini_system = res['system'];
  //   scope.mini_platform = res['platform'];
  // });

  // if (config['getLocation']) {
  //   console.log(res);
  //   getLocation(function (res){
  //     console.log(res);
  //     scope.mini_lat = res['latitude'];
  //     scope.mini_lng = res['longitude'];
  //     scope.mini_speed = res['speed'];
  //   });
  // }

  // getUserInfo(this);
}

exports.preAppOnLaunch = function preAppOnLaunch(opts, fnName) {
  console.log('stat pre app.js onLaunch:', this);
  // this.log = new Log({
  //   app: this,
  // })
  // workspacesInit();
  // this.log = new Log({
  //   app: this,
  //   start,
  // });

  // this.mini_src = getSRCKey(this);
  // this.mini_uuid = getUUIDKey(this);
  // this.mini_timestamp = Date.now();
  // this.mini_showtime = Date.now();
  // this.mini_duration = 0;
  // this.mini_error_count = 0;
  // this.mini_page_count = 1;
  // this.mini_first_page = 0;
  // if (isDef(opts)) {
  //   this.mini_showoption = opts;
  // } else {
  //   this.mini_showoption = {};
  // }

  // getNetworkType(this);
  // // getSystemInfo(this);
  // // getLocation(this);
  // // getUserInfo(this);
  // getAccessToken(this, 'launch');

  // handle(this, 'app', 'launch');
}

exports.preAppOnShow = function preAppOnShow(options) {
  console.log('pre app.js onShow:', this);
  // this.mini_showtime = Date.now();
  // if (isDef(options)) {
  //   this.mini_showoption = options;
  // } else {
  //   this.mini_showoption = {};
  // }
  // getAccessToken(this, 'show');
  // handle(this, 'app', 'show');

  // if (isDef(options)) {
  //   if (isDef(options['shareTicket'])) {
  //     get(this, options['shareTicket'], 'click');
  //   } else {
  //     if (isDef(options['query']) && isDef(options['query']['ald_share_src'])) {
  //       get(this, '0', 'click');
  //     }
  //   }
  // }
}

exports.postAppOnShow = function postAppOnShow() {
  console.log('post app.js onShow')
}

exports.preAppOnHide = function preAppOnHide(opts, fnName) {
  // if (this.mini_is_first_open) {
  //   this.mini_is_first_open = false;
  // }
  // this.mini_duration = Date.now() - this.mini_showtime;
  // handle(this, 'app', 'hide');
}

exports.preAppOnUnlaunch = function preAppOnUnlaunch(opts, fnName) {
  // this.mini_duration += Date.now() - this.mini_showtime;
  // handle(this, 'app', 'unLaunch');
}

exports.preAppOnError = function preAppOnError(opts, fnName) {
  // if (typeof this.mini_error_count === 'undefined') {
  //   this.mini_error_count = 1;
  // } else {
  //   this.mini_error_count++;
  // }
  // start(this, 'event', 'error_message', JSON.stringify(opts));
}
