import PluginBase from '../core/plugin-base';
import { xmini } from '../core/xmini';
import { stringify, hexMD5 } from '../utils/index';

const cityIdMap = {
  安徽省: '01',
  浙江省: '02',
  江西省: '03',
  江苏省: '04',
  吉林省: '05',
  青海省: '06',
  福建省: '07',
  黑龙江省: '08',
  河南省: '09',
  河北省: '10',
  湖南省: '11',
  湖北省: '12',
  新疆维吾尔自治区: '13',
  西藏自治区: '14',
  甘肃省: '15',
  广西壮族自治区: '16',
  贵州省: '18',
  辽宁省: '19',
  内蒙古自治区: '20',
  宁夏回族自治区: '21',
  北京市: '22',
  上海市: '23',
  山西省: '24',
  山东省: '25',
  陕西省: '26',
  天津市: '28',
  云南省: '29',
  广东省: '30',
  海南省: '31',
  四川省: '32',
  重庆市: '33',
};

/**
 * piwik 数据统计
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
  methods = {
    piwikInit: 'piwikInit',
    piwikReport: 'piwikReport',
  };
  _piwik = [];
  _caches = [];
  constructor(config) {
    super(config);
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
  piwikupdate(opts = {}) {
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
  piwikReport() {
    const temp = this._caches;
    const data = {
      token_auth: '5db85cb262e7423aa6bdca05a0283643',
      requests: [...temp],
    };

    this._send(data);
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
  _trackPageView() {}
  _setCustomVar() {}
  _trackEvent() {}
  _getRegionId(city) {
    if (!city) return '';
    return cityIdMap[city.toLowerCase()];
  }
  // page
  pv(...rest) {
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

/**
文档说明
https://developer.matomo.org/api-reference/tracking-api

{
  // 必须参数 init方法设定
  idsite: 2, // 网站 id，2 用来测试
  rec: 1, // 必须设置为1
  reportURI: 'https://your-piwik-domain.example/piwik.php', // 上报 url
  token_auth: '',

  // 推荐参数
  action_name: '', // 事件名称，用户上报PV、UV时的页面路径
  url: '',
  // 访客的唯一ID
  // 必须是长度16位十六进制字符串。每个访客必须分配不同的唯一ID，并且分配后不能改变。
  // APP、H5使用piwik生成的ID
  // 支付宝小程序使用 user_id + idsite 前端生成ID，微信小程序使用 openid + idsite 前端生成ID
  _id: '',
  rand: '',
  r: '', // 6位随机数字，用于清除浏览器请求的缓存
  apiv: 1, // 当前始终设置为1

  // 可选用户信息
  uid: '', // 生成的唯一ID
  urlref: '', // 完整的HTTP Referrer URL，若无，则设置为 istoppage
  // 自定义变量
  cvar: JSON.stringify({
    1: ['channel', this.config.channel],
    2: ['city_name', this.config.cityName],
    3: ['spm', this.config.spm],
    4: ['user_id', this.config.userId || ''],
  }),
  _idvc: '', // 该访客总计访问的次数，间隔在1小时内的访问为一次连续的访问，超过1小时则加1。若不支持本地缓存，则不传
  _viewts: '', // 该访客上次访问时间的UNIX时间戳（秒为单位）。若不支持本地缓存则不传。
  _refts: '', // 该访客上次访问时间的UNIX时间戳（秒为单位）。若不支持本地缓存，则不传。
  _idn: 0, // 未知，默认0
  res: '', // 访客访问设备的分辨率
  ua: '',
  cid: '',
  new_visit: '',

  // 可选的操作信息
  _cvar: JSON.stringify({
    1: ['spm', this.config.spm],
    2: ['openid', this.config.openId || null],
    3: ['city_name', this.config.cityName || null],
    4: ['user_id', this.config.userId || ''],
  }),
  link: '',

  // 可选的事件跟踪
  e_c: '', // 事件的类别，不能为空。如：视频、音乐、游戏等
  e_a: '', // 事件的行为，不能为空。如：播放、暂停、持续时长
  e_n: '', // 事件的名称，如：电影名，歌曲名等
  // e_v: '',

  // 其他参数
  token_auth: '', 长度为32位的用户授权串，用于接口授权验证。
  cdt: '', 覆盖请求的日期时间
  country: '',
  region: '',
  city: '',
  lat: '',
  long: '',
  ping: '',

  // 其他参数
  send_image: 0, // 如果设置为0，则返回http请求而不是返回一张图片
  ping: 0, // 如果设置为1，则该请求是不记录任何活动的心跳检查请求

  // 批量跟踪
  requests: [],
}

*/
