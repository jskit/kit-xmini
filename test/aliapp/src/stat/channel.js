
// 渠道业务参数
// NOTE: 这里获取参数，仅供统计使用，
// 区分业务数据来源（暂时数据源是隔离的，不会互跳）请自行处理

// 在 onShow 中获取入口渠道参数
// channel_id
// spm

// 入口参数示例

// {
//   path: "pages/index/index",
//   query: {},
//   scene: 1001,
// }

// app.js 获取入参
exports.getAppOptions = function getAppOptions(options = {}, fnName) {
  console.warn(':::app.js', options, fnName);
  // my.alert({
  //   title: 'onShow:' + JSON.stringify(options),
  // });
  // 注意事项
  // !!!如果当前已经打开蚂蚁会员小程序，在钉钉跳转到积分小程序，触发两次这个onShow();
  // 第一次为从后台切到前台，参数为空
  // 第二次为schema唤醒，传入参数
  // 支付宝 schema 传参在 options.query 这里取
  // alipay://platformapi/startApp?appId=2018051160096372&query=channel_id%3Dalipay_ant
  // options = { query: {channel_id: 'alipay_ant'} }
  // 小程序间跳转，在 referrerInfo，结构如下：
  // options = {path: '', referrerInfo: {appId: '', extraData: {channel_id: '', spm: ''} }};
  let { path, query, scene } = options;
  const { extraData } = (options.referrerInfo || {});
  // 如果存在场景参数，则代表从外界打开，无参则更新为默认参数
  // 此时小程序入口，仍然无参数
  if (scene && !query && !extraData) {
    query = {};
  }
  // default 作为默认无数据渠道
  if (query && query.channel_id === '') {
    query.channel_id = 'default';
  }
  return {
    path,
    scene,
    query: query || extraData || {},
  };
}

exports.getPageOptions = function getPageOptions(options = {}, fnName) {
  // console.warn(':::page.js', options, fnName);
  if (fnName === 'onShow') {
    const { pageQuery = {} } = this;
    return { ...pageQuery }
  }
  return { ...options }
}

// exports.init = function(opts = {}) {
//   console.log(':::x-mini add channel');
//   const {
//     me,
//     xApp,
//     xPage,
//   } = opts;

//   xApp.use("onLaunch", preAppOnLaunch);
//   xApp.use("onShow", preAppOnShow);

//   xPage.use("onLoad", prePageOnLoad);
//   xPage.use("onShow", prePageOnShow);
// }


// updateChannel(options) {
//     if (typeof options !== 'object') return;
//     // 此参数，在切换到后台后，再切换回来，参数丢失了
//     const oldChannel = api.getChannel('channel');
//     const oldSPM = api.getChannel('spm');
//     let { channel_id = '', spm = '' } = options;
//     const params = {
//       spm,
//       channel: channel_id,
//     };
//     if(channel_id != oldChannel || spm != oldSPM){
//       this.setChannel(params);
//       this.updateCurrentPage();
//     }
//   },
//   updateCurrentPage() {
//     const length = getCurrentPages().length;
//     console.log();
//     console.log(length);
//     // my.alert({
//     //   title: '刷新当前页面' + length,
//     // });
//     if (length) {
//       // 从钉钉进来如果渠道变更，需要刷新下
//       const currentPage = getCurrentPages()[length - 1] || {};
//       if (currentPage.pageId && currentPage.refresh) {
//         currentPage.refresh();
//       };
//     }
//   },
//   setChannel(params) {
//     api.setCommonParams({ ...params });

//     // let path = '/' + options.path + '?' + stringify(options.query);
//     // my.reLaunch({
//     //   url: path
//     // });
//   },
