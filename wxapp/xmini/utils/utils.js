// utils

// import { isObject, isArray } from './is';

// '_~0123456789' +
// 'abcdefghijklmnopqrstuvwxyz' +
// 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const randomString =
  '_~getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ';

// https://github.com/ai/nanoid/blob/master/non-secure.js
// 指定范围，生成随机数
export function random(size) {
  const result = [];
  while (0 < size--) {
    result.push(Math.floor(Math.random() * 256));
  }
  return result;
}

export function randomRange(under, over) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * under + 1);
    case 2:
      return parseInt(Math.random() * (over - under + 1) + under);
    default:
      return 0;
  }
}

export function uuid(size = 21) {
  const url = randomString;
  let id = '';
  let bytes = [];
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    bytes = crypto.getRandomValues(new Uint8Array(size));
    // console.warn(':::uuid crypto:', bytes.join(','));
  } else {
    bytes = random(size);
    // console.warn(':::uuid random:', bytes.join(','));
  }
  while (0 < size--) {
    id += url[bytes[size] & 63];
  }
  return id;
}

/**
 * Create a cached version of a pure function.
 *
 * @export
 * @param {*} fn 传入函数
 * @returns { function } 返回函数
 */
export function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    /* eslint no-return-assign: 0 */
    return hit || (cache[str] = fn(str));
  };
}

export function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(timeout);
    }, timeout);
  });
}

export function throttle(func, wait, options) {
  let context;
  let args;
  let result;
  let timeout = null;
  let previous = 0;

  if (!options) options = {};
  const later = () => {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) {
      context = args = null;
    }
  };

  return (...rest) => {
    const now = Date.now();
    if (!previous && options.leading === false) previous = now;
    const remaining = wait - (now - previous);
    context = this;
    args = rest;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export function debounce(func, wait, immediate) {
  let timeout;
  let args;
  let context;
  let timestamp;
  let result;

  const later = () => {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return (...rest) => {
    context = this;
    args = rest;
    timestamp = Date.now();
    const callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

// 以下简单转化命名格式

/**
 * Camelize a hyphen-delimited string.
 * camelCase 小驼峰命名
 */
const camelizeRE = /-(\w)/g;
const camelize = cached(function(str) {
  /* eslint func-names: 0 */
  return str.replace(camelizeRE, function(_, c) {
    return c ? c.toUpperCase() : '';
  });
});

/**
 * Converts the first character of string to upper case.
 * 首字母大写
 */
const capitalize = cached(function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});

/**
 * Hyphenate a camelCase string.
 * kebabCase 连字符命名 eg: kebab-case
 */
const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached(function(str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});

export const upperFirst = capitalize;
export const kebabCase = hyphenate;
export const camelCase = camelize;

export function merge(target) {
  for (let i = 1, j = arguments.length; i < j; i++) {
    const source = arguments[i] || {};
    for (const prop in source) {
      if (source.hasOwnProperty(prop)) {
        const value = source[prop];
        if (value !== undefined) {
          target[prop] = value;
        }
      }
    }
  }

  return target;
}

/**
 * 新版本返回 true
 *
 * @export
 * @param {*} newVersion 新版本
 * @param {*} oldVersion 老版本
 * @returns {boolean} 布尔值
 */
export function versionCompare(newVersion, oldVersion) {
  const newVersionArr = newVersion.split('.');
  const oldVersionArr = oldVersion.split('.');
  for (let i = 0; i < newVersionArr.length; i++) {
    if (newVersionArr[i] > oldVersionArr[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Convert an Array-like object to a real Array.
 *
 * @export
 * @param {*} list 类数组
 * @param {*} start 索引
 * @returns {array} 返回数组
 */
export function toArray(list, start) {
  start = start || 0;
  let i = list.length - start;
  const ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret;
}
