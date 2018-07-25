
// 渠道业务统计
// channel spm 等数据

// 在 onShow 中获取入口渠道参数
function preAppOnLaunch(a, b, c) {
  console.warn(':::-1', a, b, c);
}
function preAppOnShow(a, b, c) {
  console.warn(':::-2', a, b, c);
}
function prePageOnLoad(a, b, c) {
  console.warn(':::-3', a, b, c);
}
function prePageOnShow(a, b, c) {
  console.warn(':::-4', a, b, c);
}

exports.init = function(opts = {}) {
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
