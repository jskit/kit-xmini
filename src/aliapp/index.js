// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import mini from '../mini';
import * as utils from '../utils';

let newed;

class XMini {
  constructor(opts = {}) {
    if (newed) {
      console.error('XMini() can only be called once');
      return this;
    }

    if (!opts.deepLength) {
      opts.deepLength = 5;
    }

    mini.init(opts);

    require('./me')();
    require('./page')();
    // Object.assign(mini.me, { pages });

    Object.assign(this, {
      ...mini,
      // mixins,
    });
  }
}

XMini.utils = utils;

export default XMini;
