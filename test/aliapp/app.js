
import {
  xApp,
} from './utils/mini';

const time = Date.now();

App(xApp.entry({
  onError(err) {
    console.error(err);
  },
  onLaunch() {
    console.log('app.js on launch')

    // my.getSystemInfo({
    //   success: (res) => {
    //     console.log(res);
    //   },
    // });
    // my.getNetworkType({
    //   success: (res) => {
    //     console.log(res);
    //   },
    // });
  },
  onShow(query) {
    my.$log('小程序启动花费时间', {
      "花费时长" : Date.now() - time,
    });
    console.log('app.js onShow')
    console.log('query:', query);
  },
  onHide() {
    console.log('App Hide');
  },
}));
