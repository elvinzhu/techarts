import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import LineChart from '../../components/LineChart';

import './index.less';

export default class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
  };

  state = {
    xData: ['4/1', '4/2', '4/3', '4/4', '4/5', '4/6', '4/7'],
    yData: ['2', '50', '20', '40', '60', '5', '6'],
  };

  render() {
    const { xData, yData } = this.state;
    return (
      <View className="page-index">
        <View className="line-chart">
          {xData.length > 0 && <LineChart xData={xData} yData={yData} />}
        </View>
      </View>
    );
  }
}
