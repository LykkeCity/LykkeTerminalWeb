import {InstrumentModel} from '../models';
import {AnalyticsEventsModel} from '../models/analyticsEventModel';

const category = 'Lykke Web Terminal';
const button = 'Button Click';
const event = 'Event';

const location = {
  application: 'Application',
  header: 'Header',
  subheader: 'Subheader',
  instrumentPicker: 'Instrument Picker',
  settings: 'Settings Modal',
  order: 'Order Widget',
  charts: 'Chart Widget',
  priceChart: 'Price Chart',
  depthChart: 'Depth Chart',
  orderBook: 'Order Book Widget',
  funds: 'Funds Widget',
  orders: 'Orders Widget',
  trades: 'Trades Widget',
  tradelog: ' Trade log Widget'
};

export const AnalyticsEvents: AnalyticsEventsModel = {
  SwitchToLimitOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: location.order,
      type: button,
      info: 'Market'
    }
  },
  SwitchToMarketOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: location.order,
      type: button,
      info: 'Limit'
    }
  },
  SideSwitch: (side: string) => ({
    title: 'Change Order Side',
    details: {
      category,
      location: location.order,
      type: button,
      info: side
    }
  }),
  OrderPlaced: (amount: string, side: string, type: string) => ({
    title: 'Placed New Order',
    details: {
      category,
      location: location.order,
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
      location: location.header,
      type: button
    }
  },
  SwitchToDepth: {
    title: 'Switch to Depth Mode',
    details: {
      category,
      location: location.orderBook,
      type: button
    }
  },
  SwitchToVolume: {
    title: 'Switch to Volume Mode',
    details: {
      category,
      location: location.orderBook,
      type: button
    }
  },
  ChartTypeSwitched: (type: string) => ({
    title: 'Switch to another Chart type',
    details: {
      category,
      location: location.charts,
      type: button,
      info: type
    }
  }),
  DepthChartZoom: (scale: number) => ({
    title: 'Scale of the Depth Chart',
    details: {
      category,
      location: location.depthChart,
      type: button,
      info: `${scale}x scale`
    }
  }),
  InstrumentPickerSort: (column: string, direction: string) => ({
    title: 'Sort instruments in picker',
    details: {
      category,
      location: location.instrumentPicker,
      type: button,
      info: {
        column,
        direction
      }
    }
  }),
  InstrumentPickerSearch: (term: string) => ({
    title: 'Search for Instrument in Picker',
    details: {
      category,
      location: location.instrumentPicker,
      type: button,
      info: term
    }
  }),
  SectionSplitterMoved: {
    title: 'Section resized',
    details: {
      category,
      location: location.application,
      type: button
    }
  },
  SessionDurationChanged: (duration: number) => ({
    title: 'Session Duration Changed',
    details: {
      category,
      location: location.settings,
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
      location: location.application,
      type: event,
      info: 'Application has loaded'
    }
  },
  FundsClicked: {
    title: 'Funds Clicked',
    details: {
      category,
      location: location.application,
      type: button,
      info: 'User clicked on Funds widget'
    }
  },
  OpenInstrumentPicker: {
    title: 'Open Instrument Picker',
    details: {
      category,
      location: location.instrumentPicker,
      type: button,
      info: 'User opened Instrument Picker'
    }
  },
  SelectInstrument: (instrument: InstrumentModel) => ({
    title: 'Select Instrument',
    details: {
      category,
      location: location.instrumentPicker,
      type: button,
      info: instrument
    }
  }),
  ChangeWatchlist: (watchlist: any) => ({
    title: 'Change Watchlist',
    details: {
      category,
      location: location.instrumentPicker,
      type: button,
      info: watchlist
    }
  }),
  ClickTotalBalance: {
    title: 'Click Total Balance',
    details: {
      category,
      location: location.subheader,
      type: button,
      info: 'User is trying to click Total Balance element'
    }
  },
  OpenSettingsModal: {
    title: 'Open Settings Modal',
    details: {
      category,
      location: location.subheader,
      type: button,
      info: 'User opened Settings modal window'
    }
  },
  ChangeBaseAsset: (asset: string) => ({
    title: 'Change Base Asset',
    details: {
      category,
      location: location.settings,
      type: button,
      info: `User set ${asset} as base asset`
    }
  }),
  ClickOnAvailable: (orderType: string) => ({
    title: 'Click on Available',
    details: {
      category,
      location: location.order,
      type: button,
      info: `User clicks on Available label at ${orderType} Order Widget`
    }
  }),
  ClickOnReset: {
    title: 'Click on Reset',
    details: {
      category,
      location: location.order,
      type: button,
      info: 'User resets Order Widget'
    }
  }
};
