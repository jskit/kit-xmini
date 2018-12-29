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
