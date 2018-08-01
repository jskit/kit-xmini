# 统计方案

借助 x-mini 的实现，轻松接入统计

## 能统计到什么

以小程序生命周期为切入点，可以统计到用户的常规操作，并且还支持自定义事件统计。

注意：统计相关渠道独立维护处理，不与数据渠道混合处理。

### App 相关统计

- 生命周期
  - onLaunch
  - onUnlaunch
  - onShow
  - onHide
  - onError
- 网络类型
- 系统设备
- 用户相关信息
- 地理位置 经纬度 速度
- UV

### Page 相关统计

- PV
- 生命周期
  - onLoad
  - onUnload
  - onShow
  - onHide
  - onReachBottom
  - onPullDownRefresh
  - onShareAppMessage

### 其他数据统计

- 必要数据
  - 小程序标识 appId
  - 用户唯一标识 userId || UUID   // uuid(30)
  - 渠道业务参数 channel spm
  - 页面上下文
  - iphone或Android i/a  支付宝或微信 a/w
- 扩展数据
  - App、Page 停留时间
  - 错误计数
  - 启动时长

## 渠道业务参数

小程序要支持渠道参数统计，不同的打开方式，参数传入的位置不同，主要有以下场景

- 分享打开
- 小程序列表打开
- 小程序间跳转
  - 同主体
  - 不同主体
- 插件形式

获取到参数存起来，方便其他位置使用，需要支持内部的渠道参数数据跟踪，所以约定规则，每个页面都使用当前的页面URL参数，如果当前不存在，则使用之前的。

// !!!如果当前已经打开蚂蚁会员小程序，在钉钉跳转到积分小程序，触发两次这个onShow();
// 第一次为从后台切到前台，参数为空
// 第二次为schema唤醒，传入参数
// 支付宝 schema 传参在 options.query 这里取
// alipay://platformapi/startApp?appId=2018051160096372&query=channel_id%3Dalipay_ant
// 小程序间跳转，在 referrerInfo，结构如下：
// options = {path: '', referrerInfo: {appId: '', extraData: {channel_id: '', spm: ''} }};
// my.alert({
//   title: 'onShow:' + JSON.stringify(options),
// });
let { query, scene } = options;
const { extraData } = (options.referrerInfo || {});
// 如果存在场景参数，则代表从外界打开，无参则更新为默认参数
// 此时小程序入口，仍然无参数
if (scene && !query && !extraData) {
  query = {};
}
// point 作为默认无数据渠道
if (query && query.channel_id === '') {
  query.channel_id = 'point';
}
this.updateChannel(query || extraData);


updateChannel(options) {
    if (typeof options !== 'object') return;
    // 此参数，在切换到后台后，再切换回来，参数丢失了
    const oldChannel = api.getChannel('channel');
    const oldSPM = api.getChannel('spm');
    let { channel_id = '', spm = '' } = options;
    const params = {
      spm,
      channel: channel_id,
    };
    if(channel_id != oldChannel || spm != oldSPM){
      this.setChannel(params);
      this.updateCurrentPage();
    }
  },
  updateCurrentPage() {
    const length = getCurrentPages().length;
    console.log();
    console.log(length);
    // my.alert({
    //   title: '刷新当前页面' + length,
    // });
    if (length) {
      // 从钉钉进来如果渠道变更，需要刷新下
      const currentPage = getCurrentPages()[length - 1] || {};
      if (currentPage.pageId && currentPage.refresh) {
        currentPage.refresh();
      };
    }
  },
  setChannel(params) {
    api.setCommonParams({ ...params });

    // let path = '/' + options.path + '?' + stringify(options.query);
    // my.reLaunch({
    //   url: path
    // });
  },
