import {chartPalette} from '../components/styled';

export const LINESTYLE_DOTTED = 1;
export const LINESTYLE_DASHED = 2;
export const LINESTYLE_SOLID = 0;
export const LINESTYLE_LARGE_DASHED = 3;

export const overrides = {
  'paneProperties.background': '#333333',
  'paneProperties.vertGridProperties.color': 'rgba(140, 148, 160, 0.6)',
  'paneProperties.vertGridProperties.style': LINESTYLE_DOTTED,
  'paneProperties.horzGridProperties.color': 'rgba(140, 148, 160, 0.6)',
  'paneProperties.horzGridProperties.style': LINESTYLE_DASHED,
  'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',

  'scalesProperties.textColor': 'rgb(140, 148, 160)',

  'mainSeriesProperties.candleStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.candleStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.candleStyle.drawWick': true,
  'mainSeriesProperties.candleStyle.drawBorder': true,
  'mainSeriesProperties.candleStyle.wickUpColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.candleStyle.wickDownColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,

  'mainSeriesProperties.hollowCandleStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.hollowCandleStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.hollowCandleStyle.drawWick': true,
  'mainSeriesProperties.hollowCandleStyle.drawBorder': false,
  'mainSeriesProperties.hollowCandleStyle.borderColor':
    'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.hollowCandleStyle.borderUpColor': chartPalette.candleUp,
  'mainSeriesProperties.hollowCandleStyle.borderDownColor':
    chartPalette.candleDown,
  'mainSeriesProperties.hollowCandleStyle.wickColor':
    'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.hollowCandleStyle.wickUpColor':
    'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.hollowCandleStyle.wickDownColor':
    'rgba(140, 148, 160, 0.4)',

  'mainSeriesProperties.haStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.haStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.haStyle.drawWick': true,
  'mainSeriesProperties.haStyle.drawBorder': false,
  'mainSeriesProperties.haStyle.borderColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.haStyle.borderUpColor': chartPalette.candleUp,
  'mainSeriesProperties.haStyle.borderDownColor': chartPalette.candleDown,
  'mainSeriesProperties.haStyle.wickColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.haStyle.wickUpColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.haStyle.wickDownColor': 'rgba(140, 148, 160, 0.4)',
  'mainSeriesProperties.haStyle.showRealLastPrice': false,
  'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,

  'mainSeriesProperties.barStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.barStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
  'mainSeriesProperties.barStyle.dontDrawOpen': false,

  'mainSeriesProperties.lineStyle.color': 'rgba( 60, 120, 216, 1)',
  'mainSeriesProperties.lineStyle.linestyle': LINESTYLE_SOLID,
  'mainSeriesProperties.lineStyle.linewidth': 1,
  'mainSeriesProperties.lineStyle.priceSource': 'close',
  'mainSeriesProperties.lineStyle.styleType': 2,

  'mainSeriesProperties.areaStyle.color1': 'rgba( 96, 96, 144, 0.5)',
  'mainSeriesProperties.areaStyle.color2': 'rgba( 1, 246, 245, 0.5)',
  'mainSeriesProperties.areaStyle.linecolor': 'rgba( 0, 148, 255, 1)',
  'mainSeriesProperties.areaStyle.linestyle': LINESTYLE_SOLID,
  'mainSeriesProperties.areaStyle.linewidth': 1,
  'mainSeriesProperties.areaStyle.priceSource': 'close',
  'mainSeriesProperties.areaStyle.transparency': 50,

  'mainSeriesProperties.priceAxisProperties.autoScale': true,
  'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
  'mainSeriesProperties.priceAxisProperties.percentage': false,
  'mainSeriesProperties.priceAxisProperties.percentageDisabled': true,
  'mainSeriesProperties.priceAxisProperties.log': false,
  'mainSeriesProperties.priceAxisProperties.logDisabled': true,

  'mainSeriesProperties.renkoStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.renkoStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.renkoStyle.borderUpColor': chartPalette.candleUp,
  'mainSeriesProperties.renkoStyle.borderDownColor': chartPalette.candleDown,
  'mainSeriesProperties.renkoStyle.upColorProjection': 'rgba( 74, 214, 190, 1)',
  'mainSeriesProperties.renkoStyle.downColorProjection':
    'rgba( 214, 73, 207, 1)',
  'mainSeriesProperties.renkoStyle.borderUpColorProjection':
    'rgba( 34, 84, 55, 1)',
  'mainSeriesProperties.renkoStyle.borderDownColorProjection':
    'rgba( 91, 26, 19, 1)',
  'mainSeriesProperties.renkoStyle.inputs.source': 'close',
  'mainSeriesProperties.renkoStyle.inputs.boxSize': 3,
  'mainSeriesProperties.renkoStyle.inputs.style': 'ATR',
  'mainSeriesProperties.renkoStyle.inputs.atrLength': 14,
  'mainSeriesProperties.renkoStyle.inputInfo.source.name': 'Source',
  'mainSeriesProperties.renkoStyle.inputInfo.boxSize.name': 'Box size',
  'mainSeriesProperties.renkoStyle.inputInfo.style.name': 'Style',
  'mainSeriesProperties.renkoStyle.inputInfo.atrLength.name': 'ATR Length',

  'mainSeriesProperties.pbStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.pbStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.pbStyle.borderUpColor': chartPalette.candleUp,
  'mainSeriesProperties.pbStyle.borderDownColor': chartPalette.candleDown,
  'mainSeriesProperties.pbStyle.upColorProjection': 'rgba( 74, 214, 190, 1)',
  'mainSeriesProperties.pbStyle.downColorProjection': 'rgba( 214, 73, 207, 1)',
  'mainSeriesProperties.pbStyle.borderUpColorProjection':
    'rgba( 34, 84, 55, 1)',
  'mainSeriesProperties.pbStyle.borderDownColorProjection':
    'rgba( 91, 26, 19, 1)',
  'mainSeriesProperties.pbStyle.inputs.source': 'close',
  'mainSeriesProperties.pbStyle.inputs.lb': 3,
  'mainSeriesProperties.pbStyle.inputInfo.source.name': 'Source',
  'mainSeriesProperties.pbStyle.inputInfo.lb.name': 'Number of line',

  'mainSeriesProperties.kagiStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.kagiStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.kagiStyle.upColorProjection': 'rgba( 74, 214, 190, 1)',
  'mainSeriesProperties.kagiStyle.downColorProjection':
    'rgba( 214, 73, 207, 1)',
  'mainSeriesProperties.kagiStyle.inputs.source': 'close',
  'mainSeriesProperties.kagiStyle.inputs.style': 'ATR',
  'mainSeriesProperties.kagiStyle.inputs.atrLength': 14,
  'mainSeriesProperties.kagiStyle.inputs.reversalAmount': 1,
  'mainSeriesProperties.kagiStyle.inputInfo.source.name': 'Source',
  'mainSeriesProperties.kagiStyle.inputInfo.style.name': 'Style',
  'mainSeriesProperties.kagiStyle.inputInfo.atrLength.name': 'ATR Length',
  'mainSeriesProperties.kagiStyle.inputInfo.reversalAmount.name':
    'Reversal amount',

  'mainSeriesProperties.pnfStyle.upColor': chartPalette.candleUp,
  'mainSeriesProperties.pnfStyle.downColor': chartPalette.candleDown,
  'mainSeriesProperties.pnfStyle.upColorProjection': 'rgba( 74, 214, 190, 1)',
  'mainSeriesProperties.pnfStyle.downColorProjection': 'rgba( 214, 73, 207, 1)',
  'mainSeriesProperties.pnfStyle.inputs.sources': 'HL',
  'mainSeriesProperties.pnfStyle.inputs.reversalAmount': 3,
  'mainSeriesProperties.pnfStyle.inputs.boxSize': 1,
  'mainSeriesProperties.pnfStyle.inputs.style': 'ATR',
  'mainSeriesProperties.pnfStyle.inputs.atrLength': 14,
  'mainSeriesProperties.pnfStyle.inputInfo.sources.name': 'Source',
  'mainSeriesProperties.pnfStyle.inputInfo.boxSize.name': 'Box size',
  'mainSeriesProperties.pnfStyle.inputInfo.reversalAmount.name':
    'Reversal amount',
  'mainSeriesProperties.pnfStyle.inputInfo.style.name': 'Style',
  'mainSeriesProperties.pnfStyle.inputInfo.atrLength.name': 'ATR Length',

  'timeScale.rightOffset': 5,
  timezone: 'Etc/UTC'
};

export const studiesOverrides = {
  'volume.volume.color.0': chartPalette.volumeDown,
  'volume.volume.color.1': chartPalette.volumeUp,
  'volume.volume.transparency': 65,
  'volume.volume ma.color': '#0496FF',
  'volume.volume ma.transparency': 60,
  'volume.volume ma.linewidth': 1,
  'volume.show ma': false,

  'macd.fastLength': 12,
  'macd.slowLength': 26,
  'macd.source': 'close',
  'macd.signalLength': 9,
  'macd.histogram.color': 'rgba(255, 255, 255, 0.65)',
  'macd.histogram.linewidth': 2,
  'macd.histogram.linestyle': LINESTYLE_SOLID,
  'macd.histogram.trackPrice': false,
  'macd.macd.color': 'rgba(255, 255, 0, 0.65)',
  'macd.macd.linewidth': 1,
  'macd.macd.linestyle': LINESTYLE_SOLID,
  'macd.macd.trackPrice': false,
  'macd.signal.color': 'rgba(0, 255, 255, 0.65)',
  'macd.signal.linewidth': 1,
  'macd.signal.linestyle': LINESTYLE_SOLID,
  'macd.signal.trackPrice': false
};

export const defaultStudies = [
  {
    name: 'MACD',
    forceOverlay: false,
    lock: false,
    inputs: [12, 26, 'close', 9]
  }
];
