// pages/index/index.js
import { xPage, xmini } from '../../utils/xmini';
const { me } = xmini;

xPage({
  data: {},
  onLoad(query) {
    query.id = 123;
    console.log(me.$getPageInfo());
    console.log('page index: onLoad');
  },
  onReady() {},
  onShow() {
    console.log('page index: onShow');
    const temp = xmini.getChannel();
    console.log(temp);

    const url =
      'https://m.api.haoshiqi.net/common/initconfig?channel=h5&spm=h5&v=3.4.6&terminal=wap&swidth=1440&sheight=900&zoneId=857';
    const success = res => {
      console.log('ok');
    };
    // 目前应该没有并发限制了
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
    me.request({ url, success });
  },
  onHide() {},
  onUnload() {},
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
})(Page);
