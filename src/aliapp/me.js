
// 针对小程序挂载的方法进行覆写优化，调用更加简单

import { me } from '../mini';
// import { methodRewrite } from '../utils';

function methodRewrite(func, opts, funcName) {
  const funcTemp = func;
  return (options) => {
    let op = options;
    if (funcName === 'showToast' && !op) {
      // showToast content 必须要有值
      op = '数据出错';
    }
    if (typeof op === 'string') {
      op = Object.assign({
        content: op,
      }, opts);
    }
    funcTemp(op);
  };
}

function rewrite() {
  console.log('覆写 me.showToast，me.showLoading 方法');

  me.showToast = methodRewrite(me.showToast, {
    duration: 2000,
  }, 'showToast');

  me.showLoading = methodRewrite(me.showLoading, {
    delay: 2000,
  }, 'showLoading');
}

export default rewrite;
