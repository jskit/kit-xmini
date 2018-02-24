
import {
  me,
  xApp,
} from './utils/mini';
// import api from './config/api';

console.log(me);

const defalutGlobalData = {
  addressInfo: {},
  userInfo: {},   // 用户信息
  systemInfo: {}, // 系统信息
  netInfo: {},    // 网络信息
  addressId: null,
  qnInfo: {}, // 七牛 token 等
  location: '',
};
let globalData = { ...defalutGlobalData };
// 初始化
me.getStorage({
  key: 'globalData',
  success(res) {
    Object.assign(globalData, res.data);
  },
});

// 不能使用 xApp，会报错
App({
  onLaunch() {
    console.log('App');
    console.log(this);
    me.getSystemInfo({
      success: (res) => {
        this.updateData({
          systemInfo: res,
        });
      },
    });
    me.getLocation({
      cacheTimeout: 300,
      success: (res) => {
        this.updateData({
          location: `${res.longitude},${res.latitude}`,
        });
      },
      fail: (err = {}) => {
        // {
        //   error: 11,
        //   errorMessage: 'xxx',
        // }
        this.updateData({
          location: '',
        });
        me.alert({
          title: `${err.error}: ${err.errorMessage}`,
        });
      },
    });
    // 保持屏幕常亮
    // me.setKeepScreenOn({
    //   keepScreenOn: true,
    // });
  },
  onShow() {
    console.log('App Show');
    // me.showToast('demo testing');
    me.getNetworkType({
      success: (res) => {
        console.log(res);
        if (!res.networkAvailable) {
          me.showToast('网络不可用，请稍后重试...');
        }
        this.updateData({
          netInfo: res,
        });
      },
    });
    // this.checkAuth();
  },
  onHide() {
    console.log('App Hide');
  },
  checkAuth() {
    console.info('globalData');
    console.info(globalData);
    // 是否登录状态，判断 token 以及 userId;
    const { userInfo = {} } = this.getData();
    if (userInfo.token && userInfo.user_id) {
      // console.log('用户已登录');
      // me.showToast('您已登录');
      return true;
    }
    // this.goLogin();
  },
  goLogin() {
    me.goPage('login');
  },
  updateData(options = {}, reset) {
    if (reset) {
      globalData = { ...defalutGlobalData };
      me.removeStorage({
        key: 'globalData',
        success() {
          console.log('reset 数据成功');
        },
      });
    } else {
      Object.assign(globalData, options);
      me.setStorage({
        key: 'globalData',
        data: globalData,
        success() {
          console.log('写入数据成功');
        },
      });
    }
    const data = this.getData();
    this.updateCommonParams(data);
    return data;
  },
  updateCommonParams(data = {}) {
    const {
      userInfo = {},
      systemInfo = {},
      netInfo = {},
    } = data;
    // api.setCommonParams({
    //   token: userInfo.token,
    //   uid: userInfo.user_id,
    //   terminal: 'wap', // 系统版本，用于获取最新版数据
    //   device: systemInfo.brand,      // 设备
    //   swidth: systemInfo.windowWidth,      // 屏幕宽度
    //   sheight: systemInfo.windowHeight,    // 屏幕高度
    //   // location: '',   // 地理位置
    //   net: netInfo.networkType,        // 网络
    // });
  },
  resetData() {
    this.updateData(null, true);
  },
  getData(key) {
    return globalData[key] ? { ...globalData[key] } : { ...globalData };
  },
  getUserInfo() {
    const { userInfo = {} } = this.getData();
    return userInfo;
  },
});
