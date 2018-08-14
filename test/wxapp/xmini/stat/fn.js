
import native from '../mini/native';
import { storage } from '../mini/storage';
import $log from '../stat/log';
import {
  log,
  uuid,
} from '../mini/utils';

exports.miniInit = function miniInit(options, fnName) {
  // 小程序初始化
  // 获取缓存数据
  const {
    me,
  } = native.get();

  let systemInfo = storage.get('systemInfo');
  if (!systemInfo) {
    systemInfo = me.getSystemInfoSync();
    storage.set('systemInfo', systemInfo, 86400 * 365);
    // log.set({get_system_info: 1};
  }
  return systemInfo;
};
