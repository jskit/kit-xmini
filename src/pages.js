// 初始化项目
import { mapTo } from './utils';

// let miniConfig = {};
// let pages = [];
// let tabBar;
// let tabBarList;
// let tabPages = [];

// 引入所有注册的 pages
// alipay
const miniConfig = require('../app.json');
// // 也可以使用一个全局变量来替代 $global，但没有顺序了
// const { pagesConfig = {}, tabsConfig = {} } = $global;
// const pages = Object.keys(pagesConfig);
// const tabPages = Object.keys(tabsConfig);
// tabBarList = miniConfig.tabBar;
const { pages = [], tabBar = {} } = miniConfig;
const tabBarList = tabBar.list || [];
const tabPages = mapTo(tabBarList, (item) => {
  return item.pagePath;
});

// // wxapp
// // __wxConfig 微信小程序内的一个全局变量
// miniConfig = __wxConfig;
// /* eslint prefer-destructuring: 0 */
// pages = miniConfig.pages;
// tabBar = miniConfig.tabBar;
// // { pages = [], tabBar = {} } = miniConfig;
// tabBarList = tabBar.list;
// tabPages = mapTo(tabBarList, (item) => {
//   return item.pagePath.replace('.html', '')
// });


console.log('test');
console.log(pages);

function pagesMap(pageArr) {
  return pageArr.reduce((obj, item) => {
    const page = item.split('/').reverse()[0] || '';
    /* eslint no-param-reassign: 0 */
    obj[page] = `${item}`;
    return obj;
  }, {});
}

const regPages = pagesMap(pages);

if (pages.length) {
  [regPages.defaultPage] = pages[0].split('/').reverse();
} else {
  console.error(`pages 为空，发生错误`);
}

// 支付宝变量取配置$global时，没拿到数组排序
// 所以如果 index 存在，则设置index为默认首页
// if (me.miniType === 'aliapp') {
//   regPages.defaultPage = 'index';
// }

regPages.tabPages = pagesMap(tabPages);

// regPages.updateDefaultPage = (pageName) => {
//   regPages.defaultPage = regPages[pageName];
// }

console.log('所有注册页面：');
console.log(regPages);

export default regPages;

