/**
 * piwik.init(String, String, String)
 * piwik.onPageCreate(String, String)
 * piwik.onPageDestroy(String)
 * piwik.onTrackEvent(String, Object|String)
 */
'use strict';

import {
  log,
  // uuid,
} from '../mini/utils';
import native from '../mini/native';
import {
  hexMD5
} from './md5'

class Piwik {
  constructor() {
    this.config = {
      isTrackWorking: true,
      isDiskWorking: false,
      isReportWorking: false,
      category: '',
      size: 1,
      url: 'https://tongji.haoshiqi.net/piwik.php',
      siteId: 0,
      userId: '',
      channel: '',
      openId: '',
      screen: '',
      location: {},

      delay: 0,

      path: '', // 当前路径
      refer: '',
      spm: '', // 默认SPM
      spmArr: [], // SPM队列
    };
    /**
     * 默认统计参数
     */
    this.default = {
      spm: 'miniapp', // 默认SPM
      channel: 'miniapp', // 默认channel
    };
    /**
     * 上报数据缓冲区
     */
    this.cache = [];
  }

  // startTimerTask() {
  //     let timer = setInterval(() => {
  //         this.report(false);
  //     }, this.config.delay);
  // }

  /**
   * 初始化
   * @param url 上报地址
   * @param siteId 对应siteId
   * @param userId 用户Id
   * @param channel 渠道
   */
  // url, siteId, category, channel, spm, size
  init(opts) {
    log.warn('piwik init!')
    if (!opts || !opts.uuid) {
      return
    }
    Object.assign(this.config, {
      // url: opts.url,
      size: opts.size || 1,
      uuid: opts.uuid,
      siteId: opts.siteId || 100,
      category: opts.category,
      // userId: opts.userId || '',
      // openId: opts.openId || '',
      channel: opts.channel || 'miniapp',
      spm: opts.spm || 'miniapp',
    });
    this.default.channel = opts.channel || 'miniapp';
    this.default.spm = opts.spm || 'miniapp';
  }

  /**
   * 更新统计标识
   * @param param
   */
  update(param = {}) {
    if (!param || typeof param !== 'object') {
      return
    }
    // 这里限制只能更新以下值
    const keys = {
      screen: 1,
      userId: 1,
      openId: 1,
      location: 1,
      cityName: 1,
      path: 1,
      spm: 1,
      channel: 1,
      refer: 1,
    };
    const params = {};
    for(const key in param) {
      if (param[key] && keys[key]) {
        params[key] = param[key];
      }
    }
    Object.assign(this.config, params);
  }

  getChannel() {
    return {
      spm: this.config.spm,
      channel: this.config.channel,
      refer: this.config.refer,
    };
  }

  addSPM(spm) {
    return this.config.spmArr.push(spm);
  }

  getSPM() {
    if (this.config.spmArr && this.config.spmArr.length > 0) {
      return this.config.spmArr[this.config.spmArr.length - 1] || this.config.spm;
    }
    return this.config.spm;
  }

  popSPM() {
    if (this.config.spmArr && this.config.spmArr.length > 0) {
      return this.config.spmArr.pop() || this.config.spm;
    }
    return this.config.spm;
  }

  clearSPM() {
    this.config.spmArr = [];
  }

  clearRefer() {
    this.config.ref = {};
  }

  __send(data, origin, callback) {
    const {
      me,
    } = native.get();
    const that = this;
    log.warn(':::log send: ' + JSON.stringify(data));
    this.config.isReportWorking = true;
    me.httpRequest({
      url: this.config.url + '?spm=' + this.config.spm + '&channel=' + this.config.channel,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data),
      dataType: 'json',
      success: function (res) {
        that.config.isReportWorking = false;
        log.warn(':::log report tracked: ' + (res.data && res.data.tracked));
        if (callback && typeof callback === 'function') {
          callback();
        }
      },
      fail: function (err) {
        log.warn(':::log report failed', JSON.stringify(err));
        that.config.isReportWorking = false;
        that.cache = that.cache.concat(origin);
      },
      complete: function () {}
    });
  }

  __getRegionId(city) {
    if (!city) {
      return '';
    }
    let cn_mapper = {
      '安徽省': '01',
      '浙江省': '02',
      '江西省': '03',
      '江苏省': '04',
      '吉林省': '05',
      '青海省': '06',
      '福建省': '07',
      '黑龙江省': '08',
      '河南省': '09',
      '河北省': '10',
      '湖南省': '11',
      '湖北省': '12',
      '新疆维吾尔自治区': '13',
      '西藏自治区': '14',
      '甘肃省': '15',
      '广西壮族自治区': '16',
      '贵州省': '18',
      '辽宁省': '19',
      '内蒙古自治区': '20',
      '宁夏回族自治区': '21',
      '北京市': '22',
      '上海市': '23',
      '山西省': '24',
      '山东省': '25',
      '陕西省': '26',
      '天津市': '28',
      '云南省': '29',
      '广东省': '30',
      '海南省': '31',
      '四川省': '32',
      '重庆市': '33',
    };
    return cn_mapper[city.toLowerCase()];
  }

  __random(len) {
    let temp = "";
    for (let i = 0; i < len; i++) {
      temp += Math.floor(Math.random() * 10);
    }
    return temp;
  }

  __common() {
    const date = new Date();
    const devId = hexMD5(this.config.uuid + this.config.siteId).substr(8, 16);
    let locate = {};

    let piwikId = this.__getRegionId(this.config.location.provinceId || '');
    // 如果支付宝版本低，取不到privince\city信息，则查不到piwikId
    if (piwikId) {
      Object.assign(locate, {
        country: 'cn',
        region: piwikId,
        city: this.config.location.provinceId,
        lat: this.config.location.lat || 0,
        long: this.config.location.lon || 0,
      });
    }
    return Object.assign({
      idsite: this.config.siteId,
      rec: 1,
      _id: devId,
      uid: '',
      res: this.config.screen || '',
      r: this.__random(6),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      send_image: 0,

      cvar: JSON.stringify({
        "1": ["channel", this.config.channel],
        "2": ["city_name", this.config.cityName],
        "3": ["spm", this.config.spm],
        "4": ["user_id", this.config.userId || ''],
      }),
      _cvar: JSON.stringify({
        "1": ["spm", this.config.spm],
        "2": ["openid", this.config.openId || null],
        "3": ["city_name", this.config.cityName || null],
        "4": ["user_id", this.config.userId || ''],
      }),
      cdt: parseInt(new Date() / 1000),
    }, locate);
  }

  __check(data) {
    Object.assign(data, this.__common());
    let str = "?" + Object.keys(data).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
    this.cache.push(str);

    if ((this.cache.length >= this.config.size) && !this.config.isReportWorking) {
      this.report();
    }

    // 到达一定数量后持久化到缓存, 暂未使用
    if (this.cache.length >= 20 && false) {
      this.__saveDisk(this.cache);
      this.cache = [];
    }
  }
  // 缓存数据 start，暂未使用
  __saveDisk(data) {
    if (this.config.isDiskWorking) {
      return;
    }
    my.setStorage({
      key: 'track_piwik',
      data: data,
      success: function () {},
      fail: function () {
        this.cache = this.cache.concat(data);
      }
    });
  }
  __getDiskAndReport() {
    if (this.config.isDiskWorking) {
      return;
    }
    this.config.isDiskWorking = true;
    my.getStorage({
      key: 'track_piwik',
      success: function (res) {
        log.log(JSON.stringify(res));
        // 删除缓存
        my.removeStorageSync({
          key: 'track_piwik',
        });
        this.cache = this.cache.concat(res.data);
        this.report(true);
      },
      fail: function (res) {
        log.log('error: ' + res.errorMessage);
      },
      complete: function () {
        this.config.isDiskWorking = false;
      }
    });
  }
  // 缓存数据 end，暂未使用

  report(loop = false) {
    if (!this.config.isTrackWorking) {
      return;
    }
    if (this.cache.length <= 0) {
      return
    }
    let temp = [];
    this.cache = this.cache.filter((item, index, arr) => {
      if (index < this.config.size) {
        temp = temp.concat(item);
      }
      return index >= this.config.size
    });

    let data = {
      token_auth: '5db85cb262e7423aa6bdca05a0283643',
      requests: []
    };
    data.requests = data.requests.concat(temp);
    log.log('======piwik report: ' + temp.length + ', cached: ' + this.cache.length);
    if (this.cache.length >= this.config.size) {
      loop = true;
    }
    this.__send(data, temp, loop ? () => {
      this.report(loop);
    } : false);
  }

  /**
   * 新开页面
   * @param path 页面路径
   * @param name 页面名
   */
  onPageView(path, name) {
    // 准备页面统计数据
    let temp = {
      // urlref: this.ref[path] || 'istoppage',
      urlref: this.config.refer,
      _ref: this.config.refer,
      action_name: name || '',
      url: 'http://' + path,
    };

    this.__check(temp);
  }

  /**
   * 事件统计
   * @param actionId string 事件Id
   * @param value any 数据
   */
  onTrackEvent(actionId, value = '') {
    this.onTrackAction(this.config.category, actionId, value);
  }

  /**
   * 事件统计
   *
   * @param category string 事件类型[点击、曝光、加载]
   * @param actionId string 事件Id
   * @param value any 数据
   */
  onTrackAction(category, actionId, value = '') {
    if (!actionId) {
      log.warn("'actionId' must not be null");
      return
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    log.log('onTrackEvent: ' + actionId + ', ' + value);
    let temp = {
      action_name: actionId,
      url: 'http://' + this.config.path,

      e_c: this.config.category,
      e_a: actionId,
      e_n: value,
    };

    this.__check(temp);
  }
}

const piwik = new Piwik();

// export default piwik;

module.exports = piwik;
