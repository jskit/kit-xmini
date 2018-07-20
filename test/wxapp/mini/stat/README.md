# 统计方案

借助 x-mini 的实现，轻松接入统计

## 能统计到什么

以小程序生命周期为切入点，可以统计到用户的常规操作，并且还支持自定义事件统计。

App 相关统计

- 生命周期
  - onLaunch
  - onUnlaunch
  - onShow
  - onHide
  - onError
- 网络类型
- 系统设备
- 用户相关信息
- 地理位置 经纬度 速度
- UV

Page 相关统计

- PV
- 生命周期
  - onLoad
  - onUnload
  - onShow
  - onHide
  - onReachBottom
  - onPullDownRefresh
  - onShareAppMessage

其他统计数据

- 小程序标识 appId
- 用户唯一标识 userId || UUID
- 渠道相关信息 channel spm
- 页面上下文
- App、Page 停留时间
- 错误计数
