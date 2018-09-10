import {InstrumentModel} from '../models';
import {AnalyticsEventsModel} from '../models/analyticsEventModel';
import place from './places';

const category = 'Lykke Web Terminal';
const button = 'Button Click';
const event = 'Event';

export const AnalyticsEvents: AnalyticsEventsModel = {
  SwitchToLimitOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: place.order,
      type: button,
      info: 'Market'
    }
  },
  SwitchToMarketOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: place.order,
      type: button,
      info: 'Limit'
    }
  },
  SideSwitch: (side: string) => ({
    title: 'Change Order Side',
    details: {
      category,
      location: place.order,
      type: button,
      info: side
    }
  }),
  OrderPlaced: (amount: string, side: string, type: string) => ({
    title: 'Placed New Order',
    details: {
      category,
      location: place.order,
      type: button,
      info: {
        amount,
        side,
        type
      }
    }
  }),
  LogOut: {
    title: 'Log Out',
    details: {
      category,
      location: place.header,
      type: button
    }
  },
  SwitchToDepth: {
    title: 'Switch to Depth Mode',
    details: {
      category,
      location: place.orderBook,
      type: button
    }
  },
  SwitchToVolume: {
    title: 'Switch to Volume Mode',
    details: {
      category,
      location: place.orderBook,
      type: button
    }
  },
  ChartTypeSwitched: (type: string) => ({
    title: 'Switch to another Chart type',
    details: {
      category,
      location: place.charts,
      type: button,
      info: type
    }
  }),
  DepthChartZoom: (scale: number) => ({
    title: 'Scale of the Depth Chart',
    details: {
      category,
      location: place.depthChart,
      type: button,
      info: `${scale}x scale`
    }
  }),
  InstrumentPickerSearch: (term: string) => ({
    title: 'Search for Instrument in Picker',
    details: {
      category,
      location: place.instrumentPicker,
      type: button,
      info: term
    }
  }),
  SectionSplitterMoved: {
    title: 'Section Resized',
    details: {
      category,
      location: place.application,
      type: button
    }
  },
  SessionDurationChanged: (duration: number) => ({
    title: 'Session Duration Changed',
    details: {
      category,
      location: place.settings,
      type: button,
      info: `${duration} hours`
    }
  }),
  UserIdentifyTraits: (userInfo: any) => ({
    email: userInfo.email,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    kycStatus: userInfo.kycStatus
  }),
  AppLoaded: {
    title: 'Session Started',
    details: {
      category,
      location: place.application,
      type: event,
      info: 'Application has loaded'
    }
  },
  FundsClicked: {
    title: 'Funds Clicked',
    details: {
      category,
      location: place.application,
      type: button,
      info: 'User clicked on Funds widget'
    }
  },
  OpenInstrumentPicker: {
    title: 'Open Instrument Picker',
    details: {
      category,
      location: place.instrumentPicker,
      type: button,
      info: 'User opened Instrument Picker'
    }
  },
  SelectInstrument: (instrument: InstrumentModel) => ({
    title: 'Select Instrument',
    details: {
      category,
      location: place.instrumentPicker,
      type: button,
      info: instrument
    }
  }),
  ChangeWatchlist: (watchlist: any) => ({
    title: 'Change Watchlist',
    details: {
      category,
      location: place.instrumentPicker,
      type: button,
      info: watchlist
    }
  }),
  ClickTotalBalance: {
    title: 'Click Total Balance',
    details: {
      category,
      location: place.subheader,
      type: button,
      info: 'User is trying to click Total Balance element'
    }
  },
  OpenSettingsModal: {
    title: 'Open Settings Modal',
    details: {
      category,
      location: place.subheader,
      type: button,
      info: 'User opened Settings modal window'
    }
  },
  ChangeBaseAsset: (asset: string) => ({
    title: 'Change Base Asset',
    details: {
      category,
      location: place.settings,
      type: button,
      info: `User set ${asset} as base asset`
    }
  }),
  ClickOnAvailable: (orderType: string) => ({
    title: 'Click on Available',
    details: {
      category,
      location: place.order,
      type: button,
      info: `User clicks on Available label at ${orderType} Order Widget`
    }
  }),
  ClickOnReset: {
    title: 'Click on Reset',
    details: {
      category,
      location: place.order,
      type: button,
      info: 'User resets Order Widget'
    }
  },
  GroupOrderBook: {
    title: 'Click on Grouping Button',
    details: {
      category,
      location: place.orderBook,
      type: button,
      info: 'User grouped orders in Order Book'
    }
  },
  ScrollOrderBook: {
    title: 'Scroll Orders',
    details: {
      category,
      location: place.orderBook,
      type: button,
      info: 'User scrolled orders in Order Book'
    }
  },
  ApplySorting: (widget: string, parameter: string, direction: string) => ({
    title: 'Apply Table Sorting',
    details: {
      category,
      location: widget,
      type: button,
      info: {
        text: 'User applied sorting',
        direction,
        parameter
      }
    }
  }),
  StartOrderEdit: {
    title: 'Start Order Edit',
    details: {
      category,
      location: place.orders,
      type: button,
      info: 'User started editing order'
    }
  },
  CancelOrderEdit: {
    title: 'Cancel Order Edit',
    details: {
      category,
      location: place.editOrder,
      type: button,
      info: 'User canceled editing order'
    }
  },
  FinishOrderEdit: {
    title: 'Finish Order Edit',
    details: {
      category,
      location: place.editOrder,
      type: button,
      info: 'User finished editing order'
    }
  },
  CancelOrder: {
    title: 'Cancel Order',
    details: {
      category,
      location: place.orders,
      type: button,
      info: 'User cancelled order'
    }
  },
  LoadMoreTrades: {
    title: 'Load More Trades',
    details: {
      category,
      location: place.trades,
      type: button,
      info: 'User loads more trades'
    }
  }
};
