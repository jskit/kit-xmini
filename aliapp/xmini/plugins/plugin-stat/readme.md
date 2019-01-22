# 数据统计

- stat 收集数据、向外提供
- piwik 获取数据、实现上报

## plugin-stat

收集尽可能多的数据(数据命名，使用下划线，更清晰，统一加 `` 前缀)

- 每个阶段能收集到哪些数据
  - 打开次数
  - 启动时长、app停留时长、页面停留时长
  - 打开页面的数量、入口页面、离开页面
- 收集的数据怎么向外提供
  - 通过触发 stat_update 向外提供（此时提供的数据，会setData）
- 什么时候上报数据
  - 通过触发 log ，提示要上报数据（此时的数据，不setData）

- app
  - onError
    - 产出错误信息 error
    - 记录错误总数量 errorCount
    log('event', 'error', JSON.stringify(err));
  - onLaunch
    - 结合条件判断
      - 当前app是否已经上报过
    - 基础信息初始化
      - 生成uuid, 唯一标识
      - timestamp = Date.now()
      - appShowTime = Date.now()
      - appDuration = 0
      - errorCount = 0
      - pageCount = 1
      - firstPage = 1
      - launchTimes++ ?
      - 获取启动参数 showOptions（获取 referer 信息）
      - 场景值 √
    - 同步获取系统信息 systemInfo
    - 异步获取定位信息 location（可更新）
    - 异步获取网络状态信息 networkType（可更新）
    - 获取用户信息[有或没有]（提供给业务更新）
    emit('stat_data', { ...rest }, this); 不论同步或异步，数据更新后要发送通知
  - onShow
    - 获取分享票据 shareTicket 等
    - 获取启动参数 showOptions（获取 referer 信息）
    emit('stat_data', { ...rest }, this);
    - 计算并 event 上报启动时长 startupTime(注意保活机制)
      emit('event', '启动时长', 'time')
    - showTimes++
  - onHide
    - 计算使用时长 appDuration = Data.now() - appShowTime
    - hideTimes++
  - onUnlaunch
    - 计算使用时长 appDuration = Data.now() - appShowTime
    - hideTimes++
- page/component
  - onLoad
    - 获取页面参数，pageQuery（获取 referer 信息）
    emit('stat_data', { ...rest }, this); 更新当前页面相关信息，如 referer query 等
  - onReady
    - 计算页面准备时间
  - onShow
    - 结合条件判断
      - 当前页面是否已经上报过
      - pageCount++
    - showTime = 0
    - 是否是第一个页面
    - 设置 last_page 为当前页面
    - 触发上报 pv
    emit('stat_data', { ...rest }, this); 更新当前页面相关信息
    log('pv', 'pageUrl')
  - onHide
    - 计算当前页面时长 duration = Data.now() - showTime
    log('event', '当前页面浏览时长', 'duration') 上报页面浏览时长
  - onUnload
    - 计算当前页面时长 duration = Data.now() - showTime
    log('event', '当前页面浏览时长', 'duration')
  - onShareAppMessage

注意事项

- 获取启动相关 referer 信息，有多处，一个是 app onShow，一个是 page onLoad
- 获取页面跳转相关 referer 信息，就是上一页

其他问题

- duration 在 app page 上报时，代表意义不同
- onLoad 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。
- onReady 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互。
- onShow 页面显示/切入前台时触发。

## 数据详细

以下为收集数据的字段命名、缩写，以及解释

```js
const sdkVersion = systemInfo['SDKVersion'];
app.sdkVersion = isUnDef(sdkVersion) ? '1.0.0' : sdkVersion;
{
  name: app.appId,
  v: version,

  so: app.showOptions, // app
  st: app.startTime, // Date.now()
  ts: page.timestamp,
  dr: app.duration, // Date.now() - page.startTime,

  ec: page.errorCount,
  la_c: launchTimes,
  as_c: showTimes,
  ah_c: hideTimes,

  // 公共数据
  nt: app.networkType
  ht: app.host, // systemInfo['app'] 当前运行的客户端 alipay wechat
  pf: app.platform, // systemInfo['platform'] 客户端平台 Android iOS
  vos: app.systemVersion, // systemInfo['system'] 操作系统版本
  vh: app.hostVersion, // systemInfo['version'] 宿主版本号
  v_sdk: app.sdkVersion, // 客户端基础库版本
  lang: app.language, // systemInfo['language'] 设置的语言
  sb: app.brand, // systemInfo['brand'] 手机品牌
  apm: app.model, // systemInfo['model'] 手机型号
  apr: app.pixelRatio, // systemInfo['pixelRatio'] 设备像素比
  sw: app.screenWidth, // systemInfo['screenWidth'] 屏幕宽高
  sh: app.screenHeight, // systemInfo['screenHeight']
  ww: app.windowWidth, // systemInfo['windowWidth'] 可使用窗口宽高
  wh: app.windowHeight, // systemInfo['windowHeight']

  // ln: app.location_name,
  // wxapp wgs84
  lat: app.lat, // res.latitude
  lng: app.lng, // res.longitude
  lsp: app.speed, // res.speed

  // 定位信息支付宝会返回更多数据，如 province city district 等信息

  pp: page.route,
  pq: page.pageQuery,
  psc: page.pageShareCount,

  ifo: app.isFirstOpen,
  fp: app.firstPage,
  lp: app.lastPage,

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
log('event', 'error', 'err data');

sendEvent(action, value = '') {
  // 参数长度不能超过255个字符
  // 事件名 action 只支持Number,String等类型
  // 事件数据 value 只支持 String,Object类型
  log('event', action, JSON.stringify(value));
}
```

```js
const { xmini } = 'xmini';
const startTime = Date.now(); // 启动时间
App({
  onShow() {
    xmini.event('小程序的启动时长', {
      time : Date.now() - startTime
    });
  },
});
```
