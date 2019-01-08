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
    xmini.getChannel({
      complete(res) {
        console.log(res);
      }
    })
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
})(Page);
