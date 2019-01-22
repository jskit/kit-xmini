import PluginBase from '../../core/plugin-base';
import xmini from '../../core/xmini';
import { emitter } from '../../utils/index';

function workspaceInit() {}

/**
 * 负责实现数据收集
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'stat';
  events = {
    preAppOnError: 'preAppOnError',
    preAppOnLaunch: 'preAppOnLaunch',
    preAppOnShow: 'preAppOnShow',
    preAppOnHide: 'preAppOnHide',
    preAppOnUnlaunch: 'preAppOnUnlaunch',
    prePageOnLoad: 'prePageOnLoad',
    prePageOnReady: 'prePageOnReady',
    prePageOnShow: 'prePageOnShow',
    prePageOnHide: 'prePageOnHide',
    prePageOnUnload: 'prePageOnUnload',
  };
  methods = {
    // getStatData: 'getData',
  };
  _data = {};
  constructor(config) {
    super(config);
    this.setData({
      startTime: Date.now(),
    });
  }
  setData(options = {}) {
    emitter.emit('stat_data', { ...options }, this);
    Object.assign(this._data, options);
  }
  getData(key) {
    return key ? this._data[key] : { ...this._data };
  }
  statLog(type, action, value, category) {
    // 数据类型，app page component event
    // 每触发一次抛出一次数据，数据可以被其他插件接收（通过特定的形式）
    // 不同的触发，产生的数据也不同，需要按类别进行过滤处理
    // 参考百度统计，输出规范化的数据
    // _hmt.push(['_trackPageview', pageURL]);
    // _hmt.push(['_trackEvent', category, action, opt_label, optValue]);
    // _hmt.push(['_setCustomVar', index, name, value, opt_scope]);
    // _hmt.push(['_setAccount', siteId);
    // _hmt.push(['_setAutoPageview', false]);

    // _trackPageview, pageURL
    // _trackEvent, category, action, value
    // _setCustomVar, index, name, value
    // let temp = this.getData();
    // 触发 更新 事件 以及 log
    switch (type) {
      case 'event':
      case 'pv':
      default:
        emitter.emit(
          'stat_log',
          {
            type,
            action,
            value,
            category,
          },
          this
        );
      // do nothing...
    }
  }
  preAppOnError(err) {
    let count = this.getData('errorCount') || 0;
    this.setData({
      errorCount: count + 1,
    });
    // 这里自定义事件不上报错误
    // this.statLog('event', 'error', JSON.stringify(err));
    // emitter.emit('stat', ['TrackEvent', 'error_message', JSON.stringify(err)], this);
  }
  preAppOnLaunch(options) {
    workspaceInit();
    const that = this;

    // 初始化
    this.setData({
      uuid: xmini.me.$getUUID(),
      timestamp: Date.now(),
      showTime: Date.now(),
      duration: 0,
      errorCount: 0,
      pageCount: 1,
      firstPage: 0,
      showOptions: options,
      // 下面几个暂无意义，需要对应的 event 总数累加
      // 否则需要本地拿到上一次的次数累加才有效
      launchTimes: 0,
      showTimes: 0,
      hideTimes: 0,
    });

    // 异步获取网络以及定位相关信息
    xmini.me.getNetworkType({
      success(res) {
        that.setData({
          networkType: res.networkType || 'nt_no_name',
        });
      },
      fail(err) {
        that.setData({
          networkType: 'nt_fail',
        });
      },
    });
    xmini.me.$getLocation(res => {
      console.warn('geo');
      console.log(res);
      this.setData({
        location: res,
        // latitude: res.latitude || 0,
        // longitude: res.longitude || 0,
        // speed: res.speed || 0,
        // province: res.province || 0,
        // city: res.city || 0,
        // district: res.district || 0,
      });
    });
    // 同步获取系统信息
    const systemInfo = xmini.me.$getSystemInfo();
    this.setData({
      // platform: systemInfo['platform'], // 平台、终端
      os: systemInfo.platform, // 客户端平台 Android iOS
      osVersion: systemInfo.system, // 操作系统版本
      host: systemInfo.app || 'wechat', // 当前运行的客户端 alipay wechat
      hostVersion: systemInfo.version, // 宿主版本号
      sdkVersion: systemInfo.SDKVersion || '1.0.0', // 客户端基础库版本
      language: systemInfo.language, // 设置的语言
      brand: systemInfo.brand, // 手机品牌
      model: systemInfo.model, // 手机型号
      pixelRatio: systemInfo.pixelRatio, // 设备像素比
      screenWidth: systemInfo.screenWidth, // 屏幕宽高
      screenHeight: systemInfo.screenHeight,
      windowWidth: systemInfo.windowWidth, // 可使用窗口宽高
      windowHeight: systemInfo.windowHeight,
    });
    // 用户信息，需要业务设定，登录后有
    // getUserInfo();

    // this.statLog('event', 'app_launch', '', 'lifecycle');
  }
  preAppOnShow(options = {}) {
    this.setData({
      appShowTime: Date.now(),
      showOptions: options,
      // showTimes: this.getData('showTimes') + 1,
    });
    // if (options.shareTicket) { }
    // 上报启动时长(注意保活 这个不好处理)
    // this.statLog('event', 'appStartTimes', Date.now() - startTime);
  }
  preAppOnHide() {
    // const appDuration = Date.now() - this.getData('appShowTime');
    // this.setData({
    //   appDuration,
    //   // hideTimes: this.getData('hideTimes') + 1,
    // });
    // this.statLog('event', 'app_hide', appDuration, 'lifecycle');
    // 上报使用时长
  }
  preAppOnUnlaunch() {
    // 强制上报一次数据
    // const appDuration = Date.now() - this.getData('appShowTime');
    // this.setData({
    //   appDuration,
    //   // hideTimes: this.getData('hideTimes') + 1,
    // });
    // this.statLog('event', 'app_unlaunch', appDuration, 'lifecycle');
    // 上报使用时长
  }

  prePageOnLoad(query = {}) {
    this.setData({
      pageQuery: query,
      pageStartTime: Date.now(),
    });
    // this.statLog('event', 'page_load');
  }
  prePageOnReady() {
    // const duration = Date.now() - this.getData('pageStartTime');
    // this.statLog('event', 'page_ready', duration, 'lifecycle');
  }
  prePageOnShow(opts = {}, ctx) {
    const pagePath = ctx.route;
    const data = {
      pageCount: this.getData('pageCount') + 1,
      showTime: 0,
      lastPage: pagePath,
      referer: this.getData('lastPage') || '',
    };
    if (!this.getData('firstPage')) {
      /* eslint dot-notation: 0 */
      data['firstPage'] = pagePath;
    }
    this.setData(data);

    // pv, url, referer
    this.statLog('pv', pagePath, data['referer']);
    // 此处存储当前 path 路径，并上报一次 pv
    // this.statLog('event', 'page', 'show');
    // this.statLog('pv', 'pageName', url);
  }
  prePageOnHide() {
    // const duration = Date.now() - this.getData('showTime');
    // this.setData({
    //   duration,
    // });
    // this.statLog('event', 'page_hide', duration, 'lifecycle');
    // 上报当前页面浏览时长
  }
  prePageOnUnload() {
    // const duration = Date.now() - this.getData('showTime');
    // this.setData({
    //   duration,
    // });
    // this.statLog('event', 'page_unload', duration, 'lifecycle');
    // 上报当前页面浏览时长
  }
}

export default Plugin;
