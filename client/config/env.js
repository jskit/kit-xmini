// ENV
import { copy } from 'kit-qs';

const apiEnv = 'prod'; // dev beta prod
const debug = apiEnv === 'dev';
const version = '0.0.1';

const ENV = {
  prod: {
    stage: 'prod',
    baseUrl: 'https://m.haoshiqi.net',
    apiBaseUrl: 'https://m.api.haoshiqi.net',
  },
  dev: {
    stage: 'dev',
    baseUrl: 'http://m.dev.haoshiqi.net',
    apiBaseUrl: 'https://m.devapi.haoshiqi.net',
  },
  beta: {
    stage: 'beta',
    baseUrl: 'https://m.beta.haoshiqi.net',
    apiBaseUrl: 'https://m.betaapi.haoshiqi.net',
  },
  test: {
    stage: 'test',
    apiBaseUrl: 'https://m.devapi.haoshiqi.net',
  },
  local: {
    stage: 'local',
    // baseUrl: location.origin, // localhost
    // apiBaseUrl: 'http://10.0.6.55:8080',
    // apiBaseUrl: 'http://m.devapi.haoshiqi.net',
    // apiBaseUrl: 'http://m.betaapi.haoshiqi.net',
    // apiBaseUrl: 'http://m.api.haoshiqi.net',
  },
};

const baseEnv = {
  // ...debug,
  version,    // 应用版本
  // channel,    // 渠道信息
  // terminal,   // 终端
  stage: 'prod', // 发行版本
  spm: '', // spm
  baseUrl: 'https://m.haoshiqi.net',
  apiBaseUrl: 'https://m.api.haoshiqi.net',
  apiMockUrl: '',
  isEnv(current) {
    const { stage } = this
    return stage === current || (Array.isArray(current) && current.indexOf(stage) > -1)
  },
};

function createEnv(opts = {}) {
  const { env = 'prod' } = opts
  return copy({
    ...baseEnv,
    ...ENV[env],
    ...opts,
  });
}

const currentEnv = createEnv({
  env: apiEnv,
});

// 默认会有个 api 配置，之后会读取 store
export default currentEnv;
