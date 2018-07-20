// 初始化项目
import { me } from './origin';
import { mapTo } from './utils';

let miniConfig = {};
let pages = [];
let tabBar;
let tabBarList;
let tabPages = [];

// 此文件路径在 ./node_modules/x-mini/lib/pages.js
// 所以引入文件需要 跳出四层，而且引入文件的配置文件app.json 的位置并不固定，
// 就需要使用时，传入配置路径
// 所以推荐使用全局变量来处理
if (me.miniType === 'alipay') {
  // 使用一个全局变量来替代 $global
  // miniConfig = require('../../../../app.json');
  const { pagesConfig = {}, tabsConfig = {} } = $global;
  pages = Object.keys(pagesConfig);
  tabPages = Object.keys(tabsConfig);
  // tabBarList = miniConfig.tabBar;
  // { pages = [], tabBar = {} } = miniConfig;
  // tabBarList = tabBar.list || [];
}
if (me.miniType === 'wxapp') {
  // __wxConfig 微信小程序内的一个全局变量
  miniConfig = __wxConfig;
  /* eslint prefer-destructuring: 0 */
  pages = miniConfig.pages;
  tabBar = miniConfig.tabBar;
  // { pages = [], tabBar = {} } = miniConfig;
  tabBarList = tabBar.list;
  tabPages = mapTo(tabBarList, (item) => {
    return item.pagePath.replace('.html', '')
  });
}

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

// 支付宝变量取配置时，没拿到数组排序
// 所以如果 index 存在，则设置index为默认首页
if (me.miniType === 'aliapp') {
  regPages.defaultPage = 'index';
}

regPages.tabPages = pagesMap(tabPages);

regPages.updateDefaultPage = (pageName) => {
  regPages.defaultPage = regPages[pageName];
}

console.log('所有注册页面：');
console.log(regPages);

export default regPages;
// export default {
//   init() {
//     // 初始化项目

//   },
//   all() {
//     return regPages;
//   },
//   tabs() {
//     return tabPages;
//   },
// };
