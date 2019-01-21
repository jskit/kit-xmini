// pages/index/index.js
import { xPage, xmini } from '../../config/xmini';

xPage({
  data: {},
  onLoad(options) {
    console.log('page page1: onLoad');
  },
  onReady() {},
  onShow() {
    console.log('page page1: onShow');
    // 模拟用户登录
    xmini.piwikUpdate({
      userId: 'xxxxx',
      openId: '9999999',
    });
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
})(Page);
