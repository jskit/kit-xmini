// 扩展 Page

import { me } from '../mini';
import { stringify } from '../utils';

const messages = {};
let msgPages = {};

// mixin 方法，提供混入
// 绑定事件或触发类事件 全用 on 开头
// 自调用事件，不用 on 开头
export default {
  // onLog() {
  //   // 日志方法
  //   console.log('log');
  // },
  /**
   * onLoad 内调用，会检测 pageName 以及 query
   *
   * - 保存 query 数据(数据全保存在 this.data 下)
   * - 初始化分享信息
   *   - 先设置 shareInfo 为 true; 启用分享
   *   - 随后可以更新分享信息保存在 this.shareInfo
   *
   * @param {any} query
   */
  pagePreLoad(query) {
    // if (!this._data) this._data = {};
    this.setQuery(query);

    // 是否要所有页面全开启分享信息
    if (this.data.shareInfo) {
      this.onShareAppMessage = () => {
        console.log('设置分享信息');
        console.log(this.getShareInfo());
        return this.getShareInfo();
      };
    } else {
      delete this.onShareAppMessage;
    }
    // me.on('')
    // me.onUserCaptureScreen(() => {
    //   me.showToast('收到用户截屏事件');
    // });
    // {
    //   isConnected: false,
    //   networkType: none, // wiki 4g
    // }
    // me.onNetworkStatusChange((res) => {
    //   console.log(res);
    //   if (res.isConnected) {
    //     me.showToast('呀，网络丢了~~');
    //   }
    // });

    // 这里有问题
    const pagesArr = getCurrentPages();
    msgPages = {};
    pagesArr.forEach((pageItem, index) => {
      const {
        pageName,
        pageId,
        // route,
      } = pageItem;
      // 弱实现，消息标识只记录同类的第一个页面
      if (!msgPages[pageName]) {
        const msgKey = `${pageName}:${pageId}`;
        msgPages[pageName] = msgKey;
        // const message = messages[msgKey];
        // if (message && message.needRefresh) {
        //   pageItem.refresh();
        //   delete messages[msgKey];
        // }
      }
    });
    console.log(msgPages);

    // console.log($global);
    // me.alert({
    //   title: `${$global.appImpl.$launchTime}`,
    // });
    // api.getProfile({}, (res) => {
    //   console.log('userInfo');
    //   console.log(res.data);
    // }, (err) => {
    //   console.log(err);
    // });
  },

  setHeaderTitle(title) {
    me.setNavigationBarTitle({
      title,
    });
  },

  setQuery(query = {}) {
    const pageName = this.getPageName();
    Object.assign(this, {
      pageName,
      pageId: Date.now(),
      pageQuery: query,
    });
    if (!pageName) {
      console.error('页面不存在');
    }
  },

  // page.json 支持 optionMenu 配置导航图标，点击后触发 onOptionMenuClick
  onOptionMenuClick(e) {
    console.log('optionMenu', e);
  },

  getPageName() {
    const { all } = me.pages;
    const {
      pageName,
      route = '',
    } = this;
    return pageName || route.split('/').reverse()[0] || all.defaultPage;
  },

  getShareInfo() {
    const {
      pagePath,
    } = me.getCurPageUrl(this.getPageName(), this.pageQuery);
    return {
      title: '好食期',
      desc: '专注食品特卖平台，品牌食品2折起~',
      // imageUrl: 'https://static.doweidu.com/static/hsq/images/logo_fdfe8f30f2.png', // 默认可以设置 logo
      path: pagePath,
      success() {
        // me.showToast('分享成功');
      },
      fail() {
        // me.showToast('分享失败');
      },
      ...this.data.shareInfo,
    };
  },

  // 绑定跳转
  onUrlPage(e) {
    const {
      url,
      index,
    } = e.currentTarget.dataset;
    console.log(`${(url || '无需跳转')}, ${index}`);
    me.goPage(url);
  },

  // 页面跳转
  forward(page, query = {}) {
    console.log('forward: ', page);
    if (page === 'login') {
      Object.assign(query, {
        ref: this.getPageName(),
        needRefresh: true,
      });
    }
    if (query.refresh) {
      Object.assign(query, {
        ref: this.getPageName(),
        needRefresh: true,
      });
    }
    me.goPage(page, query);
  },

  back(step, query = {}) {
    let opts;
    if (typeof step === 'number') {
      opts = {
        delta: step,
      };
    } else if (typeof step === 'string') {
      opts = {
        url: `${step}?${stringify(query)}`,
      };
    }
    me.navigateBack(opts);
  },

  refresh() {
    console.info('need refresh => do onLoad();');
    this.onLoad();
  },

  postMessage(page, opts = {}) {
    if (!all[page] && !msgPages[page]) {
      console.error(`无法给 ${page} 页面发消息`);
      return;
    }
    const msgKey = msgPages[page];
    if (!messages[msgKey]) messages[msgKey] = {};
    Object.assign(messages[msgKey], opts);
    // const msg = messages[msgKey];
    return messages[msgKey];
  },

  onMessage() {
    const page = this.getPageName();
    const msgKey = msgPages[page];
    let message;
    if (all[page] || messages[msgKey]) {
      message = messages[msgKey] || {};
      delete messages[msgKey];
      if (message.needRefresh) {
        // me.showToast('触发刷新');
        this.refresh();
        delete messages[msgKey];
        // me.trigger({
        //   hsq: 'refresh',
        // });
      }
    }
    return message || {};
  },
};
