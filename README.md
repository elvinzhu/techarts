# techarts

开箱即用的 Taro2 echarts 组件，不需要配置任何 "copy". 据有以下特性：

- 支持多种使用方式。
- 支持自定义构建的 echarts
- 支持导出图片

如果你觉得解决了你的问题，并节省了时间，请在 github 上给我一个小星星 ^\_^

## 安装

```javascript
// 注意必须要加版本号，因为最新版本兼容了 Taro3 不兼容Taro2
npm install techarts@^1.0.6
```

## 使用

```jsx
import EChart from 'techarts';
// 自定义构建的echarts
import * as echarts from './echarts';

// 基本用法
<EChart echarts={echarts} option={option} />;
// 通过组件实例设置数据
<EChart
  ref={(node) => {
    this.chart = node;
  }}
  echarts={echarts}
/>;
this.chart.setOption({...});
// 自定义初始化
<EChart echarts={echarts} onInit={this.onInit} />;

onInit = (canvas, width, height, dpr) => {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr,
  });
  canvas.setChart(chart);
  chart.setOption(this.state.option);
  // this.chart = chart; // 通过chart也可以setOption
  // chart.on('click', e => {})
  // chat.on('selectchanged', e => {})
  return chart; // 必须return
};
// 以上三种用法可以结合使用
```

## 参数

| 参数名称     | 解释                                                                                                                             | 默认值 | 是否必填 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- |
| echarts      | echarts 对象。建议去[官网](https://www.echartsjs.com/zh/builder.html)自定义构建；<br/>注意不要勾选“代码压缩”，可下载后自行压缩。 | -      | Y        |
| option       | 参数同[echart option](https://echarts.apache.org/zh/option.html#title)                                                           | -      | Y        |
| canvasId     | cancas-id 兼容低基础库版本（<2.9.0）时需要                                                                                       | -      | N        |
| disableTouch | 是否禁用手势                                                                                                                     | false  | N        |
| lazyLoad     | 需要拿到组件实例手动 init 的时候请传递 true                                                                                      | false  | N        |
| style        | 样式                                                                                                                             | -      | N        |
| onInit       | 需要自定义 echarts init 时使用（可用此方式给 echarts 绑定事件）                                                                  | -      | N        |

## 实例 API

| API 名称             | 参数                                                                                                 | 回调参数  |
| -------------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| init                 | callback                                                                                             | 同 onInit |
| setOption            | [echart option](https://echarts.apache.org/zh/option.html#title)                                     | -         |
| canvasToTempFilePath | 同[小程序](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/wx.canvasToTempFilePath.html) | 同小程序  |
| getCanvasId          | 获取容器 id                                                                                          | -         |

## 示例

参照项目 [demo](https://github.com/elvinzhu/techarts/blob/master/demo/src/pages/index/index.jsx) 目录

## 注意事项

- Taro H5 本地开发时样式加载延时，导致 echarts 初始化宽高读取错误。build 之后正常
- `canvasToTempFilePath` h5 未实现定制宽高位置等功能

## License

MIT[@elvinzhu](https://github.com/elvinzhu)
