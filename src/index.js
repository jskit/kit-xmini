// 扩展
import mini from './mini';
import * as utils from './utils';
import pages from './pages';
import store from './store';

const options = {
  configPath: './src',
};

export default {
  create(opts) {
    opts = { ...options, ...opts };
    pages.init(opts.configPath);

    return {
      ...utils,
      ...mini,
      pages,
      store,
    }
  },
}
