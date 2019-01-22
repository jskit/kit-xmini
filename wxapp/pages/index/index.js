// pages/index/index.js
import { xPage, xmini } from '../../config/xmini';
import { stringify } from '../../xmini/utils/index';
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
    const that = this;
    wx.login({
      success(auth) {
        if (auth.code) {
          that.authCode = auth.code;
        }
      },
    });
    console.log('page index: onShow');
    const temp = xmini.getChannel();
    console.log(temp);

    const url =
      'https://m.api.haoshiqi.net/common/initconfig?channel=h5&spm=h5&v=3.4.6&terminal=wap&swidth=1440&sheight=900&zoneId=857';
    let i = 0;
    const success = res => {
      console.log(`success: ${i++}`);
    };
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

  getUserInfo(res) {
    console.log(res);
    const { detail } = res;
    if (detail.errMsg === 'getUserInfo:ok') {
      this.login({
        code: this.authCode,
        // userInfo: res.userInfo,
        encryptedData: encodeURIComponent(detail.encryptedData),
        iv: encodeURIComponent(detail.iv),
      });
    } else {
      // 失败！
      if (
        detail.errMsg === 'getUserInfo:fail auth deny' ||
        detail.errMsg === 'getUserInfo:fail:auth deny'
      ) {
        console.log('登录失败');
      }
    }
    // wx.login({
    //   timeout: '30000',
    //   success(res) {
    //     if (res.code) {
    //       wx.request({
    //         url:
    //       });
    //     }
    //   },
    // });
  },

  login(data) {
    // console.log(aa);
    wx.request({
      url: 'https://m.api.haoshiqi.net/user/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // dataType: 'json', // 默认 json
      // responseType: 'text', // 默认 text
      data: {
        zoneId: '857',
        channel: 'wxapp',
        spm: 'wxapp',
        v: '3.4.6',
        appId: 'wxa090d3923fde0d4b', // 必填
        appid: 'wxa090d3923fde0d4b', // 必填
        terminal: 'wxapp', // 必填
        type: 2,
        ...data,
      },
      success(res) {
        const { data } = res.data;
        const userId = data.user_id;
        // data.userId = userId;
        console.log(data);
        // {"errno":0,"errmsg":"success","data":{"username":"晓寒","avatar":"https://img2.haoshiqi.net/FjpT8ZWkVuOIhMuB2eH6KQo1AiWC?imageView2/0/w/120/h/120/q/90","mobile":"13817131714","email":"","birthday":"0000-00-00","sex":0,"enabled":1,"created_at":1455943115,"is_talent":1,"is_dealer":1,"is_talent_blocked":0,"balance":224,"locked_balance":0,"withdraw_total":0,"transfer_amount":0,"user_id":10000208,"wechat_open_id":"oqiYY4w5JCrIfAx60Z80ErAkq1y8","wechat_union_id":"o31SljhvIXvUZT1ydpGgIxT6DEY8","invite_code":"989750X2","token":"1da0fb8cda002856c12445753085f29d"},"timestamp":1548135646,"serverlogid":"04c98abdf54af057fe1932c264292961"}
        if (userId) {
          // console.log(data);
        }

        // 用户登录后，要更新统计相关的用户信息
        xmini.piwikUpdate({
          userId: data.user_id, // 使用 userId
          openId: data.wechat_open_id, // 微信使用 openId
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  },

  goNext(e) {
    const { link } = e.currentTarget.dataset;
    switch (link) {
      case 'search':
        xmini.piwikEvent('');
        break;
      default: {
        wx.navigateTo({
          url: `../../pages/${link}/${link}`,
        });
      }
    }
  },
})(Page);
