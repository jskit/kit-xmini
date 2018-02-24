// 针对小程序挂载的方法进行覆写或扩展，优化增强调用方法

import mini from './mini';
import * as utils from './utils';

let newed;

class XMini {
  constructor(opts = {}) {
    if (newed) {
      console.error('XMini() can only be called once');
      return this;
    }

    mini.init(opts);

    switch (opts.miniType) {
      case 'aliapp':
        require('./aliapp/me')();
        require('./aliapp/page')();
        break;
      case 'wxapp':
        require('./wxapp/me')();
        require('./wxapp/page')();
        break;
      default:
        // do nothing...
        console.error('error: 缺失 rewrite，请配置 miniType');
        break;
    }
    // Object.assign(mini.me, { pages });

    Object.assign(this, {
      ...mini,
      // mixins,
    });
  }
}

XMini.utils = utils;

export default XMini;
