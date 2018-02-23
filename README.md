# x-mini

封装小程序，针对不同的小程序，不要将判断封装在里面，请自己选择使用

```js
// 需要注意的文件
./mini/rewrite/index.js
./mini/pages.js
```

## 使用

请把代码下载到项目根目录 `./mini` 中，统一通过 `./utils/mini.js` 暴露接口来引用

```js
// ./utils/mini.js
import mini from '../mini'

export default mini;
```

## Testing

可以以支付宝小程序为例测试
