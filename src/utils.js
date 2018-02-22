
export function noop() {}

export function stringify(params = {}) {
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

/**
 * extend
 *
 * @export
 * @param {any} destination
 * @param {any} source
 */
export function extend() {
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
