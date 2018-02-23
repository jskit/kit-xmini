
// 针对小程序挂载的方法进行覆写优化，调用更加简单

import { me } from './origin';
import { methodRewrite } from '../utils';

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
