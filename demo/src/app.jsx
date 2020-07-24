import React, { Component } from 'react';

import './app.less';

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return this.props.children;
  }
}

export default App;
