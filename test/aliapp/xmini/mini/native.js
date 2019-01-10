import {
  log,
  uuid,
  // copy,
} from '../mini/utils';
import queue from '../mini/queue';
import { storage } from './storage';
// 缓存下外部变量，供内部统一调用

let nativeObj = {};

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('../../app.json');
const native = {
  init(opts = {}) {
    if (!opts.me) {
      log.error('must be input "me"');
      return this;
    }
    opts.storage = storage;
    opts.me.$uuid = function getUUID() {
      let uid = storage.get('uuid');
      if (!uid) {
        uid = uuid(32);
        storage.set('uuid', uid, 86400 * 365);
        // $log.set({is_first_open: true});
      }
      log.warn(':::uuid:', uid);
      return uid;
    };

    let systemInfoString = '';
    opts.me.$getSystemInfo = function getSystemInfo(needString) {
      let systemInfo = storage.get('systemInfo');
      if (!systemInfo) {
        systemInfo = opts.me.getSystemInfoSync();
        storage.set('systemInfo', systemInfo, 86400 * 365);
      }
      if (needString) {
        if (!systemInfoString) {
          systemInfoString = JSON.stringify(systemInfo);
        }
        return systemInfoString;
      }
      return systemInfo;
    };

    opts.me.$getCurPage = function getCurPage() {
      const pages = getCurrentPages();
      const length = pages.length;
      if (!length) return {};
      const currentPage = pages[length - 1] || {};
      return currentPage;
    };

    opts.me.$getPageInfo = function getPageInfo() {
      const currentPage = opts.me.$getCurPage();
      const { route = '', pageQuery = {} } = currentPage;
      return {
        pageQuery: { ...pageQuery },
        pagePath: route,
        pageName: route.split('/').reverse()[0] || '',
      };
    };

    if (opts.me) {
      if (opts.host === 'aliapp') {
        const concurrency = 10;
        const request = opts.me.request
        Object.defineProperty(opts.me, 'request', {
          get() {
            return queue(request, concurrency)
          }
        })
      } else if (opts.host === 'wxapp') {
        const concurrency = 10;
        opts.me.httpRequest = opts.me.request;
        const request = opts.me.httpRequest;
        Object.defineProperty(opts.me, 'httpRequest', {
          get() {
            return queue(request, concurrency)
          }
        })
      }
    }

    Object.assign(nativeObj, {
      ...opts,
      ...require('./pages')(opts.appConfig),
    });
  },
  get() {
    // 不要拷贝，全局引用
    return nativeObj;
  },
};

module.exports = native;
