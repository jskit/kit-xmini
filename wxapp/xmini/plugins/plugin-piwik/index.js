import PluginBase from '../../core/plugin-base';
import xmini from '../../core/xmini';
import {
  stringify,
  hexMD5,
  emitter,
  merge,
  isObject,
  isString,
} from '../../utils/index';
// import { cityMap } from './cityMap';

/**
 * 公共参数 idsite、rec、r、url、urlref、h、m、s、send_image、cookie、gt_ms、_ref、pv_id、country、region、city、lat、long、cdt
 * 访客属性 _id、uid、_idts、_idvc、_idn、_refts、_viewts、res、cvar、_cvar
 * 事件参数：action_name
 *
 * _hmt.push(['_trackPageview', pageURL]);
 * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
 * _hmt.push(['_setCustomVar', index, name, value, opt_scope]);
 * _hmt.push(['_setAccount', siteId);
 * _hmt.push(['_setAutoPageview', false]);
 */

/**
 * piwik 数据统计（负责实现数据上报）
 * 支持配置必备业务参数透传
 * 参考 https://p-2q9b.tower.im/p/2fl2
 * https://developer.matomo.org/guides/tracking-api-clients
 * 基于piwik接口的统计方案 https://p-2q9b.tower.im/p/ccuo
 * 百度统计 http://tongji.baidu.com/open/api/more?p=ref_setCustomVar
 * 暴露三个方法
 *  - piwikInit 配置接口(受限)
 *  - piwikUpdate 更新数据接口(受限)
 *  - piwikLog 接收log，之后合并公共数据，然后 push 到数组中，并触发log上报
 *    - 内部方法 pushLog reportLog send
 * https://developer.matomo.org/api-reference/tracking-api
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
    piwikLog: 'piwikLog',
  };
  _data = {};
  _logs = [];
  constructor(config) {
    super(config);
  }
  install() {
    emitter.on('stat_data', this.setData, this);
    emitter.on('stat_log', this.statLog, this);
  }
  setData(config) {
    if (!config) return;
    Object.assign(this._data, config);
  }
  getData(key) {
    return key ? this._data[key] : { ...this._data };
  }
  piwikInit(opts = {}) {
    if (!opts.reportURI || !opts.siteId || !opts.authToken) {
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
      siteId: 1,
      reportURI: 1,
      authToken: 1,
    };

    // 这里做过滤，无效的删除，非白名单的删除
    // const config = xmini.filterObj(opts, whiteList);
    this.setConfig({
      size: config.size,
      idsite: config.siteId,
      reportURI: config.reportURI,
      token_auth: config.authToken,
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
    this.setData(config);
  }
  piwikPageView(pageUrl) {
    // pv 统计页面 url 以及页面名称
    const temp = {
      action_name: pageName,
      url: pageName,
      urlref: 'refer',
      _ref: 'refer',
    };
    this.piwikLog(temp);
  }
  // cvar 暂时只有固定的数量，通过 stat_update/piwikUpdate 更新
  // piwikCustomVar(index, name, value) { }
  // 上报自定义事件
  piwikEvent(action, value = '') {
    // 上报自定义事件
    if (!action) return;
    const temp = {
      action_name: action,
      // url: '',
      e_c: category,
      e_a: action,
      e_n: name,
    };
    this.piwikLog(temp);
  }
  statLog(data) {
    if (isObject(data) && !data.type) {
      console.error('piwikLog 上报 log 为对象时，必须指定数据类型 data.type');
      return;
    }
    // if (isString(data)) {
    //   // let type = 'event';
    //   const temp = [].slice.call(arguments, +!!(data === 'event'));
    //   // if (temp.length < 2) {}
    //   data = {
    //     action_name: 'event',
    //     action: temp[0],
    //     value: temp[1] || '',
    //   };
    // }
    this.piwikLog({
      action_name: data.type,
      action: data.action,
      value: data.value,
    });
  }
  piwikLog(data) {
    // 通用结构
    if (isObject(data) && !data.action_name) {
      console.error(
        'piwikLog 上报 log 为对象时，必须指定数据类型 data.action_name'
      );
      return;
    }
    let log = {};
    const common = this.getCommon();
    switch (data.action_name) {
      case 'event':
        log = merge(common, log);
        break;
      default:
        // 默认 pv
        log = merge(common, log);
        break;
    }
    this.pushLog(log);
  }
  pushLog(log) {
    this._logs.push(stringify(log));
    this.checkLog();
  }
  checkLog() {
    if (this.reporting) return;
    if (!this._logs.length) return;
    this.reportLog();
  }
  reportLog() {
    if (this.reporting) return;
    let logs = this._logs.splice(0);

    let retryTimes = 0;
    const { httpRequest } = xmini.me;
    const { reportURI, token_auth } = this.getConfig();

    this.reporting = true;
    const reportData = () => {
      logs = logs.map(item => {
        return item
          .replace(/rq_c=(\d+)/g, (match, $1) => {
            debugger;
            const count = $1 > this.requestCount ? $1 : this.requestCount;
            return `rq_c=${count}`;
          })
          .replace(/retryTimes=(\d+)/g, (match, $1) => {
            const count = $1 > retryTimes ? $1 : retryTimes;
            return `retryTimes=${count}`;
          });
      });
      console.log('report 上报数据', JSON.stringify(logs));
      const data = {
        token_auth,
        requests: logs,
      };
      // data['rq_c'] = this.requestCount;
      this.requestCount++;
      httpRequest({
        url: `${reportURI}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
        dataType: 'json',
        success: res => {
          // 成功就销毁数据，失败就多尝试两次，还失败就暂存
          // 成功后检查是否有数据
          this.reporting = false;
          this.checkLog();
        },
        fail: err => {
          if (retryTimes < 2) {
            retryTimes++;
            // data['retryTimes'] = retryTimes;
            setTimeout(() => {
              reportData();
            }, 300);
          } else {
            this.reporting = false;
            // 把数据存起来，留待后面上报使用
            this.save();
          }
        },
      });
    };
    reportData();
  }
  getCommon() {
    const date = new Date();
    const config = this.getConfig();
    const data = this.getData();
    const devId = hexMD5(data.uuid + config.idsite).substr(8, 16);
    const temp = {
      idsite: config.idsite,
      rec: 1,
      _id: devId, // 支付宝小程序使用 user_id + idsite 前端生成ID，微信小程序使用 openid + idsite 前端生成ID
      token_auth: config.token_auth,
      ...xmini.getChannel(),

      uid: '',
      res: data.screen || '',
      // r: this.__random(6),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      send_image: 0,

      // 额外参数
      rq_c: 0,
      retryTimes: 0,

      cvar: {
        1: ['channel', data.channel],
        2: ['city_name', data.cityName],
        3: ['spm', data.spm],
        4: ['user_id', data.userId || ''],
      },
      _cvar: {
        1: ['spm', data.spm],
        2: ['openid', data.openId || null],
        3: ['city_name', data.cityName || null],
        4: ['user_id', data.userId || ''],
      },
      cdt: parseInt(date / 1000),

      // country: 'cn',
      // region: '',
      // city: location.provinceId,
      // lat: location.lat || 0,
      // long: location.long || 0,
    };

    // 支付宝版本低时，取不到省市相关信息
    const piwikId = this.getPiwikId();
    if (piwikId) {
      const { location = {} } = data;
      Object.assign(temp, {
        country: 'cn',
        region: piwikId,
        city: location.provinceId,
        lat: location.lat || 0,
        long: location.lon || 0,
      });
    }

    return temp;
  }
  getPiwikId() {
    return '';
  }
  // _getRegionId(city) {
  //   if (!city) return '';
  //   return cityIdMap[city.toLowerCase()];
  // }
  pv(url) {
    if (!url) return;
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
  event(action, value) {
    this._trackEvent(action, value);
  }
}

export default Plugin;
