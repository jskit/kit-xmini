
// 系统函数
// 获取系统相关信息后，缓存起来

import native from './native';

exports.getSystemInfo = function getSystemInfo(cb = noop) {
  const {
    me,
  } = native.get();
  me.getSystemInfo({
    success: function(res) {
      cb(res);
    },
    complete: function() {
      // next();
    },
  });
}
