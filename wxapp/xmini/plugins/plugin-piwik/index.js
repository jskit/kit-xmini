import PluginBase from '../../core/plugin-base';
import xmini from '../../core/xmini';
import { stringify, hexMD5, emitter } from '../../utils/index';
import { cityMap } from './cityMap';

/**
 * piwik 数据统计（负责实现数据上报）
 * 支持配置必备业务参数透传
 * 参考 https://p-2q9b.tower.im/p/2fl2
 * https://developer.matomo.org/guides/tracking-api-clients
 * 基于piwik接口的统计方案 https://p-2q9b.tower.im/p/ccuo
 * 百度统计 http://tongji.baidu.com/open/api/more?p=ref_setCustomVar
 * 为优化性能，暴露一个方法，所有日志 push 进去，类似百度统计
 * https://developer.matomo.org/api-reference/tracking-api
 *
 * 公共参数 idsite、rec、r、url、urlref、h、m、s、send_image、cookie、gt_ms、_ref、pv_id、country、region、city、lat、long、cdt
 * 访客属性 _id、uid、_idts、_idvc、_idn、_refts、_viewts、res、cvar、_cvar
 * 事件参数：action_name
 *
 * _hmt.push(['_trackPageview', pageURL]);
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 * _hmt.push(['_setCustomVar', index, name, value, opt_scope]);
 * _hmt.push(['_setAccount', siteId);
 * _hmt.push(['_setAutoPageview', false]);
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'piwik';
  events = {};
  requestCount = 0;
  methods = {
    piwikInit: 'piwikInit',
    piwikReport: 'piwikReport',
  };
  _data = {};
  _piwik = [];
  _caches = [];
  constructor(config) {
    super(config);
    emitter.on('stat_update', res => {
      this.setData(res);
    });
    emitter.on('log', res => {
      this.piwikReport(res);
    });
  }
  setData(config = {}) {
    Object.assign(this._data, config);
    console.log('config: ', this._data);
  }
  getData(key) {
    return key ? this._data[key] : { ...this._data };
  }
  upLog(data) {
    let retryTimes = 0;
    const upData = function () {
      this.requestCount++;
      data['rq_c'] = this.requestCount;
      wx.request({
        url : 'https://piwik.php',
        data,
        method,
        success(res) {
        },
        fail(err) {
          if (retryTimes < 2) {
            retryTimes++;
            data['retryTimes'] = retryTimes;
            upData();
          }
        },
      });
    }
    upData();
  }
  piwikInit(opts = {}) {
    if (!opts.reportURI || !opts.siteId || !opts.token_auth) {
      console.error(
        `请检查 plugin ${
          this.name
        } 的设置，初始化必须配置 reportURI, siteId, token_auth`
      );
      return;
    }
    // 只允许设置以下值
    const whiteList = {
      size: 1,
      idsite: 1,
      reportURI: 1,
      token_auth: 1,
    };

    const config = xmini.filterObj(opts, whiteList);
    this.setConfig({
      ...config,
      rec: 1,
    });
  }
  piwikUpdate(opts = {}) {
    // 只允许更新以下值
    const whiteList = {
      openId: 1,
      location: 1,
      userId: 1,
      screen: 1,
      cityName: 1,
      path: 1,
      refer: 1,
      ...xmini.getChannelFilter(),
    };
    // ['screen', 'userId', 'openId', 'location', 'cityName', 'path', 'refer', 'channel', 'spm']
    const config = xmini.filterObj(opts, whiteList);
    this.setConfig(config);
  }
  piwikCommon() {
    // const date = new Date();
    // const devId = hexMD5(this.config.uuid + this.config.siteId).substr(8, 16);
    // const piwikId = this.__getRegionId(this.config.location.provinceId || '');

    // idsite: this.config.siteId,
    // rec: 1,
    // _id: devId,
    // uid: '',
    // res: this.config.screen || '',
    // r: this.__random(6),
    // h: date.getHours(),
    // m: date.getMinutes(),
    // s: date.getSeconds(),
    // send_image: 0,

    // cvar: JSON.stringify({
    //   "1": ["channel", this.config.channel],
    //   "2": ["city_name", this.config.cityName],
    //   "3": ["spm", this.config.spm],
    //   "4": ["user_id", this.config.userId || ''],
    // }),
    // _cvar: JSON.stringify({
    //   "1": ["spm", this.config.spm],
    //   "2": ["openid", this.config.openId || null],
    //   "3": ["city_name", this.config.cityName || null],
    //   "4": ["user_id", this.config.userId || ''],
    // }),
    // cdt: parseInt(new Date() / 1000),

    return {
      _id: '',
      user_id: '',
      channel: '',
      spm: '',
      statId: '',
      city: '',
      lat: '',
      long: '',
      time: '',
      version: '',
      systemInfo: '',
    };
  }
  piwikReport(log = {}) {
    const temp = this._caches;
    const data = {
      token_auth: '5db85cb262e7423aa6bdca05a0283643',
      requests: [...temp],
    };

    console.log('report: ', log);
    // this._send(log);
  }
  _send(data) {
    const that = this;
    const { reportURI } = this.getConfig();
    const { httpRequest } = xmini.me;
    httpRequest({
      url: `${reportURI}?${stringify(xmini.getChannel())}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
      dataType: 'json',
      success(res) {
        if (callback && typeof callback === 'function') {
          callback();
        }
      },
      fail(err) {
        that._cache = that._cache.concat(data);
      },
      complete() {},
    });
  }
  _trackPageView(pageURL, pageName) {
    // 统计页面 url 以及页面名称
    const temp = {
      urlref: 'refer',
      _ref: 'refer',
      action_name: pageName,
      url: pageName,
    };
    this.report(temp);
  }
  _setCustomVar() {}
  // 事件统计
  _trackEvent(actionId, value = '') {
    const temp = {
      action_name: actionId,
      url: '',
      e_c: '',
      e_a: '',
      e_n: '',
    };
    this.report();
  }
  _getRegionId(city) {
    if (!city) return '';
    return cityIdMap[city.toLowerCase()];
  }
  // page
  pv(...rest) {
    // 需要上报当前 url 以及 refer
    // action_name
    const pageInfo = xmini.me.$getPageInfo();
    this.piwikUpdate({
      path: pageInfo.pagePath,
      refer: pageInfo.refer || 'istoppage',
      ...xmini.getChannel(),
    });
    this._trackPageView(...rest);
  }
  //
  cv(...rest) {
    this._setCustomVar(...rest);
  }
  // eventName, data
  event(...rest) {
    this._trackEvent(...rest);
  }
}

export default Plugin;
