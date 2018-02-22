// 初始化项目
import { me } from './origin';
import { mapTo } from './utils';

let miniConfig = {};
let pages;
let tabBar;
let tabBarList;

// 此文件路径在 ./node_modules/x-mini/lib/pages.js
// 所以引入文件需要 跳出四层
switch (me.miniType) {
  case 'aliapp':
    miniConfig = require('../../../../app.json');
    pages = miniConfig.pages;
    tabBar = miniConfig.tabBar;
    // { pages = [], tabBar = {} } = miniConfig;
    tabBarList = tabBar.list || [];
    break;
  case 'wxapp':
    miniConfig = __wxConfig;
    pages = miniConfig.pages;
    tabBar = miniConfig.tabBar;
    // { pages = [], tabBar = {} } = miniConfig;
    tabBarList = tabBar.list;
    break;
  default:
    // do nothing
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

/* eslint prefer-destructuring: 0 */
regPages.defaultPage = pages[0].split('/').reverse()[0];

const tabPages = mapTo(tabBarList, (item) => {
  return item.pagePath.replace('.html', '')
});
regPages.tabPages = pagesMap(tabPages);

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
