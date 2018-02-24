
// 对小程序进行封装
import { noop } from './utils';
import mixins from './mixins';

// App, Page, getCurrentPages is read-only
const defaultOpts = {
  me: '',
  xApp: noop,
  xPage: noop,
  getCurrentPages: noop,
  miniType: '',
};

function init(origin) {
  return {
    ...defaultOpts,
    ...origin,
    me: {
      ...mixins.me,
      ...origin.me,
    },
    xApp(opts = {}) {
      return origin.xApp({
        ...mixins.app,
        ...opts,
      });
    },
    xPage(opts = {}) {
      return origin.xPage({
        ...mixins.page,
        ...opts,
      });
    },
  };
}

let inited;

const mini = {
  init(opts = {}) {
    if (inited) {
      console.error('init() can only be called once');
      return this;
    }
    Object.assign(this, init(opts));
    inited = true;
  },
};

export default mini;
