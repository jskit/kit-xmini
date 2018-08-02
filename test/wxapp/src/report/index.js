import report from './report';
function preAppOnError(err = '') {
  console.log('report error:')
  console.error(JSON.stringify(err));
}

function preAppOnLaunch() {
  console.log('report pre app.js onLaunch:', this);
}
function postAppOnLaunch() {
  console.log('report post app.js onLaunch:', this);
}

exports.init = function(opts = {}) {
  console.log(':::x-mini add report');
  const {
    me,
    xApp,
    xPage,
    // getLocation,
  } = opts;

  Object.assign(me, {
    $report: report,
  });

  xApp.use("onError", preAppOnError);
  xApp.use("onLaunch", preAppOnLaunch);
  xApp.use("onLaunch", postAppOnLaunch, 'post');
}
