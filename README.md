# techarts

`techarts` 将 [ec-canvas](https://github.com/ecomfe/echarts-for-weixin) 封装成了一个 Taro 组件，简化了 ec-canvas 的使用

# 安装

```javascript
npm install techarts
```

# 用法

```javascript
import EChart from 'techarts';
// 自定义构建的echarts
import * as echarts from './echarts';

<EChart echarts={echarts} option={option} canvasId="mychartline" />;
```

# 参数

| 参数名称     | 解释                                                                                                                        | 默认值 | 是否必填 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| echarts      | echarts 对象。建议去[官网](https://www.echartsjs.com/zh/builder.html)自定义构建；注意不要勾选“代码压缩”，可下载后自行压缩。 | -      | Y        |
| option       | 参数同[echart option](https://echarts.apache.org/zh/option.html#title)                                                      | -      | Y        |
| canvasId     | cancas-id 兼容低基础库版本（<2.9.0）时需要                                                                                  | -      | N        |
| disableTouch | 是否禁用手势                                                                                                                | false  | N        |
| lazyLoad     | 需要拿到组件实例手动 init 的时候请传递 true                                                                                 | false  | N        |
| style        | 样式                                                                                                                        | -      | N        |

# 示例

参照项目 [demo](https://github.com/elvinzhu/techarts/tree/master/demo) 目录

# License

MIT[@elvinzhu](https://github.com/elvinzhu)
