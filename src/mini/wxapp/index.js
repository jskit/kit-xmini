// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import origin from '../origin';
import mini from '../mini';
import pages from './pages';
// import mixins from '../mixins';

// const rewriteMe = require('./me');
// const rewritePage = require('./page');

export default {
  pages,
  origin,
  // mixins,
  ...mini,
};
