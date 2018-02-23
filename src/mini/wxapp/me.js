// 针对小程序挂载的方法进行覆写优化，调用更加简单

import { me } from '../origin';
import { methodRewrite } from '../utils';

function rewrite() {
  // 微信my下挂载方法受保护，通过 Object.assert 处理后可以覆写
  console.log('覆写 me.showToast，me.showLoading 方法');

  me.showToast = methodRewrite(me.showToast, {
    icon: 'none',
    duration: 2000,
    mask: true,
  }, 'showToast');

  me.showLoading = methodRewrite(me.showLoading, {
    // delay: 2000,
    mask: true,
  }, 'showLoading');

  if (!me.alert) {
    // 微信无 alert 方法
    me.alert = (msg) => {
      me.showToast(msg);
    }
  }

  // 统一命名
  if (!me.httpRequest) {
    me.httpRequest = me.request;
  }
}

export default rewrite;
