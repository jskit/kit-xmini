
// 渠道业务统计

// 在 onShow 中获取入口渠道参数
// channel_id
// spm

// 入口参数示例

// {
//   path: "pages/index/index",
//   query: {},
//   scene: 1001,
// }

function preAppOnLaunch(options = {}, fnName) {
  console.warn(':::-1', options, fnName);
}
function preAppOnShow(options = {}, fnName) {
  const { path, query, scene } = options;
  console.warn(':::-2', options, fnName);
}
function prePageOnLoad(options = {}, fnName) {
  console.warn(':::-3', options, fnName);
}
function prePageOnShow(options = {}, fnName) {
  console.warn(':::-4', options, fnName);
}

exports.init = function(opts = {}) {
  console.log('tip: x-mini add channel');
  const {
    me,
    xApp,
    xPage,
  } = opts;

  xApp.use("onLaunch", preAppOnLaunch);
  xApp.use("onShow", preAppOnShow);

  xPage.use("onLoad", prePageOnLoad);
  xPage.use("onShow", prePageOnShow);
}
