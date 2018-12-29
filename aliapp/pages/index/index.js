// pages/index/index.js
import { xPage, xmini } from '../../utils/xmini';

xPage({
  data: {},
  onLoad(options) {
    console.log('page index: onLoad');
  },
  onReady() {},
  onShow() {
    console.log('page index: onShow');
    console.log(xmini.getChannel());
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
})(Page);
