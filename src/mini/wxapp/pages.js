import { me } from '../mini';
import {
  mapTo,
  pagesObj,
} from '../utils';

// wxapp
// __wxConfig 微信小程序内的一个全局变量
if (typeof __wxConfig !== 'undefined') {
  const miniConfig = __wxConfig;
  const { pages = [], tabBar = {} } = miniConfig;
  const tabBarList = tabBar.list;
  const tabPages = mapTo(tabBarList, (item) => {
    return item.pagePath.replace('.html', '')
  });

  me.pages = pagesObj(pages, tabPages);
}


export default me.pages;
