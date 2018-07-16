import {chartPalette} from '../components/styled';

export const CHART_DEFAULT_SETTINGS = {
  charts: [
    {
      panes: [
        {
          sources: [
            {
              type: 'MainSeries',
              id: 'HqiNpS',
              state: {
                style: 1,
                esdShowDividends: true,
                esdShowSplits: true,
                esdShowEarnings: true,
                esdShowBreaks: false,
                esdBreaksStyle: {
                  color: 'rgba( 226, 116, 91, 1)',
                  style: 2,
                  width: 1
                },
                esdFlagSize: 2,
                showCountdown: false,
                showInDataWindow: true,
                visible: true,
                silentIntervalChange: false,
                showPriceLine: true,
                priceLineWidth: 1,
                lockScale: false,
                minTick: 'default',
                extendedHours: false,
                sessVis: false,
                statusViewStyle: {
                  fontSize: 17,
                  showExchange: true,
                  showInterval: true,
                  showSymbolAsDescription: false
                },
                candleStyle: {
                  upColor: chartPalette.candleUp,
                  downColor: chartPalette.candleDown,
                  drawWick: true,
                  drawBorder: false,
                  borderColor: 'rgba(140, 148, 160, 0.4)',
                  borderUpColor: chartPalette.candleUp,
                  borderDownColor: chartPalette.candleDown,
                  wickColor: 'rgba(140, 148, 160, 0.4)',
                  wickUpColor: 'rgba(140, 148, 160, 0.4)',
                  wickDownColor: 'rgba(140, 148, 160, 0.4)',
                  barColorsOnPrevClose: false
                },
                hollowCandleStyle: {
                  upColor: chartPalette.candleUp,
                  downColor: chartPalette.candleDown,
                  drawWick: true,
                  drawBorder: false,
                  borderColor: 'rgba(140, 148, 160, 0.4)',
                  borderUpColor: chartPalette.candleUp,
                  borderDownColor: chartPalette.candleDown,
                  wickColor: 'rgba(140, 148, 160, 0.4)',
                  wickUpColor: 'rgba(140, 148, 160, 0.4)',
                  wickDownColor: 'rgba(140, 148, 160, 0.4)'
                },
                haStyle: {
                  upColor: chartPalette.candleUp,
                  downColor: chartPalette.candleDown,
                  drawWick: true,
                  drawBorder: false,
                  borderColor: 'rgba(140, 148, 160, 0.4)',
                  borderUpColor: chartPalette.candleUp,
                  borderDownColor: chartPalette.candleDown,
                  wickColor: 'rgba(140, 148, 160, 0.4)',
                  wickUpColor: 'rgba(140, 148, 160, 0.4)',
                  wickDownColor: 'rgba(140, 148, 160, 0.4)',
                  showRealLastPrice: false,
                  barColorsOnPrevClose: false
                },
                barStyle: {
                  upColor: chartPalette.candleUp,
                  downColor: chartPalette.candleDown,
                  barColorsOnPrevClose: false,
                  dontDrawOpen: false
                },
                lineStyle: {
                  color: 'rgba( 60, 120, 216, 1)',
                  linestyle: 0,
                  linewidth: 1,
                  priceSource: 'close',
                  styleType: 2
                },
                areaStyle: {
                  color1: 'rgba( 96, 96, 144, 0.5)',
                  color2: 'rgba( 1, 246, 245, 0.5)',
                  linecolor: 'rgba( 0, 148, 255, 1)',
                  linestyle: 0,
                  linewidth: 1,
                  priceSource: 'close',
                  transparency: 50
                },
                priceAxisProperties: {
                  autoScale: true,
                  autoScaleDisabled: false,
                  percentage: false,
                  percentageDisabled: false,
                  log: false,
                  logDisabled: false,
                  alignLabels: true
                },
                renkoStyle: {
                  upColor: 'rgba( 107, 165, 131, 1)',
                  downColor: 'rgba( 215, 84, 66, 1)',
                  borderUpColor: chartPalette.candleUp,
                  borderDownColor: chartPalette.candleDown,
                  upColorProjection: 'rgba( 74, 214, 190, 1)',
                  downColorProjection: 'rgba( 214, 73, 207, 1)',
                  borderUpColorProjection: 'rgba( 34, 84, 55, 1)',
                  borderDownColorProjection: 'rgba( 91, 26, 19, 1)',
                  inputs: {
                    source: 'close',
                    boxSize: 3,
                    style: 'ATR',
                    atrLength: 14
                  },
                  inputInfo: {
                    source: {name: 'Source'},
                    boxSize: {name: 'Box size'},
                    style: {name: 'Style'},
                    atrLength: {name: 'ATR Length'}
                  }
                },
                pbStyle: {
                  upColor: 'rgba( 107, 165, 131, 1)',
                  downColor: 'rgba( 215, 84, 66, 1)',
                  borderUpColor: chartPalette.candleUp,
                  borderDownColor: chartPalette.candleDown,
                  upColorProjection: 'rgba( 74, 214, 190, 1)',
                  downColorProjection: 'rgba( 214, 73, 207, 1)',
                  borderUpColorProjection: 'rgba( 34, 84, 55, 1)',
                  borderDownColorProjection: 'rgba( 91, 26, 19, 1)',
                  inputs: {source: 'close', lb: 3},
                  inputInfo: {
                    source: {name: 'Source'},
                    lb: {name: 'Number of line'}
                  }
                },
                kagiStyle: {
                  upColor: 'rgba( 107, 165, 131, 1)',
                  downColor: 'rgba( 215, 84, 66, 1)',
                  upColorProjection: 'rgba( 74, 214, 190, 1)',
                  downColorProjection: 'rgba( 214, 73, 207, 1)',
                  inputs: {
                    source: 'close',
                    style: 'ATR',
                    atrLength: 14,
                    reversalAmount: 1
                  },
                  inputInfo: {
                    source: {name: 'Source'},
                    style: {name: 'Style'},
                    atrLength: {name: 'ATR Length'},
                    reversalAmount: {name: 'Reversal amount'}
                  }
                },
                pnfStyle: {
                  upColor: 'rgba( 107, 165, 131, 1)',
                  downColor: 'rgba( 215, 84, 66, 1)',
                  upColorProjection: 'rgba( 74, 214, 190, 1)',
                  downColorProjection: 'rgba( 214, 73, 207, 1)',
                  inputs: {
                    sources: 'HL',
                    reversalAmount: 3,
                    boxSize: 1,
                    style: 'ATR',
                    atrLength: 14
                  },
                  inputInfo: {
                    sources: {name: 'Source'},
                    boxSize: {name: 'Box size'},
                    reversalAmount: {name: 'Reversal amount'},
                    style: {name: 'Style'},
                    atrLength: {name: 'ATR Length'}
                  }
                },
                symbol: 'BTC/CHF',
                shortName: 'BTC/CHF',
                timeframe: '',
                onWidget: false,
                interval: '1D',
                showSessions: false
              },
              zorder: -1
            },
            {
              type: 'Study',
              id: 'OWt7As',
              state: {
                styles: {
                  vol: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 5,
                    trackPrice: false,
                    transparency: 65,
                    visible: true,
                    color: '#000080',
                    histogramBase: 0,
                    joinPoints: false,
                    title: 'Volume'
                  },
                  vol_ma: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 4,
                    trackPrice: false,
                    transparency: 65,
                    visible: true,
                    color: '#0496FF',
                    histogramBase: 0,
                    joinPoints: false,
                    title: 'Volume MA'
                  }
                },
                precision: 'default',
                palettes: {
                  volumePalette: {
                    colors: {
                      '0': {
                        color: chartPalette.volumeDown,
                        width: 1,
                        style: 0,
                        name: 'Color 0'
                      },
                      '1': {
                        color: chartPalette.volumeUp,
                        width: 1,
                        style: 0,
                        name: 'Color 1'
                      }
                    }
                  }
                },
                inputs: {
                  '0': {
                    id: 'showMA',
                    name: 'show MA',
                    defval: false,
                    type: 'bool'
                  },
                  '1': {
                    id: 'maLength',
                    name: 'MA Length',
                    defval: 20,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  },
                  showMA: false,
                  maLength: 20
                },
                bands: {},
                area: {},
                graphics: {},
                showInDataWindow: true,
                visible: true,
                showStudyArguments: true,
                paneSize: 'large',
                plots: {
                  '0': {id: 'vol', type: 'line'},
                  '1': {
                    id: 'volumePalette',
                    palette: 'volumePalette',
                    target: 'vol',
                    type: 'colorer'
                  },
                  '2': {id: 'vol_ma', type: 'line'}
                },
                _metainfoVersion: 15,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                transparency: 65,
                description: 'Volume',
                shortDescription: 'Volume',
                is_price_study: false,
                id: 'Volume@tv-basicstudies',
                description_localized: 'Volume',
                shortId: 'Volume',
                packageId: 'tv-basicstudies',
                version: '1',
                fullId: 'Volume@tv-basicstudies-1',
                productId: 'tv-basicstudies',
                name: 'Volume@tv-basicstudies'
              },
              zorder: -2,
              metaInfo: {
                palettes: {
                  volumePalette: {
                    colors: {'0': {name: 'Color 0'}, '1': {name: 'Color 1'}}
                  }
                },
                inputs: [
                  {id: 'showMA', name: 'show MA', defval: false, type: 'bool'},
                  {
                    id: 'maLength',
                    name: 'MA Length',
                    defval: 20,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  }
                ],
                plots: [
                  {id: 'vol', type: 'line'},
                  {
                    id: 'volumePalette',
                    palette: 'volumePalette',
                    target: 'vol',
                    type: 'colorer'
                  },
                  {id: 'vol_ma', type: 'line'}
                ],
                graphics: {},
                defaults: {
                  styles: {
                    vol: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 5,
                      trackPrice: false,
                      transparency: 65,
                      visible: true,
                      color: '#000080'
                    },
                    vol_ma: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 4,
                      trackPrice: false,
                      transparency: 65,
                      visible: true,
                      color: '#0496FF'
                    }
                  },
                  precision: 0,
                  palettes: {
                    volumePalette: {
                      colors: {
                        '0': {
                          color: chartPalette.volumeDown,
                          width: 1,
                          style: 0
                        },
                        '1': {color: chartPalette.volumeUp, width: 1, style: 0}
                      }
                    }
                  },
                  inputs: {showMA: false, maLength: 20}
                },
                _metainfoVersion: 15,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                transparency: 65,
                styles: {
                  vol: {title: 'Volume', histogramBase: 0},
                  vol_ma: {title: 'Volume MA', histogramBase: 0}
                },
                description: 'Volume',
                shortDescription: 'Volume',
                is_price_study: false,
                id: 'Volume@tv-basicstudies-1',
                description_localized: 'Volume',
                shortId: 'Volume',
                packageId: 'tv-basicstudies',
                version: '1',
                fullId: 'Volume@tv-basicstudies-1',
                productId: 'tv-basicstudies',
                name: 'Volume@tv-basicstudies'
              }
            }
          ],
          leftAxisState: {
            m_priceRange: {m_maxValue: 0.5, m_minValue: -0.5},
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_height: 310,
            m_topMargin: 0.15,
            m_bottomMargin: 0.1
          },
          leftAxisSources: [],
          rightAxisState: {
            m_priceRange: {m_maxValue: 19193.661, m_minValue: 4699.116},
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_height: 310,
            m_topMargin: 0.15,
            m_bottomMargin: 0.1
          },
          rightAxisSources: ['HqiNpS'],
          overlayPriceScales: {
            OWt7As: {
              m_priceRange: {m_maxValue: 16382.64, m_minValue: 0},
              m_isAutoScale: true,
              m_isPercentage: false,
              m_isLog: false,
              m_height: 310,
              m_topMargin: 0.75,
              m_bottomMargin: 0
            }
          },
          stretchFactor: 2394.6188340807175,
          mainSourceId: 'HqiNpS'
        },
        {
          sources: [
            {
              type: 'Study',
              id: 'MFfupT',
              state: {
                styles: {
                  plot_0: {
                    linestyle: 0,
                    linewidth: 2,
                    plottype: 1,
                    trackPrice: false,
                    transparency: 35,
                    visible: true,
                    color: 'rgba(255, 255, 255, 0.65)',
                    histogramBase: 0,
                    joinPoints: false,
                    title: 'Histogram'
                  },
                  plot_1: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: false,
                    transparency: 35,
                    visible: true,
                    color: 'rgba(255, 255, 0, 0.65)',
                    histogramBase: 0,
                    joinPoints: false,
                    title: 'MACD'
                  },
                  plot_2: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: false,
                    transparency: 35,
                    visible: true,
                    color: 'rgba(0, 255, 255, 0.65)',
                    histogramBase: 0,
                    joinPoints: false,
                    title: 'Signal'
                  }
                },
                precision: 'default',
                inputs: {
                  '0': {
                    id: 'in_0',
                    name: 'fastLength',
                    defval: 12,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  },
                  '1': {
                    id: 'in_1',
                    name: 'slowLength',
                    defval: 26,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  },
                  '2': {
                    id: 'in_3',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: {
                      '0': 'open',
                      '1': 'high',
                      '2': 'low',
                      '3': 'close',
                      '4': 'hl2',
                      '5': 'hlc3',
                      '6': 'ohlc4'
                    }
                  },
                  '3': {
                    id: 'in_2',
                    name: 'signalLength',
                    defval: 9,
                    type: 'integer',
                    min: 1,
                    max: 50
                  },
                  in_0: 12,
                  in_1: 26,
                  in_3: 'close',
                  in_2: 9
                },
                palettes: {},
                bands: {},
                area: {},
                graphics: {},
                showInDataWindow: true,
                visible: true,
                showStudyArguments: true,
                plots: {
                  '0': {id: 'plot_0', type: 'line'},
                  '1': {id: 'plot_1', type: 'line'},
                  '2': {id: 'plot_2', type: 'line'}
                },
                _metainfoVersion: 27,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                description: 'MACD',
                shortDescription: 'MACD',
                is_price_study: false,
                id: 'Moving Average Convergence/Divergence@tv-basicstudies',
                scriptIdPart: '',
                name: 'Moving Average Convergence/Divergence@tv-basicstudies',
                description_localized: 'MACD',
                shortId: 'Moving Average Convergence/Divergence',
                packageId: 'tv-basicstudies',
                version: '1',
                fullId:
                  'Moving Average Convergence/Divergence@tv-basicstudies-1',
                productId: 'tv-basicstudies'
              },
              zorder: -1,
              metaInfo: {
                palettes: {},
                inputs: [
                  {
                    id: 'in_0',
                    name: 'fastLength',
                    defval: 12,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  },
                  {
                    id: 'in_1',
                    name: 'slowLength',
                    defval: 26,
                    type: 'integer',
                    min: 1,
                    max: 2000
                  },
                  {
                    id: 'in_3',
                    name: 'Source',
                    defval: 'close',
                    type: 'source',
                    options: [
                      'open',
                      'high',
                      'low',
                      'close',
                      'hl2',
                      'hlc3',
                      'ohlc4'
                    ]
                  },
                  {
                    id: 'in_2',
                    name: 'signalLength',
                    defval: 9,
                    type: 'integer',
                    min: 1,
                    max: 50
                  }
                ],
                plots: [
                  {id: 'plot_0', type: 'line'},
                  {id: 'plot_1', type: 'line'},
                  {id: 'plot_2', type: 'line'}
                ],
                graphics: {},
                defaults: {
                  styles: {
                    plot_0: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 1,
                      trackPrice: false,
                      transparency: 35,
                      visible: true,
                      color: chartPalette.volumeDown
                    },
                    plot_1: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 0,
                      trackPrice: false,
                      transparency: 35,
                      visible: true,
                      color: '#0000FF'
                    },
                    plot_2: {
                      linestyle: 0,
                      linewidth: 1,
                      plottype: 0,
                      trackPrice: false,
                      transparency: 35,
                      visible: true,
                      color: chartPalette.volumeDown
                    }
                  },
                  precision: 4,
                  inputs: {in_0: 12, in_1: 26, in_3: 'close', in_2: 9}
                },
                _metainfoVersion: 27,
                isTVScript: false,
                isTVScriptStub: false,
                is_hidden_study: false,
                styles: {
                  plot_0: {
                    title: 'Histogram',
                    histogramBase: 0,
                    joinPoints: false
                  },
                  plot_1: {title: 'MACD', histogramBase: 0, joinPoints: false},
                  plot_2: {title: 'Signal', histogramBase: 0, joinPoints: false}
                },
                description: 'MACD',
                shortDescription: 'MACD',
                is_price_study: false,
                id: 'Moving Average Convergence/Divergence@tv-basicstudies-1',
                scriptIdPart: '',
                name: 'Moving Average Convergence/Divergence@tv-basicstudies',
                description_localized: 'MACD',
                shortId: 'Moving Average Convergence/Divergence',
                packageId: 'tv-basicstudies',
                version: '1',
                fullId:
                  'Moving Average Convergence/Divergence@tv-basicstudies-1',
                productId: 'tv-basicstudies'
              }
            }
          ],
          leftAxisState: {
            m_priceRange: {m_maxValue: 0.5, m_minValue: -0.5},
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_height: 78,
            m_topMargin: 0.15,
            m_bottomMargin: 0.1
          },
          leftAxisSources: [],
          rightAxisState: {
            m_priceRange: {
              m_maxValue: 2531.7170205656166,
              m_minValue: -1438.5406353374638
            },
            m_isAutoScale: true,
            m_isPercentage: false,
            m_isLog: false,
            m_height: 78,
            m_topMargin: 0.15,
            m_bottomMargin: 0.1
          },
          rightAxisSources: ['MFfupT'],
          overlayPriceScales: {},
          stretchFactor: 605.3811659192825,
          mainSourceId: 'MFfupT'
        }
      ],
      timeScale: {m_barSpacing: 5.763973016993665, m_rightOffset: 2},
      chartProperties: {
        paneProperties: {
          background: 'rgb(51,51,51)',
          gridProperties: {
            color: 'rgba(140, 148, 160, 0.4)',
            style: 0,
            transparency: 0.4
          },
          vertGridProperties: {
            color: 'rgba(140, 148, 160, 0.4)',
            style: 1,
            transparency: 0.4
          },
          horzGridProperties: {
            color: 'rgba(140, 148, 160, 0.4)',
            style: 1,
            transparency: 0.4
          },
          crossHairProperties: {
            color: 'rgba(140, 148, 160, 0.4)',
            style: 0,
            transparency: 0.4,
            width: 1
          },
          topMargin: 20,
          bottomMargin: 5,
          leftAxisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            percentage: false,
            percentageDisabled: false,
            log: false,
            logDisabled: false,
            alignLabels: true
          },
          rightAxisProperties: {
            autoScale: true,
            autoScaleDisabled: false,
            percentage: false,
            percentageDisabled: false,
            log: false,
            logDisabled: false,
            alignLabels: true
          },
          overlayPropreties: {
            autoScale: true,
            autoScaleDisabled: false,
            percentage: false,
            percentageDisabled: false,
            log: false,
            logDisabled: false,
            alignLabels: true
          },
          legendProperties: {
            showStudyArguments: false,
            showStudyTitles: true,
            showStudyValues: true,
            showSeriesTitle: true,
            showSeriesOHLC: true,
            showLegend: true
          }
        },
        scalesProperties: {
          showLeftScale: false,
          showRightScale: true,
          backgroundColor: 'rgb(51,51,51)',
          lineColor: 'rgba( 85, 85, 85, 1)',
          textColor: 'rgb(140, 148, 160)',
          fontSize: 11,
          scaleSeriesOnly: false,
          showSeriesLastValue: true,
          showStudyLastValue: false,
          showSymbolLabels: false,
          showStudyPlotLabels: false
        },
        chartEventsSourceProperties: {
          visible: true,
          futureOnly: true,
          breaks: {
            color: 'rgba(85, 85, 85, 1)',
            visible: false,
            style: 2,
            width: 1
          }
        }
      },
      version: 2,
      timezone: 'Etc/UTC'
    }
  ]
};
