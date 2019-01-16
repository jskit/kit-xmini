import {
  log,
} from '../mini/utils';
import native from '../mini/native';

const miniappType = typeof my !== 'undefined' ? 'aliapp' : 'wxapp';

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
  const os = systemInfo['platform'] === 'iPhone OS' ? 'iOS' : systemInfo['platform'];

  me[request]({
    url: 'https://tongji.doweidu.com/log.php',
    method: 'POST',
    data: {
      miniappType,
      os, // 客户端平台 Android iOS
      osVersion: systemInfo['system'], // 操作系统版本
      host: systemInfo['app'] || 'wechat', // 当前运行的客户端 alipay wechat
      hostVersion: systemInfo['version'], // 宿主版本号
      sdkVersion: systemInfo['SDKVersion'] || '-1', // 客户端基础库版本
      language: systemInfo['language'], // 设置的语言
      phoneBrand: systemInfo['brand'], // 手机品牌
      phoneModel: systemInfo['model'], // 手机型号
      pixelRatio: systemInfo['pixelRatio'], // 设备像素比
      pagePath: pageInfo.pagePath,
      pageQuery: JSON.stringify(pageInfo.pageQuery),
      appName: appName,
      project: appName,
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
