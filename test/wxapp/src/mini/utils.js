exports.copy = function(data) {
  return JSON.parse(JSON.stringify(data));
}

exports.isUnDef = function isUnDef(v) {
  return v === 'undefined' || v === null;
}
exports.isDef = function isDef(v) {
  return v !== 'undefined' && v !== null;
}

// 内部插入-前 prepend
exports.prepend = function prepend(opts, fnName, fn) {
  if (opts[fnName]) {
    const oldFn = opts[fnName];
    opts[fnName] = function (opts) {
      fn.call(this, opts, fnName);
      oldFn.call(this, opts);
    };
  } else {
    opts[fnName] = function (opts) {
      fn.call(this, opts, fnName);
    }
  }
}

// 内部插入-后 append
exports.append = function append(opts, fnName, fn) {
  if (opts[fnName]) {
    const oldFn = opts[fnName];
    opts[fnName] = function (opts) {
      const result = oldFn.call(this, opts);
      fn.call(this, [opts, result], fnName);
      return result;
    }
  } else {
    opts[fnName] = function (t) {
      fn.call(this, opts, fnName)
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
