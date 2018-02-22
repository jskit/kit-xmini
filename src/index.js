// 扩展
import mini from './mini';
import * as utils from './utils';
import pages from './pages';
import store from './store';

export default {
  ...utils,
  ...mini,
  pages,
  store,
};
