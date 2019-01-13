# 数据统计

- stat 收集数据、向外提供
- piwik 获取数据、实现上报

## plugin-piwik

上报数据

- 配置型数据，只配置一次或有更新时触发
  - 自身配置的数据
    - 配置信息
  - 以及 stat 收集的数据
    - 系统信息
    - 用户信息
- 日志型数据，有无更新，只要产生数据，都作一次上报
  - _trackPageView
    - pageUrl
  - _trackCustomVar
    - index
    - name
    - value
  - _trackEvent 启动时长
    - category
    - action
    - value

```js
const date = new Date();
const data = this.getPiwikData();
{
  idsite: 2,
  rec: 1,
  reportURI: 'https://your-piwik-domain.example/piwik.php', // 上报 url
  token_auth: '',
  channel: '',
  spm: '',

  _id: '', // 支付宝小程序使用 user_id + idsite 前端生成ID，微信小程序使用 openid + idsite 前端生成ID
  uid: '',

  // pv & event
  url: '',
  urlref: '', // 是上一个页面
  _ref: '', // 本次访问的来源页面（可以理解成本次访问第一个页面的urlref）
  refer: '',
  action_name: '', // 记录页面、事件或行为的名称
  e_c: 'category', // 事件类型[点击、曝光、加载]
  e_a: 'action', // 事件Id，具体事件名称
  e_n: 'value', // 数据
  gt_ms: '', // 某个行为的时长，如打开事件，发送请求的时间

  // search
  search: '',
  search_cat: '',
  search_count: '',

  res: '', // 访客访问设备的分辨率
  r: '', // 6位随机数字，用于清除浏览器请求的缓存
  h: date.getHours(),
  m: date.getMinutes(),
  s: date.getSeconds(),
  send_image: 0,

  cvar: JSON.stringify({
    1: ['channel', data.channel],
    2: ['city_name', data.cityName],
    3: ['spm', data.spm],
    4: ['user_id', data.userId || ''],
  }),
  _cvar: JSON.stringify({
    1: ['spm', data.spm],
    2: ['openid', data.openId || null],
    3: ['city_name', data.cityName || null],
    4: ['user_id', data.userId || ''],
  }),

  country; 'cn',
  region: '',
  city: location.provinceId,
  lat: location.lat || 0,
  long: location.long || 0,
  cdt: parseInt(date / 1000),
}
```

使用示例

统计 pv 需要上传

```js
{
  urlref: 'refer' || 'istoppage',
  _ref: 'loadRefer',
  action_name: pageName,
  url: 'http://' + pagePath,
}

// 统计事件需要上传
{
  url: 'http://' + pagePath,
  action_name: action,
  e_c: category, // 事件类型[点击、曝光、加载]
  e_a: action, // 事件Id，具体事件名称
  e_n: value, // 数据
}
```

自定义数据

更多文档说明

https://developer.matomo.org/api-reference/tracking-api

```js
{
  // 必须参数 init方法设定
  idsite: 2, // 网站 id，2 用来测试
  rec: 1, // 必须设置为1
  reportURI: 'https://your-piwik-domain.example/piwik.php', // 上报 url
  token_auth: '',

  // 推荐参数
  action_name: '', // 事件名称，用户上报PV、UV时的页面路径
  url: '',
  // 访客的唯一ID
  // 必须是长度16位十六进制字符串。每个访客必须分配不同的唯一ID，并且分配后不能改变。
  // APP、H5使用piwik生成的ID
  // 支付宝小程序使用 user_id + idsite 前端生成ID，微信小程序使用 openid + idsite 前端生成ID
  _id: '',
  rand: '',
  r: '', // 6位随机数字，用于清除浏览器请求的缓存
  apiv: 1, // 当前始终设置为1

  // 可选用户信息
  uid: '', // 生成的唯一ID
  urlref: '', // 前一个页面的完整url，若无，则设置为 istoppage
  _ref: '', 本次访问的来源url。用于统计搜索引擎来源，投放来源等。
  // 自定义变量
  cvar: JSON.stringify({
    1: ['channel', this.config.channel],
    2: ['city_name', this.config.cityName],
    3: ['spm', this.config.spm],
    4: ['user_id', this.config.userId || ''],
  }),
  _idvc: '', // 该访客总计访问的次数，间隔在1小时内的访问为一次连续的访问，超过1小时则加1。若不支持本地缓存，则不传
  _viewts: '', // 该访客上次访问时间的UNIX时间戳（秒为单位）。若不支持本地缓存则不传。
  _refts: '', // 该访客上次访问时间的UNIX时间戳（秒为单位）。若不支持本地缓存，则不传。
  _idn: 0, // 未知，默认0
  res: '', // 访客访问设备的分辨率
  ua: '',
  cid: '',
  new_visit: '',

  // 可选的操作信息
  _cvar: JSON.stringify({
    1: ['spm', this.config.spm],
    2: ['openid', this.config.openId || null],
    3: ['city_name', this.config.cityName || null],
    4: ['user_id', this.config.userId || ''],
  }),
  link: '',

  // 可选的事件跟踪
  e_c: '', // 事件的类别，不能为空。如：视频、音乐、游戏等
  e_a: '', // 事件的行为，不能为空。如：播放、暂停、持续时长
  e_n: '', // 事件的名称，如：电影名，歌曲名等
  // e_v: '',

  // 其他参数
  token_auth: '', 长度为32位的用户授权串，用于接口授权验证。
  cdt: '', 覆盖请求的日期时间
  country: '',
  region: '',
  city: '',
  lat: '',
  long: '',
  ping: '',

  // 其他参数
  send_image: 0, // 如果设置为0，则返回http请求而不是返回一张图片
  ping: 0, // 如果设置为1，则该请求是不记录任何活动的心跳检查请求

  // 批量跟踪
  requests: [],
}
```
