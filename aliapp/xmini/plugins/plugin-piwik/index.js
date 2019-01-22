import PluginBase from '../../core/plugin-base';
import xmini from '../../core/xmini';
import {
  stringify,
  hexMD5,
  emitter,
  merge,
  isObject,
  filterObj,
  compactObject,
  // isString,
} from '../../utils/index';
import { regionMap } from './regionMap';

import { Storage } from '../../core/storage';

const storagePiwik = new Storage('piwik', 31536000);

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
 *    - 内部方法 pushLog piwikReport send
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
    piwikUpdate: 'piwikUpdate',
    piwikEvent: 'piwikEvent',
  };
  _data = {};
  _logs = [];
  constructor(config) {
    super({});
    this.piwikInit(config);
    this._logs = (storagePiwik.get('piwikLog') || []).concat(this._logs);
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
  // 不需要这个，因为直接 new 时，就可以配置好了
  piwikInit(opts = {}) {
    if (!opts.reportURI || !opts.siteId || !opts.authToken) {
      console.error(
        `请检查 plugin ${
          this.name
        } 的设置，初始化必须配置 reportURI, siteId, authToken`
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
    const temp = filterObj(opts, whiteList);
    const config = {
      size: temp.size || 5,
      idsite: temp.siteId,
      reportURI: temp.reportURI,
      token_auth: temp.authToken,
      rec: 1,
    };
    this.setConfig(compactObject(config));
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
    // console.warn(opts);
    const config = filterObj(opts, whiteList);
    // console.warn('更新用户信息');
    this.setData(config);
  }
  piwikPageView(pagePath, referer) {
    console.warn('pv');
    // pv 统计页面 url 以及页面名称
    // const { pageName, pagePath, referer = '' } = xmini.me.$getPageInfo();
    let url = pagePath;
    if (!/^http/.test(pagePath)) {
      url = 'http://' + pagePath;
    }
    // const { lastPage } = this.getData();
    // pv 信息都应该从 pageInfo 上取
    const data = {
      url,
      action_name: pagePath,
      urlref: referer || 'istoppage',
      _ref: referer,
    };
    this.setData({
      url,
      urlref: referer || 'istoppage',
      _ref: referer,
    });
    this.pushLog(data);
  }
  // cvar 暂时只有固定的数量，通过 stat_update/piwikUpdate 更新
  // piwikCustomVar(index, name, value) { }
  // 上报自定义事件
  piwikEvent(action, value = '', category = '') {
    console.warn('event');
    // 上报自定义事件
    if (!action) return;
    // 系统生命周期的事件，别用 action 直接用，category=lifecycle
    // 用户交互事件，使用 action 区别行为
    // 曝光事件，使用 action 以 ex_ 开头, category=exposure
    const temp = {
      e_c: category,
      e_a: action,
      e_n: value,
    };
    let immediately = false;
    if (action === 'app') {
      if (value === 'hide' || value === 'unlaunch') {
        immediately = true;
      }
    }
    this.pushLog(temp, immediately);
  }
  // 暂时只支持两种log：event pv
  statLog(data) {
    if (!isObject(data) || !data.type) {
      console.error('statLog 上报数据格式必须为对象，且必须指定type 和 action');
      return;
    }
    switch (data.type) {
      case 'event':
        this.piwikEvent(data.action, data.value, data.category);
        break;
      case 'pv':
        this.piwikPageView(data.action, data.value, data.category);
        break;
      default:
        // doNothing
        break;
    }
  }
  piwikLog(data) {
    // 通用结构
    if (!isObject(data) && !data.action_name) {
      console.error(
        'piwikLog 上报数据格式必须为对象，且必须指定 action_name 和 action'
      );
      return;
    }
    this.pushLog(data);
  }
  pushLog(data, immediately) {
    const log = merge(this.getCommon(), data);
    console.warn(log);
    this._logs.push(`?${stringify(log)}`);
    this.checkLog();
  }
  checkLog(immediately) {
    if (this.reporting) return;
    if (!this._logs.length) return;
    this.piwikReport(immediately);
  }
  piwikReport(immediately) {
    // "?urlref=istoppage&_ref=istoppage&action_name=index&url=http%3A%2F%2Fpages%2Findex%2Findex%3Fspm%3Daliapp%26channel_id%3Daliapp%26ide_internal_page%3Dpages%252Findex%252Findex%26port%3D60154&idsite=5&rec=1&_id=c3b80d787042a4c8&uid=&res=375x667&r=366229&h=17&m=25&s=17&send_image=0&cvar=%7B%221%22%3A%5B%22channel%22%2C%22aliapp%22%5D%2C%222%22%3A%5B%22city_name%22%2Cnull%5D%2C%223%22%3A%5B%22spm%22%2C%22aliapp%22%5D%2C%224%22%3A%5B%22user_id%22%2C%22%22%5D%7D&_cvar=%7B%221%22%3A%5B%22spm%22%2C%22aliapp%22%5D%2C%222%22%3A%5B%22openid%22%2Cnull%5D%2C%223%22%3A%5B%22city_name%22%2Cnull%5D%2C%224%22%3A%5B%22user_id%22%2C%22%22%5D%7D&cdt=1547803517"
    if (this.reporting && !immediately) return;
    let logs = this._logs.splice(0);

    let retryTimes = 0;
    const { httpRequest } = xmini.me;
    const { reportURI, token_auth } = this.getConfig();

    this.reporting = true;
    const reportData = () => {
      // logs = logs.map(item => {
      //   return item
      //     .replace(/rq_c=(\d+)/g, (match, $1) => {
      //       const count = $1 > this.requestCount ? $1 : this.requestCount;
      //       return `rq_c=${count}`;
      //     })
      //     .replace(/retryTimes=(\d+)/g, (match, $1) => {
      //       const count = $1 > retryTimes ? $1 : retryTimes;
      //       return `retryTimes=${count}`;
      //     });
      // });
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
          'User-Agent': '121212121',
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
            // 把数据存起来，留待后面再上报使用
            this.save(logs);
          }
        },
      });
    };
    reportData();
  }
  save(logs) {
    // 未上报成功的数据存储下来
    storagePiwik('piwikLog', logs);
  }
  random(size) {
    let temp = '';
    for (let i = 0; i < size; i++) {
      temp += Math.floor(Math.random() * 10);
    }
    return temp;
  }
  getCommon() {
    const date = new Date();
    const config = this.getConfig();
    const data = this.getData();
    const devId = hexMD5(data.uuid + config.idsite).substr(8, 16);
    const { screenWidth, screenHeight } = data;
    const channelParams = xmini.getChannel();
    const { scene = '' } = data.showOptions || {};

    // 支付宝版本低时，取不到省市相关信息
    const regionId = this.getRegionId(data.province);
    const locate = {};
    const { location = {} } = data;
    Object.assign(locate, {
      country: 'cn',
      lat: location.latitude || 0,
      long: location.longitude || 0,
    });

    if (regionId) {
      Object.assign(locate, {
        region: regionId,
        city: location.province,
      });
    }

    const temp = {
      idsite: config.idsite,
      rec: 1,
      _id: devId, // 支付宝小程序使用 user_id + idsite 前端生成ID，微信小程序使用 openid + idsite 前端生成ID
      ...channelParams,

      uid: '', // 这里不加
      res: screenWidth ? `${screenWidth}x${screenHeight}` : '',
      r: this.random(6),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      send_image: 0,

      url: data.url,
      urlref: data.urlref,
      _ref: data._ref,

      // 额外参数 上报次数，以及错误重试次数
      // rq_c: 0,
      // retryTimes: 0,

      // 当前页面访问时的数据
      cvar: JSON.stringify({
        1: ['channel', channelParams.channel],
        2: ['city_name', data.cityName],
        3: ['spm', channelParams.spm],
        4: ['user_id', data.userId || ''],
      }),
      // 记录访问最后一个页面的数据(每次上报，只是 piwik 数据库中覆盖式记录只存在一条记录)
      // https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html
      _cvar: JSON.stringify({
        1: ['spm', channelParams.spm],
        2: ['openid', data.openId || null],
        3: ['city_name', data.cityName || null],
        4: ['user_id', data.userId || ''],
        5: ['scene', scene || ''], // 场景值
      }),
      cdt: parseInt(date / 1000),

      ...locate,
    };

    return temp;
  }
  getRegionId(province) {
    if (!province) return '';
    return regionMap[province] || '';
  }
}

export default Plugin;
