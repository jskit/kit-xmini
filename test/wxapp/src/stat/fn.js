
import native from '../mini/native';
import log from '../stat/log';
import {
  uuid,
} from '../mini/utils';

function getUUID() {
  const {
    storage,
  } = native.get();
  let uid = storage.get('uuid');
  if (!uid) {
    uid = uuid(32);
    storage.set('uuid', uid, 86400 * 365);
    log.set({is_first_open: true});
  }
  return uid;
};

exports.getUUID = getUUID;

exports.miniInit = function miniInit(options, fnName) {
  // 小程序初始化
  // 获取缓存数据
  const {
    me,
    storage,
  } = native.get();

  let systemInfo = storage.get('systemInfo');
  if (!systemInfo) {
    systemInfo = me.getSystemInfoSync();
    storage.set('systemInfo', systemInfo, 86400 * 365);
    // log.set({get_system_info: 1};
  }
  return systemInfo;
};
