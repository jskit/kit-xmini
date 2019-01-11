import PluginBase from '../../core/plugin-base';
import { xmini } from '../../core/xmini';
import { emit } from 'cluster';

function workspaceInit() {}

/**
 * 负责实现数据收集
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'stat';
  events = {};
  methods = {
    getStatData: 'getData',
  };
  _data = {};
  _stat = [];
  constructor(config) {
    super(config);
  }
  setData(options = {}) {
    return Object.assign(this._data, options);
  }
  getData(key) {
    return key ? this._data[key] : { ...this._data };
  }
  getStatData(options) {
    const data = this._stat;
    this._stat = [];
    return data;
  }
  log(type, value) {
    // 数据类型，app page component event
    // 每触发一次抛出一次数据，数据可以被其他插件接收（通过特定的形式）
    const temp = this.getData();
    // this._stat.push(temp);
    // emit(temp);
  }
  preAppOnError(err) {
    if (typeof this.mini_error_count === 'undefined') {
      this.mini_error_count = 1;
    } else {
      this.mini_error_count++;
    }
    this.log('event', 'error_message', JSON.stringify(err));
  }
  preAppOnLaunch(options) {
    const { me } = xmini;
    workspaceInit();

    this.setData({
      mini_uuid: xmini.me.$getUUID();
      mini_timestamp: Date.now();
      mini_showtime: Date.now();
      mini_duration: 0;
      mini_error_count: 0;
      mini_page_count: 1;
      mini_first_page: 0;
    });

    this.setShowOptions(options);

    me.$getNetworkType(res => {
      this.setData({
        mini_network_type: res.networkType,
      });
    });
    const systemInfo = me.$getSystemInfo();
    this.setData({
      mini_host: systemInfo['app'], // 当前运行的客户端 alipay wechat
      mini_platform: systemInfo['platform'], // 客户端平台 Android iOS
      mini_system_version: systemInfo['system'], // 操作系统版本
      mini_host_version: systemInfo['version'], // 宿主版本号
      mini_sdk_version: systemInfo['SDKVersion'] || '1.0.0', // 客户端基础库版本
      mini_language: systemInfo['language'], // 设置的语言
      mini_phone_brand: systemInfo['brand'], // 手机品牌
      mini_phone_model: systemInfo['model'], // 手机型号
      mini_pixel_ratio: systemInfo['pixelRatio'], // 设备像素比
      mini_screen_width: systemInfo['screenWidth'], // 屏幕宽高
      mini_screen_height: systemInfo['screenHeight'],
      mini_window_width: systemInfo['windowWidth'], // 可使用窗口宽高
      mini_window_height: systemInfo['windowHeight'],
    });
    me.$getLocation(res => {
      this.setData({
        mini_lat: res.latitude || 0,
        mini_lng: res.longitude || 0,
        mini_speed: res.speed || 0,
      });
    });
    // getUserInfo();

    this.log('app', 'launch');
  }
  preAppOnShow(options = {}) {
    this.mini_showtime = Date.now();
    this.setShowOptions(options);
    // log('app', 'show');
    if (options['shareTicket']) {

    }
  },
  setShowOptions(options = {}) {
    this.mini_showoption = options;
  }
  preAppOnHide() {
    this.setData({
      mini_duration: Date.now() - this.getData('mini_showtime');
    });
    // if (this.mini_is_first_open) this.mini_is_first_open = false;
    this.log('app', 'hide');
  }
  preAppOnUnlaunch() {
    this.setData({
      mini_duration: Date.now() - this.getData('mini_showtime');
    });
    this.log('app', 'unLaunch');
  }

  prePageOnLoad() {
    this.log('page', 'load');
  }
  prePageOnReady() {
    this.log('page', 'ready');
  }
  prePageOnShow() {
    this.log('page', 'show');
  }
  prePageOnHide() {
    this.log('page', 'hide');
  }
  prePageOnUnload() {
    this.log('page', 'unload');
  }
}

export default Plugin;
