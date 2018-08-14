import {
  log,
} from '../mini/utils';
import native from '../mini/native';

function report(err) {
  // https://tongji.doweidu.com/log.php
  const {
    host,
    me,
    appName,
  } = native.get();
  // 错误上报
  if (!err) return;
  if (typeof err !== 'string') {
    err = JSON.stringify(err);
  }
  log.error(err);
  const request = host === 'aliapp' ? 'httpRequest' : 'request';
  me[request]({
    url: 'https://tongji.doweidu.com/log.php',
    method: 'POST',
    data: {
      platform: appName,
      value: err,
      systemInfo: me.$getSystemInfo('string'),
    },
    dataType: 'json',
    success: function(res) {
      // my.alert({content: 'success'});
    },
    fail: function(res) {
      // my.alert({content: 'fail'});
    },
    complete: function(res) {
      // my.hideLoading();
      // my.alert({content: 'complete'});
    }
  });
}

module.exports = report;
