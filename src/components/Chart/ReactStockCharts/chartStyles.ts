import {colors} from '../../styled';

export const getChartSettings = (fullScreenMode: boolean) => ({
  margin: {
    left: 0,
    right: fullScreenMode ? 70 : 55,
    top: fullScreenMode ? 30 : 15,
    bottom: fullScreenMode ? 60 : 45
  },
  padding: {
    top: 10,
    bottom: 20
  },
  showGrid: true,
  ticks: 10
});

export const getExternalIndicatorSettings = (fullScreenMode: boolean) => ({
  height: fullScreenMode ? 200 : 120,
  ticks: 3
});

export const macdStyles = {
  macdAppearance: {
    width: 3,
    stroke: {
      macd: '#3FB2FF',
      signal: '#FF6720'
    },
    fill: {
      divergence: colors.whiteText
    }
  },
  labelColor: colors.coolGrey
};

export const movingAveragesStyles = {
  sma: {stroke: '#0285E3'},
  wma: {stroke: '#DB272F'},
  tma: {stroke: '#2A9E39'},
  ema: {stroke: '#2B4BFF'},
  smaVolume: {stroke: '#4682B4', fill: '#4682B4'},
  textColor: colors.whiteText,
  labelColor: colors.coolGrey
};

export const yGridCalc = (width: number, fullScreenMode: boolean) => ({
  axisAt: 'right',
  orient: 'right',
  innerTickSize: -1 * width,
  stroke: colors.coolGrey,
  tickStroke: colors.coolGrey,
  tickStrokeDasharray: 'Solid',
  tickStrokeOpacity: 0.1,
  tickStrokeWidth: 1,
  fontSize: fullScreenMode ? 14 : 10
});

export const xGridCalc = (height: number, fullScreenMode: boolean) => ({
  axisAt: 'bottom',
  orient: 'bottom',
  innerTickSize: -1 * height,
  stroke: colors.coolGrey,
  tickStroke: colors.coolGrey,
  tickStrokeDasharray: 'Solid',
  tickStrokeOpacity: 0.2,
  tickStrokeWidth: 1,
  fontSize: fullScreenMode ? 14 : 11
});
