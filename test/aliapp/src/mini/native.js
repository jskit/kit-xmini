const config = {
  getLocation: false,
};

const noop = () => {};

exports.getUserInfo = function getUserInfo(cb = noop) {
  if (wx.getSetting) {
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
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
  wx.getNetworkType({
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
  wx.getSystemInfo({
    success: function(res) {
      cb(res);
    },
    complete: function() {
      // next();
    },
  });
}

exports.getLocation = function getLocation(cb = noop) {
  wx.getLocation({
    type : 'wgs84',
    success: function(res) {
      cb(res);

    },
  });
}
