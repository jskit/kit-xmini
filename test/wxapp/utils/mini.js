
import XMini, { utils } from '../../../lib/wxapp';
// import { pages, tabBar } from '../app.json';

const { noop, mapTo, pagesObj } = utils;

// wxapp
// __wxConfig 微信小程序内的一个全局变量
const miniConfig = __wxConfig;
const { pages = [], tabBar = {} } = miniConfig;
const tabBarList = tabBar.list;
const tabPages = mapTo(tabBarList, (item) => {
  return item.pagePath.replace('.html', '')
});

const allPages = pagesObj(pages, tabPages);

const mini = new XMini({
  pages: allPages,
  me: my,
  xApp: noop,
  xPage: Page,
  getCurrentPages,
  miniType: 'wxapp',
});

console.log(mini);

export default mini;
