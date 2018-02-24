// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import origin from '../origin';
// import mini from '../mini';
import utils from '../utils';

let newed;

class XMini {
  constructor(opts = {}) {
    if (newed) {
      console.error('XMini() can only be called once');
      return this;
    }

    if (!opts.deepLength) {
      opts.deepLength = 10;
    }

    origin.init(opts);

    require('./me')();
    require('./page')();
    // Object.assign(mini.me, { pages });

    const mini = require('../mini');

    Object.assign(this, {
      ...mini,
      // mixins,
    });
  }
}

XMini.utils = utils;

export default XMini;
