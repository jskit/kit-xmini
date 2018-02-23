// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import {
  // me,
  xPage,
} from '../origin';

const rewriteMe = require('./aliapp');
// const rewriteMe = require('./wxapp');

export default {
  me: rewriteMe,
  page: () => {
    console.log(xPage);
  },
};
