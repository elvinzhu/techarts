import Taro, { Component } from '@tarojs/taro';
import * as echarts from './echarts';
import EChart from '../EChart/index';

export default class LineChart extends Component {
  option = null;
  getOption = getOption;

  render() {
    const option = this.getOption(this.props);
    return <EChart echarts={echarts} option={option} canvasId="mychartline" />;
  }
}

function getOption({ xData, yData }) {
  if (this.xData === xData && this.yData === yData) {
    return this.option;
  }

  this.xData = xData;
  this.yData = yData;

  this.option = {
    title: {
      show: false,
      // text: '测试下面legend的红色区域不应被裁剪',
      // left: 'center'
    },
    color: ['#1890ff'],
    legend: {
      show: false,
      // data: ['A', 'B', 'C'],
      // top: 50,
      // left: 'center',
      // backgroundColor: 'red',
      // z: 100
    },
    grid: {
      // show: true,
      containLabel: true,
      top: 10,
      left: 2,
      right: 25,
      bottom: 10,
      // borderColor: '#ff0000'
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: '{c}',
      backgroundColor: '#1890ff',
      position: function(point, params, dom, rect, size) {
        return [point[0], '10%'];
      },
      axisPointer: {
        lineStyle: {
          color: '#D2CCCC',
        },
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#5E5E5E',
      },
      data: xData,
      // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#5E5E5E',
      },
      splitLine: {
        lineStyle: {
          color: '#C2C0C0',
          type: 'dashed',
        },
      },
      // show: false
    },
    series: [
      {
        name: 'A',
        type: 'line',
        smooth: true,
        data: yData,
        // data: [1800, 360, 65, 30, 780, 40, 33]
      } /*, {
      name: 'B',
      type: 'line',
      smooth: true,
      data: [12, 50, 51, 35, 70, 30, 20]
    }, {
      name: 'C',
      type: 'line',
      smooth: true,
      data: [10, 30, 31, 50, 40, 20, 10]
    }*/,
    ],
  };

  return this.option;
}
