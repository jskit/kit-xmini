
import {
  me,
  xApp,
} from './utils/mini';

const time = Date.now();

App(xApp.entry({
  onError(err) {
    console.error(err);
  },
  onLaunch(options) {
    console.warn('App onLaunch: ' + JSON.stringify(options));
    me.$logInit({
      siteId: 11,  // 2 用来测试 该站点为 11
      uuid: me.$uuid(),
      category: 'iqg-aliapp',  // 默认事件分类
      channel: 'iqg-aliapp', // 默认channelId
      spm: 'iqg-aliapp',       // 默认spm
    });
    const systemInfo = me.$getSystemInfo();
    const { screenWidth, screenHeight } = systemInfo;
    me.$logUpdate({
      screen: `${screenWidth}x${screenHeight}`,
      userId: '',
      openId: '',
    });
  },
  onShow(options) {
    console.warn('App onShow: ' + JSON.stringify(options));
    // my.$log('小程序启动花费时间', {
    //   "花费时长" : Date.now() - time,
    // });
    // let { query, scene } = options;
    // if (scene && !query && !extraData) {
    //   query = {};
    // }
  },
  onHide() {
    // console.log('App Hide');
  },
}));
