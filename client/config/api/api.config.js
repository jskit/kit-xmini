import { copy } from 'kit-qs';

/**
 * API 命名规则
 * - 使用 camelCase 命名格式（小驼峰命名）
 * - 命名尽量对应 RESTful 风格，`${动作}${资源}`
 * - 假数据增加 fake 前缀
 * - 便捷易用大于规则，程序是给人看的
 */
let params = {};
let reqHeaders = {};

// api 列表
const modelApis = {
  // 初始化配置
  getConfig: '/common/initconfig',
  login: 'POST /user/login',
}

const commonParams = {
  init(data = {}) {
    params = copy(data);
  },
  set(obj) {
    Object.assign(params, copy(obj));
  },
  get(key) {
    return key ? copy(params[key]) : copy({...params});
  },
};

const headers = {
  init(data = {}) {
    reqHeaders = copy(data);
  },
  set(obj) {
    Object.assign(reqHeaders, copy(obj));
  },
  get(key) {
    return key ? copy(reqHeaders[key]) : copy({...reqHeaders});
  },
};

export default {
  modelApis,
  commonParams,
  headers,
};
