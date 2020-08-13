import Taro from '@tarojs/taro';
import React, { Component, CSSProperties } from 'react';
import { Canvas } from '@tarojs/components';
import WxCanvas from './wx-canvas';

export type TCallback = (canvas: any, width: number, height: number, dpr: number) => {}
export interface IEChartProps {
  /**
   * echarts对象. 推荐官网自定义构建echarts对象.
   */
  echarts: {},
  /**
   * 图表配置. 结构同echarts参数.
   */
  option: {},
  /**
   * 小程序canvasId. 默认自动生成.
   */
  canvasId?: string;
  /**
   * 禁用图表手势操作.
   */
  disableTouch?: boolean,
  style?: CSSProperties,
  /**
   * 懒实例化。当需要自定义实例化的时候，请传递 true.
   */
  lazyLoad?: boolean,
  /**
   * 使用此函数自定义初始化.
   */
  onInit?: TCallback,
  forceUseOldCanvas?: boolean
}

export default class EChart extends Component<IEChartProps, { isUseNewCanvas: boolean }> {

  private static INSTANCE_COUNTER = 0;
  private echarts: any;
  private chart: any;
  private canvasId: string;
  private ctx: Taro.CanvasContext;

  public constructor(props) {
    super(props);
    this.echarts = props.echarts;
    this.chart = null; // echarts instance
    this.canvasId = '__techarts__' + EChart.INSTANCE_COUNTER++;
    this.state = {
      isUseNewCanvas: false,
    };
  }

  componentDidUpdate(prevProps: IEChartProps) {
    if (this.props.option !== prevProps.option) {
      this.setOption(this.props.option);
    }
  }

  componentDidMount() {
    const { lazyLoad } = this.props;
    if (!lazyLoad) {
      if (process.env.TARO_ENV === 'weapp') {
        Taro.nextTick(() => {
          setTimeout(() => {
            this.init();
          }, 0);
        });
      } else {
        const router = Taro.getCurrentInstance().router;
        router && Taro.eventCenter.once(router.onReady, () => {
          setTimeout(() => {
            this.init();
          }, 0);
        });
      }
    }
  }

  render() {
    const { disableTouch, style } = this.props;
    const canvasId = this.getCanvasId();
    return <Canvas id={canvasId} canvasId={canvasId} type="2d"
      className="techarts-canvas"
      style={{ width: '100%', height: '100%', display: 'inline-block', ...style }}
      onTouchStart={disableTouch ? undefined : this._touchStart}
      onTouchMove={disableTouch ? undefined : this._touchMove}
      onTouchEnd={disableTouch ? undefined : this._touchEnd}>
    </Canvas>;
  }

  setOption(option: {}) {
    if (this.chart && option) {
      this.chart.setOption(option);
    }
  }

  getCanvasId() {
    return this.props.canvasId || this.canvasId;
  }

  init(callback?: TCallback) {
    if (!this.echarts) {
      console.error('[EChart]：组件需要echarts对象才能绘图，建议去官网自定义构建。'
        + '注意不要勾选“代码压缩”，可下载后自行压缩。https://www.echartsjs.com/zh/builder.html');
      return;
    }

    if (process.env.TARO_ENV === 'h5') {
      const elCanvas = window.document.getElementById(this.getCanvasId());
      if (elCanvas) {
        const style = window.getComputedStyle(elCanvas);
        this._invokeCallback(elCanvas, parseInt(style.width), parseInt(style.height), window.devicePixelRatio, callback);
      }
    } else {
      const version = Taro.getSystemInfoSync().SDKVersion;
      const canUseNewCanvas = compareVersion(version, '2.9.0') >= 0;
      const forceUseOldCanvas = this.props.forceUseOldCanvas;
      const isUseNewCanvas = canUseNewCanvas && !forceUseOldCanvas;
      this.setState({ isUseNewCanvas });

      if (forceUseOldCanvas && canUseNewCanvas) {
        console.warn('开发者强制使用旧canvas,建议关闭');
      }

      if (isUseNewCanvas) {
        // console.log('微信基础库版本大于2.9.0，开始使用<canvas type="2d"/>');
        // 2.9.0 可以使用 <canvas type="2d"></canvas>
        this._initByNewWay(callback);
      } else {
        const isValid = compareVersion(version, '1.9.91') >= 0;
        if (!isValid) {
          console.error('微信基础库版本过低，需大于等于 1.9.91。'
            + '参见：https://github.com/ecomfe/echarts-for-weixin'
            + '#%E5%BE%AE%E4%BF%A1%E7%89%88%E6%9C%AC%E8%A6%81%E6%B1%82');
        } else {
          console.warn('建议将微信基础库调整大于等于2.9.0版本。升级后绘图将有更好性能');
          this._initByOldWay(callback);
        }
      }
    }
  };

  private _invokeCallback(canvas: any, canvasWidth: number, canvasHeight: number, canvasDpr: number, callback?: TCallback) {
    if (typeof callback === 'function') {
      this.chart = callback(canvas, canvasWidth, canvasHeight, canvasDpr);
    } else {
      this.chart = this._initChart(canvas, canvasWidth, canvasHeight, canvasDpr);
    }
  }

  private _selectCanvas(): Taro.NodesRef {
    const query = Taro.createSelectorQuery();
    return query.select(`#${this.getCanvasId()}`)
  }

  private _initByOldWay(callback?: TCallback) {
    if (process.env.TARO_ENV !== 'h5') {
      // 1.9.91 <= version < 2.9.0：原来的方式初始化
      const canvasId = this.getCanvasId();
      const ctx = Taro.createCanvasContext(canvasId, this);
      this.ctx = ctx;
      const canvas = new WxCanvas(ctx, false);

      this.echarts.setCanvasCreator(() => {
        return canvas;
      });
      // const canvasDpr = Taro.getSystemInfoSync().pixelRatio // 微信旧的canvas不能传入dpr
      const canvasDpr = 1;
      this._selectCanvas()
        .boundingClientRect((res) => {
          this._invokeCallback(canvas, res.width, res.height, canvasDpr, callback);
        })
        .exec();
    }
  }

  private _initByNewWay(callback?: TCallback) {
    if (process.env.TARO_ENV !== 'h5') {
      // version >= 2.9.0：使用新的方式初始化
      this._selectCanvas()
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvasNode = res[0].node;
          const canvasDpr = Taro.getSystemInfoSync().pixelRatio;
          const canvasWidth = res[0].width;
          const canvasHeight = res[0].height;

          const ctx = canvasNode.getContext('2d');

          const canvas = new WxCanvas(ctx, true, canvasNode);
          this.echarts.setCanvasCreator(() => {
            return canvas;
          });
          this._invokeCallback(canvas, canvasWidth, canvasHeight, canvasDpr, callback);
        });
    }
  }

  canvasToTempFilePath(option: Partial<Taro.canvasToTempFilePath.Option>) {
    option = option || {};
    if (!option.canvasId) {
      option.canvasId = this.getCanvasId();
    }
    if (process.env.TARO_ENV === 'h5') {
      canvasToTempFilePath(option as Taro.canvasToTempFilePath.Option);
      // Taro.canvasToTempFilePath(option as Taro.canvasToTempFilePath.Option);
    } else {
      if (this.state.isUseNewCanvas) {
        // 新版
        this._selectCanvas()
          .fields({ node: true, size: true })
          .exec((res) => {
            const canvasNode = res[0].node;
            option.canvas = canvasNode;
            Taro.canvasToTempFilePath(option as Taro.canvasToTempFilePath.Option);
          });
      } else {
        // 旧的
        this.ctx.draw(true, () => {
          Taro.canvasToTempFilePath(option as Taro.canvasToTempFilePath.Option);
        });
      }
    }
  }

  private _touchStart = (e) => {
    if (this.chart && e.touches.length > 0) {
      var touch = e.touches[0];
      var handler = this.chart.getZr().handler;
      handler.dispatch('mousedown', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'start');
    }
  };

  private _touchMove = (e) => {
    if (this.chart && e.touches.length > 0) {
      var touch = e.touches[0];
      var handler = this.chart.getZr().handler;
      handler.dispatch('mousemove', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'change');
    }
  };

  private _touchEnd = (e) => {
    if (this.chart) {
      const touch = e.changedTouches ? e.changedTouches[0] : {};
      var handler = this.chart.getZr().handler;
      handler.dispatch('mouseup', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.dispatch('click', {
        zrX: touch.x,
        zrY: touch.y,
      });
      handler.processGesture(wrapTouch(e), 'end');
    }
  };

  private _initChart(canvas: WxCanvas, width: number, height: number, dpr: number) {
    const { onInit } = this.props;
    if (typeof onInit === 'function') {
      this.chart = onInit(canvas, width, height, dpr);
    } else {
      this.chart = this.echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr, // new
      });
    }
    if (canvas.setChart) {
      canvas.setChart(this.chart);
    }
    if (this.props.option) {
      this.chart.setOption(this.props.option);
    }
    return this.chart;
  }
}

function compareVersion(v1: string, v2: string) {
  const v1Arr = v1.split('.');
  const v2Arr = v2.split('.');
  const len = Math.max(v1Arr.length, v2Arr.length);

  while (v1Arr.length < len) {
    v1Arr.push('0');
  }
  while (v2Arr.length < len) {
    v2Arr.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1Arr[i]);
    const num2 = parseInt(v2Arr[i]);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

function wrapTouch(event) {
  for (let i = 0; i < event.touches.length; ++i) {
    const touch = event.touches[i];
    touch.offsetX = touch.x;
    touch.offsetY = touch.y;
  }
  return event;
}

function canvasToTempFilePath({ canvasId, fileType, quality, success, fail, complete }: Taro.canvasToTempFilePath.Option) {
  try {
    const canvas = (document.getElementById(canvasId) as HTMLElement).querySelector('canvas') as HTMLCanvasElement;
    const dataURL = canvas.toDataURL(`image/${fileType || 'png'}`, quality);
    const res = {
      tempFilePath: dataURL,
      errMsg: 'canvasToTempFilePath:ok',
    };
    success && success(res);
    complete && complete(res);
    return Promise.resolve(res);
  } catch (e) {
    const res = {
      errMsg: e.message,
    };
    fail && fail(res);
    complete && complete(res);
    return Promise.reject(res);
  }
}
