
import {
  prepend,
  append,
} from './utils';
// import native from './native';

class XMini {
  constructor(opts = {}) {
    this.type = opts.type;
    this.middleware = [];
  }

  use(fnName, fn, type = 'pre') {
    if (typeof fn !== 'function') {
      console.error('fn must be a function!');
    }
    // fn = convert(fn);
    const oper = type === 'post' ? 'push' : 'unshift';
    this.middleware[oper]({
      type,
      fnName,
      fn,
    });
  }

  entry(opts = {}) {
    const { middleware } = this;
    for (let i = 0, len = middleware.length; i < len; i++) {
      const { type, fnName, fn } = middleware[i];
      const use = type === 'post' ? append : prepend;
      if (!opts.onShareAppMessage && fnName === 'onShareAppMessage') {
        break;
      }
      use(opts, fnName, fn);
    }
    return opts;
  }
}

module.exports = XMini;

