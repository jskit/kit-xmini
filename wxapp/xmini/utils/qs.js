/**
 * 清除无效数据
 *
 * @param { Object } [object={}] 对象
 * @param { Array } [invalid=['', undefined, null]] 指定过滤数据
 * @returns { Object } Returns the new object of filtered values.
 */
// invalid = ['', undefined, null，0, false, NaN]
export function compactObject(object = {}, invalid = ['', undefined, null]) {
  const result = {};
  for (const key in object) {
    if (!invalid.includes(object[key])) {
      result[key] = object[key];
    }
  }
  return result;
}

/**
 * 处理参数
 *
 * @export
 * @param {any} params
 * @returns  { string }
 */
const defaults = {
  delimiter: '&',
  invalid: ['', undefined, null],
  // encode: true,
  // encoder: utils.encode,
  // encodeValuesOnly: false,
  // serializeDate: function serializeDate(date) {
  //   return toISO.call(date);
  // },
  // skipNulls: false,
  // strictNullHandling: false,
};

export function stringify(params, options = {}) {
  const opts = { ...defaults, ...options };
  const { delimiter = defaults.delimiter, invalid = defaults.invalid } = opts;

  const result = [];
  params = compactObject(params, invalid);
  for (const key in params) {
    if ({}.hasOwnProperty.call(params, key)) {
      result.push(`${key}=${encodeURIComponent(params[key])}`);
    }
  }
  return result.join(delimiter);
}
