//logs.js
// const util = require('../../utils/util.js')
import { xPage } from '../../xmini/index';

xPage({
  data: {
    logs: [],
  },
  onLoad() {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    console.log('page log: onLoad');
  },
})(Page);
