# 数据统计

- stat 收集数据、向外提供
- piwik 获取数据、实现上报

## plugin-stat

收集尽可能多的数据(数据命名，使用下划线，更清晰，统一加 `mini_` 前缀)

- preAppOnLaunch
  - 平台初始化，暂无处理
  - 初始化数据 uuid timestamp showtime duration error_count page_count first_page show_options
  - getNetworkType 获取网络状态信息
    - network_type
  - getSystemInfo 获取系统信息，拆分保存
    - sdk_version ? SDKVersion : '1.0.0'
    - phone_model
    - pixel_ratio
    - window_width
    - window_height
    - language
    - wechat_version
    - system
    - platform
  - getLocation 获取定位信息，wgs84
    - latitude
    - longitude
    - speed
  - getUserInfo 获取用户信息
- preAppOnShow
  - shareTicket 获取分享票据
- preAppOnHide
  - this.mini_duration = Date.now() - this.mini_showtime;
- preAppOnUnlaunch
  - this.mini_duration = Date.now() - this.mini_showtime;
- preAppOnError
  - this.mini_error_count++;
  - this.error_message, value;

## 详细数据

以下为收集数据的字段命名、缩写，以及解释

```js
const sdkVersion = systemInfo['SDKVersion'];
app.mini_sdk_version = isUnDef(sdkVersion) ? '1.0.0' : sdkVersion;
{
  name: app.appId,
  v: version,

  so: app.mini_showoption, // app
  st: app.mini_start_time, // Date.now()
  ts: page.mini_timestamp,
  dr: app.mini_duration, // Date.now() - page.mini_start_time,

  ec: page.mini_error_count,
  la_c: launchTimes,
  as_c: showTimes,
  ah_c: hideTimes,

  // 公共
  nt: app.mini_network_type
  ht: app.mini_host, // systemInfo['app'] 当前运行的客户端 alipay wechat
  pf: app.mini_platform, // systemInfo['platform'] 客户端平台 Android iOS
  vos: app.mini_system_version, // systemInfo['system'] 操作系统版本
  vh: app.mini_host_version, // systemInfo['version'] 宿主版本号
  v_sdk: app.mini_sdk_version, // 客户端基础库版本
  lang: app.mini_language, // systemInfo['language'] 设置的语言
  sb: app.mini_phone_brand, // systemInfo['brand'] 手机品牌
  apm: app.mini_phone_model, // systemInfo['model'] 手机型号
  apr: app.mini_pixel_ratio, // systemInfo['pixelRatio'] 设备像素比
  // sw: app.mini_screen_width, // systemInfo['screenWidth'] 屏幕宽高
  // sh: app.mini_screen_height, // systemInfo['screenHeight']
  ww: app.mini_window_width, // systemInfo['windowWidth'] 可使用窗口宽高
  wh: app.mini_window_height, // systemInfo['windowHeight']

  // ln: app.mini_location_name,
  // wxapp wgs84
  lat: app.mini_lat, // res.latitude
  lng: app.mini_lng, // res.longitude
  lsp: app.mini_speed, // res.speed

  // 定位信息支付宝会返回更多数据，如 province city district 等信息

  pp: page.route,
  pq: page.mini_page_query,
  psc: page.page_share_count,

  ifo: app.mini_is_first_open,
  ifp: app.mini_is_first_page,
  lp: app.mini_page_last_page,

  // event 专有
  // tp: event value
  // ev: event name/ page / app
}
```

## 统计事件

```js
log('app', 'show');
log('page', 'show');
log('component', 'show');
log('event', 'share_click', 'event data');
log('event', 'error_message', 'err data');

sendEvent(action, value = '') {
  // 参数长度不能超过255个字符
  // 事件名 action 只支持Number,String等类型
  // 事件数据 value 只支持 String,Object类型
  log('event', action, JSON.stringify(value));
}
```

- app
  - onError
  - onLaunch
  - onShow
  - onHide
  - onUnlaunch
- page/component
  - onLoad
  - onReady
  - onShow
  - onHide
  - onUnload
  - onShareAppMessage

```js
const { xmini } = 'xmini';
const startTime = Date.now();//启动时间
App({
  onShow() {
    xmini.event('小程序的启动时长', {
      time : Date.now() - startTime
    });
  },
});
```
