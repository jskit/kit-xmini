
// 扩展
import origin from './origin';
import mixins from './mixins/index';
import { noop } from './utils';

let mini;
const defaultOptions = {
  me: {},
  xApp: noop,
  xPage: noop,
  getCurrentPages: noop,
}

class XMini {
  constructor(opts) {
    if (mini) {
      console('XMini() can only be called once');
      return mini;
    }
    this.config = {
      ...defaultOptions,
      ...opts,
    };
    origin.config(this.config);
    this.init();
  }

  init() {
    Object.assign(this, {
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
    });
    mini = this;
  }
}

export default XMini;

