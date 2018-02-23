
import origin from './origin';
import mixins from './mixins';

export default {
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
