
function preAppOnError(err) {
  console.log(err);
}

function preAppOnLaunch() {
  console.log('report pre app.js onLaunch:', this);
}
function postAppOnLaunch() {
  console.log('report post app.js onLaunch:', this);
}

exports.report = function() {
  // 自定义上报问题
}

exports.init = function(opts = {}) {
  const {
    xApp,
    xPage,
  } = opts;

  xApp.use("onError", preAppOnError);
  xApp.use("onLaunch", preAppOnLaunch);
  xApp.use("onLaunch", postAppOnLaunch, 'post');
}
