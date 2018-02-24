
function noop() {}

function pagesMap(pageArr) {
  return pageArr.reduce((obj, item) => {
    const page = item.split('/').reverse()[0] || '';
    /* eslint no-param-reassign: 0 */
    obj[page] = `${item}`;
    return obj;
  }, {});
}

function pagesObj(allPages, tabPages) {
  return {
    all: pagesMap(allPages),
    tabs: pagesMap(tabPages),
    defaultPage: allPages[0].split('/').reverse(),
  }
}

function stringify(params = {}) {
  const temp = params;
  const arr = [];
  for (const key in params) {
    if (!temp[key]) {
      delete temp[key];
    } else {
      arr.push(`${key}=${temp[key]}`);
    }
  }
  return arr.join('&');
}

// const map = Array.prototype.map
// 提取参数
// test:
// var aa = [{a: 1,b:2},{a:3, b:4}]
// map(aa, 'a')
// [2, 3]
function map(arr, key) {
  return arr.map(item => item[key]);
}

// 构建数据映射
// 因为使用组件模板，在共用时，数据结构需要调整，所以需要构建映射关系
// 暂时只是浅处理
// var aa = [{a: 1,b:2},{a:3, b:4}]
// mapTo(aa, {a: 'c'})
function mapTo(arr, options = {}) {
  return arr.map((item) => {
    // 如果是函数，处理数据
    if (typeof options === 'function') {
      return options(item);
    }
    for (const key in options) {
      // 建议渲染使用数据，简单处理映射，大的运算可以后处理，如点击事件等
      if (typeof options[key] === 'string') {
        // 如果是字符串，做映射
        /* eslint no-param-reassign: 0 */
        item[options[key]] = item[key];
      } else if (typeof options[key] === 'function') {
        return options[key](item);
      }
    }
    return item;
  });
}

/**
 * extend
 *
 * @export
 * @param {any} destination
 * @param {any} source
 */
function extend() {
  const isObjFunc = (name) => {
    const { toString } = Object.prototype;
    return (...args) => {
      return toString.call(args[0]) === '[object ' + name + ']';
    }
  };
  const isObject = isObjFunc('Object');
  const isArray = isObjFunc('Array');
  const isBoolean = isObjFunc('Boolean');

  // function foo(...args) {
  //   console.log(args);
  // }

  // function foo(action, ...args) {
  //   action.apply(null, args); // or `action(...args)`, related to the `prefer-spread` rule.
  // }
  return (...args) => {
    let index = 0;
    let isDeep = false;
    let destination;
    if (isBoolean(args[0])) {
      index = 1;
      [isDeep] = args;
    }
    for (let i = args.length - 1; i > index; i--) {
      destination = args[i - 1];
      const source = args[i];
      if (isObject(source) || isArray(source)) {
        console.log(source);
        const { hasOwnProperty } = Object.prototype;
        for (const property in source) {
          if (hasOwnProperty.call(source, property)) {
            const obj = source[property];
            // 判断是深拷贝且这个属性是纯对象
            if (isDeep && (isObject(obj) || isArray(obj))) {
              const copy = isObject(obj) ? {} : [];
              // 递归调用，创建一份obj的拷贝，赋值给destination
              const extended = extend(isDeep, copy, obj);
              destination[property] = extended;
            } else {
              destination[property] = source[property];
            }
          }
        }
      } else {
        // if (destination[property]) {
        //   // 提示
        //   console.log(`${destination[property]} 已被覆写`);
        // }
        destination = source;
      }
    }

    return destination;
  }
}


export default {
  noop,
  pagesObj,
  stringify,
  map,
  mapTo,
  extend,
};
