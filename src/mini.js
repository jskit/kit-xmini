
// 对小程序进行封装
import origin from './origin';
import mixins from './mixins/index';

export default {
  ...origin,
  me: {
    ...origin.me,
    ...mixins.me,
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
