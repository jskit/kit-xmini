import {
  mapTo,
  pagesObj,
} from '../utils';

// alipay
const miniConfig = require('../../../../../src/app.json');

const { pages = [], tabBar = {} } = miniConfig;
const tabBarList = tabBar.list || [];
const tabPages = mapTo(tabBarList, (item) => {
  return item.pagePath;
});

// // 也可以使用一个全局变量来替代 $global，但没有顺序了
// const { pagesConfig = {}, tabsConfig = {} } = $global;
// const pages = Object.keys(pagesConfig);
// const tabPages = Object.keys(tabsConfig);

// 支付宝变量取配置$global时，没拿到数组排序
// 所以如果 index 存在，则设置index为默认首页
// if (me.miniType === 'aliapp') {
//   regPages.defaultPage = 'index';
// }

const allPages = pagesObj(pages, tabPages);

export default allPages;
