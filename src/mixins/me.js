// 扩展 me
import { deepLength, pages } from '../origin';
import { stringify } from '../utils';

// rewrite.me();

export default {
  getCurPageUrl(url, params = {}) {
    let query = { ...params };
    const urlArr = url.split('?');
    const pageName = urlArr[0];
    if (!pageName) return;
    const pagePath = pages.all[pageName];
    query = !urlArr[1] ? stringify(query) : [stringify(query), urlArr[1]].join('&');
    if (!pagePath) {
      this.showToast('此链接不支持跳转');
      return {};
      // 要处理外部 url 数据
      // const { hash, search } = new URL(url);
      // console.log(search);
      // let h5PageName = hash;
      // if (/\?/.test(hash)) {
      //   [h5PageName] = hash.split('?');
      // }
      // pageName = h5Map[h5PageName.replace(/#/g, '')];
      // pagePath = pages.all[pageName];
    }
    query = query ? `?${query}` : '';
    return {
      pageName,
      query,
      pagePath: `${pagePath}${query}`,
    };
  },

  /**
   * 扩展页面跳转方法，支持内部跳转以及H5 url 映射到小程序内部跳转
   *
   * @param {any} url
   * @param {any} [query={}]
   * @returns
   */
  goPage(url, query = {}) {
    if (!url) return;
    const { replace, back } = query;
    let type = replace ? 'replace' : (back ? 'back' : '');
    /* eslint no-param-reassign: 0 */
    delete query.replace;
    delete query.back;
    const { pageName, pagePath } = this.getCurPageUrl(url, query);
    if (!pagePath) return;
    const page = { url: `../../${pagePath}` };
    if (pages.tabs[pageName]) {
      type = 'switch';
    }
    switch (type) {
      case 'replace':
        this.redirectTo(page);
        break;
      case 'back':
        this.navigateBack(page);
        break;
      case 'switch':
        this.switchTab(page);
        break;
      default:
        /* eslint no-undef: 0 */
        if (getCurrentPages().length >= deepLength) {
          this.redirectTo(page);
        } else {
          // navigateTo, redirectTo 只能打开非 tabBar 页面。
          // switchTab 只能打开 tabBar 页面。
          this.navigateTo(page);
        }
        break;
    }
  },

  /**
   * showErrPage
   *
   * @param {string} [message='']
   * @param {boolean} [replace=true]
   */
  showErrPage(message = '', replace = true) {
    this.goPage('error', {
      message,
      replace,
    });
  },
};
