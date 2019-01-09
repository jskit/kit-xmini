import PluginBase from '../core/plugin-base';

// import { compactObject } from '@jskit/qs';
import { compactObject } from '../utils/qs';
import xmini from '../core/xmini';

// function toMap(arr = []) {
//   return arr.reduce((obj, item) => {
//     obj[item] = true;
//     return obj;
//   }, {})
// }

function channelFilter(params, filters) {
  return Object.keys(params).reduce((obj, key) => {
    if (filters[key]) {
      obj[key] = params[key];
    }
    return obj;
  }, {});
}

/**
 * 小程序业务渠道&参数处理(如果扩展可以支持业务之外的参数处理)
 * 支持业务参数配置 spm channel_id 等，可新增
 * 支持参数的 parse stringify merge 操作
 *
 * @class Plugin
 * @extends {PluginBase}
 */
class Plugin extends PluginBase {
  name = 'channel';
  events = {
    preAppOnLaunch: 'preAppOnLaunch',
    preAppOnShow: 'preAppOnShow',
    prePageOnLoad: 'prePageOnLoad',
    // prePageOnShow: 'prePageOnShow',
  };

  methods = {
    getChannel: 'getChannel',
    setChannel: 'setChannel',
  };

  constructor(config = {}) {
    super(config);
    this.startParams = this.setChannel(config);
  }

  // install(xm) {}

  preAppOnLaunch(options = {}) {
    this.initChannel(options, 'App onLaunch');
  }
  preAppOnShow(options = {}) {
    this.initChannel(options, 'App onShow');
  }
  prePageOnLoad(query = {}, ctx) {
    // console.warn(ctx);
    // ctx.$query = query;
    // `不允许重写 ${ctx.$getPageName()} 中的 onLoad 方法的 query 参数`，但暂时无法控制
    Object.defineProperty(ctx, '$query', {
      value: query,
      writable: false
    });
  }

  initChannel(options = {}, type) {
    // console.log(options, type);
    const { path = '', query, referrerInfo = {}, scene, shareTicket } = options;
    const { extraData } = referrerInfo;
    // console.log(path, query, scene, shareTicket);
    // console.log(extraData);
    this.setChannel(query || extraData);
    return this;
  }

  channelFilter(params, filters) {
    if (!filters) {
      filters = this.getConfig();
    }
    return channelFilter(params, filters);
  }

  setChannel(options) {
    // 内部变量全是用channel 而不要用channel_id
    if (typeof options !== 'object') return;
    // 此参数，在切换到后台后，再切换回来，参数丢失了
    // 更新业务渠道参数
    // 每次启动时，获取参数设置为默认值，之后透传当前页面的配置，若无则使用默认值替代
    // 其值为api、分享或页面使用
    // 仅仅取有效的参数值

    // 目前 channel 与 channel_id 保持同步
    let { channel_id = '', channel = channel_id, ...rest } = this.channelFilter(options);
    const temp = { channel_id, channel, ...rest };
    this.startParams = {
      ...this.getConfig(),
      ...compactObject(temp),
    };
    return this;

    // 如果业务参数更新，需要刷新页面数据，渠道更新，不用刷新数据

    // 业务参数被更新，仅仅更新渠道参数
    // const oldParams = this.getChannel();
    // if(channel_id != oldParams.channel || spm != oldParams.spm){
    //   this.updateCurrentPage();
    // }
  }

  getChannel(url = '') {
    // 获取传入 url 的业务参数，如果没传，则获取当前[页面]的业务参数
    // 参数由以下三部分数据合成(需要提供给 piwik 以及 api 使用)
    // - 默认参数 config
    // - 启动参数 startParams
    // - 指定 url 页面参数，默认为当前页面

    // 获取业务渠道参数，由全局参数以及page参数运算得出
    // 提供给API、forward以及统计使用
    const { query = {} } = xmini.me.$getPageInfo();;
    const current = compactObject(this.channelFilter(query));
    return { ...this.getConfig(), ...this.startParams, ...current };
  }
}

export default Plugin;

// 注意事项
// 以下测试要以真机结果为准

// 支付宝小程序
// !!!如果当前已经打开蚂蚁会员小程序，在钉钉跳转到积分小程序，触发两次这个App 的 onShow();
// 第一次为从后台切到前台，参数为空
// 第二次为schema唤醒，传入参数
// 支付宝 schema 传参在 options.query 这里取
// alipay://platformapi/startApp?appId=2018051160096372&query=channel_id%3Dalipay_ant
// alipays://platformapi/startApp?appId=2017112000051610&query=spm%3D222%26channel%3D333%26channel_id%3Dpoint&page=pages%2Findex%2Findex%3Fid%3D111
// 参数结构如下,默认扫码(打开scene为四个0，小程序列表打开为 1001，无 query)
// options = { path: 'pages/index/index', query: { channel: 333, channel_id: 'point', spm: '222' }, scene: '0000' }

// 支付宝小程序间跳转，参数在 referrerInfo 中，结构如下：
// options = { path: 'pages/index/index', scene: '1037', referrerInfo: { appId: '来源的 appId,如2018051160096372', extraData: { channel_id: '', spm: '', refer: '来源页面,如pages/profile/profile' } } };
// my.alert({
//   title: 'onShow:' + JSON.stringify(options),
// });

// 微信小程序
// options = { path: 'pages/index/index', query: {}, referrerInfo: {}, scene: 1001, shareTicket: undefined }
//
