// 对小程序进行封装

// App, Page, getCurrentPages is read-only
const origin = {
  me: { },
  xApp(opts = {}) {
    return App(opts);
  },
  xPage(opts = {}) {
    return Page(opts);
  },
  getCurrentPages(opts = {}) {
    return getCurrentPages(opts);
  },
};

if (typeof my !== 'undefined') {
  origin.me = {
    ...my,
    pages: {},
  };
}

if (typeof wx !== 'undefined') {
  origin.me = {
    ...wx,
    pages: {},
  };
}

export default origin;
