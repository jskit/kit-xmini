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
    const temp = xmini.getChannel()
    console.log(temp);
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
})(Page);
