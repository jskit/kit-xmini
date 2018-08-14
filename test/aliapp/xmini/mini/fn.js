import native from './native';

const config = {
  getLocation: false,
};

const noop = () => {};

exports.getUserInfo = function getUserInfo(cb = noop) {
  const {
    me,
    storage,
  } = native.get();
  if (me.getSetting) {
    me.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          me.getUserInfo({
            withCredentials: false,
            success: function (res) {
              cb(res);
            },
          });
        }
      },
    });
  }
};

exports.getNetworkType = function getNetworkType(cb = noop) {
  const {
    me,
    storage,
  } = native.get();
  me.getNetworkType({
    success: function(res) {
      cb(res);
      // scope.mini_network_type = res['networkType'];
    },
    complete: function() {
      // next();
      // getSystemInfo(scope);
    },
  });
}

exports.getSystemInfo = function getSystemInfo(cb = noop) {
  const {
    me,
    storage,
  } = native.get();
  me.getSystemInfo({
    success: function(res) {
      cb(res);
    },
    complete: function() {
      // next();
    },
  });
}

exports.getLocation = function getLocation(cb = noop) {
  const {
    me,
    storage,
  } = native.get();
  me.getLocation({
    type : 'wgs84',
    success: function(res) {
      cb(res);

    },
  });
}
