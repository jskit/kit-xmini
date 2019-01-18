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
    if (opts.uuid) return;
    // 只允许设置以下值
    // ['size', 'uuid', 'siteId', 'category', 'channel', 'spm']
    this.setConfig(opts);
  }
  piwikupdate(opts) {
    // 只允许更新以下值
    // ['screen', 'userId', 'openId', 'location', 'cityName', 'path', 'refer', 'channel', 'spm']
    this.setConfig(opts);
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
      token_auth: '',
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
