const Taro = require(process.env.TARO_ENV === 'h5' ? '@tarojs/taro-h5' : '@tarojs/taro');

module.exports = Taro;
