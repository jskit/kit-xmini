import KitStat from './tongji/src';

const tongji = new KitStat({

});

App({
  onError(err) {
    console.error(err);
  },
  onLaunch() {
    my.getSystemInfo({
      success: (res) => {
        // console.log(res);
      },
    });
    my.getNetworkType({
      success: (res) => {
        // console.log(res);
      },
    });
  },
  onShow(query) {
    // console.log('query:', query);
  },
  onHide() {
    // console.log('App Hide');
  },
});
