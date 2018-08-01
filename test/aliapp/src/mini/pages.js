
function pagesMap(pageArr = []) {
  return pageArr.reduce((obj, item) => {
    const page = item.split('/').reverse()[0] || '';
    /* eslint no-param-reassign: 0 */
    obj[page] = `${item}`;
    return obj;
  }, {});
}

function pagesObj(allPages, tabPages) {
  return {
    allPages: pagesMap(allPages),
    tabPages: pagesMap(tabPages),
    defaultPage: allPages[0] && allPages[0].split('/').reverse()[0] || '',
  }
}

// const appConfig = typeof __wxConfig !== 'undefined' ? __wxConfig : require('/app.json');
function miniPages(appConfig = {}) {
  const { pages = [], tabBar = {} } = appConfig;
  const tabBarList = tabBar.items || tabBar.list || [];
  const tabPages = tabBarList.map((item) => {
    return item.pagePath;
  });
  return pagesObj(pages, tabPages);
}

module.exports = miniPages
