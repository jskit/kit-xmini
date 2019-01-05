exports.copy = function(data) {
  return JSON.parse(JSON.stringify(data));
}

const log = {
  log: (...rest) => {
    // console.log(...rest);
  },
  info: (...rest) => {
    // console.info(...rest);
  },
  warn: (...rest) => {
    // console.warn(...rest);
  },
  error: (...rest) => {
    // console.error(...rest);
  },
};

exports.log = log;

exports.stringify = function stringify(params, options = {}) {
  const defaults = {
    delimiter: '&',
  };
  const opts = Object.assign({}, defaults, options);
  const { delimiter = defaults.delimiter } = opts;

  const arr = [];
  for (const key in params) {
    if (!params[key]) {
      delete params[key];
    } else {
      arr.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }
  return arr.join(delimiter);
}

exports.isUnDef = function isUnDef(v) {
  return v === 'undefined' || v === null;
}
exports.isDef = function isDef(v) {
  return v !== 'undefined' && v !== null;
}
exports.isObject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

// function uuid1(userId) {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//     const r = Math.random() * 16 | 0
//     const v = c == 'x' ? r : (r & 0x3 | 0x8);
//     return v.toString(16);
//   })//.toUpperCase();
// }

// exports.url =
//   '_~0123456789' +
//   'abcdefghijklmnopqrstuvwxyz' +
//   'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// https://github.com/ai/nanoid/blob/master/non-secure.js
function random (size) {
  const result = []
  while (0 < size--) {
    result.push(Math.floor(Math.random() * 256))
  }
  return result
}
function uuid(size = 21) {
  const url = '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ';
  let id = '';
  let bytes = [];
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    bytes = crypto.getRandomValues(new Uint8Array(size))
    log.warn(':::uuid crypto:', bytes.join(','));
  } else {
    bytes = random(size);
    log.warn(':::uuid random:', bytes.join(','));
  }
  // const bytes = typeof crypto !== 'undefined' && crypto.getRandomValues ?
  //   crypto.getRandomValues(new Uint8Array(size)) :
  //   random(size);
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}

exports.uuid = uuid;

// 附写方法，
// 若已存在，对数据参数进行格式改写
// 若无，直接附加
exports.rewrite = function rewrite(opts, fnName, fn) {
  if (opts[fnName]) {
    const oldFn = opts[fnName];
    opts[fnName] = function (...rest) {
      const newOpt = fn(...rest);
      oldFn.call(this, newOpt);
    };
  } else {
    opts[fnName] = function (options) {
      fn.call(this, options, fnName);
    }
  }
}

// 内部插入-前 prepend
exports.prepend = function prepend(opts, fnName, fn) {
  if (opts[fnName]) {
    const oldFn = opts[fnName];
    opts[fnName] = function (options) {
      fn.call(this, options, fnName);
      oldFn.call(this, options);
    };
  } else {
    opts[fnName] = function (options) {
      fn.call(this, options, fnName);
    }
  }
}

// 内部插入-后 append
exports.append = function append(opts, fnName, fn) {
  if (opts[fnName]) {
    const oldFn = opts[fnName];
    opts[fnName] = function (options) {
      const result = oldFn.call(this, options);
      fn.call(this, [options, result], fnName);
      return result;
    }
  } else {
    opts[fnName] = function (options) {
      fn.call(this, options, fnName)
    }
  }
}

exports.isEmptyObject = function isEmptyObject(obj) {
  return JSON.stringify(obj) === "{}";
  // for (const key in value) {
  //   return false;
  // }
  // return true;
}

exports.merge = function merge(target) {
  /* eslint no-plusplus: 0 */
  /* eslint prefer-rest-params: 0 */
  /* eslint no-prototype-builtins: 0 */
  /* eslint no-param-reassign: 0 */
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {}
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop]
        if (value !== undefined) {
          target[prop] = value
        }
      }
    }
  }

  return target
}
