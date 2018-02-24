// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import origin from './origin';
// import mini from './mini';
import utils from './utils';

let newed;

class XMini {
  constructor(opts = {}) {
    if (newed) {
      console.error('XMini() can only be called once');
      return this;
    }

    switch (opts.miniType) {
      case 'aliapp':
        if (!opts.deepLength) opts.deepLength = 5;
        origin.init(opts);
        require('./aliapp/me')();
        require('./aliapp/page')();
        break;
      case 'wxapp':
        if (!opts.deepLength) opts.deepLength = 10;
        origin.init(opts);
        require('./wxapp/me')();
        require('./wxapp/page')();
        break;
      default:
        // do nothing...
        console.error('error: 缺失 rewrite，请配置 miniType');
        break;
    }
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
