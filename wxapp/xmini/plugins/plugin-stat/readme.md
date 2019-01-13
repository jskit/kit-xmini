# 数据统计

- stat 收集数据、向外提供
- piwik 获取数据、实现上报

## plugin-stat

收集尽可能多的数据(数据命名，使用下划线，更清晰，统一加 `mini_` 前缀)

- 每个阶段能收集到哪些数据
- 什么时候向外提供这些数据
- 什么时候触发上报

- app
  - onError
    - 产出错误信息 error_message
    - 记录错误总数量 error_count
    - emit('event', 'error_message', JSON.stringify(err))
  - onLaunch
    - 结合条件判断
      - 当前app是否已经上报过
    - 基础信息初始化
      - 生成uuid, 唯一标识
      - timestamp = Date.now()
      - showtime = Date.now()
      - duration = 0
      - error_count = 0
      - page_count = 1
      - first_page = 1
      - launchTimes++ ?
    - 同步获取系统信息 systemInfo
    - 异步获取定位信息 location（可更新）
    - 异步获取网络状态信息 networkType（可更新）
    - 获取用户信息[有或没有]（提供给业务更新）
    - 获取启动参数 showOptions（获取 referer 信息）
  - onShow
    - 获取分享票据 shareTicket 等
    - 获取启动参数 showOptions（获取 referer 信息）
    - 计算并 event 上报启动时长 startupTime(注意保活机制)
    - showTimes++
  - onHide
    - 计算使用时长 duration = Data.now() - showtime
    - hideTimes++
  - onUnlaunch
    - 计算使用时长 duration = Data.now() - showtime
    - hideTimes++
- page/component
  - onLoad
    - 获取页面参数，pageQuery（获取 referer 信息）
  - onReady
    - 计算页面准备时间
  - onShow
    - 结合条件判断
      - 当前页面是否已经上报过
      - page_count++
    - start_time = 0
    - 是否是第一个页面
    - 设置 last_page 为当前页面
    - 触发上报 pv
  - onHide
    - 计算当前页面时长 Data.now() - start_time
  - onUnload
    - 计算当前页面时长 Data.now() - start_time
  - onShareAppMessage

注意事项

- 获取启动相关 referer 信息，有多处，一个是 app onShow，一个是 page onLoad
- 获取页面跳转相关 referer 信息，就是上一页

其他问题

- mini_duration 在 app page 上报时，代表意义不同
- onLoad 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
- onReady 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
- onShow 页面显示/切入前台时触发。

## 数据详细

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

  // 公共数据
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
  sw: app.mini_screen_width, // systemInfo['screenWidth'] 屏幕宽高
  sh: app.mini_screen_height, // systemInfo['screenHeight']
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

## 数据产出格式

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
