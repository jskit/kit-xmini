
// 系统函数
// 获取系统相关信息后，缓存起来

import native from './native';
// import { storage } from './storage';

exports.getSystemInfo = function getSystemInfo(cb = noop) {
  const {
    me,
  } = native.get();
  me.getSystemInfo({
    success: function(res) {
      // storage.set(systemInfo, res);
      cb(res);
    },
    complete: function() {
      // next();
    },
  });
}
