// 对小程序进行封装
// 无法干掉原来的变量
const noop = (msg) => {
  console.error(msg);
};

// App, Page, getCurrentPages is read-only
const origin = {
  me: {},
  xApp(opts = {}) {
    if (typeof App !== 'undefined') {
      return App(opts);
    }
    return noop('xApp 错误');
  },
  xPage(opts = {}) {
    if (typeof Page !== 'undefined') {
      return Page(opts);
    }
    return noop('xPage 错误');
  },
  getCurrentPages(opts = {}) {
    if (typeof getCurrentPages !== 'undefined') {
      return getCurrentPages(opts);
    }
    return noop('getCurrentPages 错误');
  },
};

if (typeof wx !== 'undefined') {
  origin.me = {
    ...wx,
    miniType: 'wxapp',
  };
}
if (typeof my !== 'undefined') {
  origin.me = {
    ...my,
    miniType: 'aliapp',
  };
}

export default origin;
