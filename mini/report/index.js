
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
    app,
    page,
  } = opts;

  app.use("onError", preAppOnError);
  app.use("onLaunch", preAppOnLaunch);
  app.use("onLaunch", postAppOnLaunch, 'post');
}
