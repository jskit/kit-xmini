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
  const pageInfo = me.$getPageInfo();
  const systemInfo = me.$getSystemInfo() || {};
  me[request]({
    url: 'https://tongji.doweidu.com/log.php',
    method: 'POST',
    data: {
      ...systemInfo,
      pagePath: pageInfo.pagePath,
      pageQuery: JSON.stringify(pageInfo.pageQuery),
      appName: appName,
      value: err,
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
