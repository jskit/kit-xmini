
function preAppOnError(err) {
  console.log(err);
}

function preAppOnLaunch() {
  console.log('report pre app.js onLaunch:', this);
}
function postAppOnLaunch() {
  console.log('report post app.js onLaunch:', this);
}

export.report = function() {
  // 自定义上报问题
}

exports.init = function(app, page) {
  app.use("onError", preAppOnError);
  app.use("onLaunch", preAppOnLaunch);
  app.use("onLaunch", postAppOnLaunch, 'post');
}
