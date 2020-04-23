import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import EChart from '../../components/EChart/index';
import * as echarts from './echarts';

import './index.less';

const xData = ['4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7'];
const yData = ['2', '50', '20', '40', '60', '5', '6'];

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xData,
      yData,
      option: getOption(xData, yData),
    };
  }

  config = {
    navigationBarTitleText: '首页',
  };

  setChartRef = node => {
    this.chart = node;
  };

  componentDidMount() {
    this.manualSetOption();
  }

  render() {
    const { option } = this.state;
    return (
      <View className="page-index">
        <View className="line-chart">
          {/* 通过 option 设置数据 */}
          <EChart echarts={echarts} option={option} />
        </View>
        <View className="line-chart">
          {/* 通过组件实例设置数据 */}
          <EChart ref={this.setChartRef} echarts={echarts} />
        </View>
        <View className="line-chart">
          {/* 通过组件实例设置数据 */}
          <EChart echarts={echarts} option={option} onInit={this.onInit} />
        </View>
      </View>
    );
  }

  manualSetOption() {
    const newX = [...xData];
    const newY = [...yData];
    const date = new Date(2020, 3, 7);
    setInterval(() => {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      newX.shift();
      newX.push(`${newDate.getMonth() + 1}/${newDate.getDate()}`);
      newY.shift();
      newY.push((100 * Math.random()).toFixed(2));
      this.chart.setOption(getOption(newX, newY));
    }, 1000);
  }

  onInit = (canvas, width, height, dpr) => {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr, // new
    });
    canvas.setChart(chart);
    chart.setOption(this.state.option);
    // this.chart = chart;
    return chart; // 必须return
  };
}

function getOption(xData, yData) {
  return {
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
}
