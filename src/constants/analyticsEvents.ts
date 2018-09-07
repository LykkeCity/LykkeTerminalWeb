import {InstrumentModel} from '../models';
import {AnalyticsEventsModel} from '../models/analyticsEventModel';

const category = 'Lykke Web Terminal';

export const AnalyticsEvents: AnalyticsEventsModel = {
  SwitchToLimitOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: 'Order Widget',
      type: 'Button Click',
      info: 'Market'
    }
  },
  SwitchToMarketOrder: {
    title: 'Change Order Type',
    details: {
      category,
      location: 'Order Widget',
      type: 'Button Click',
      info: 'Limit'
    }
  },
  SideSwitch: (side: string) => ({
    title: 'Change Order Side',
    details: {
      category,
      location: 'Order Widget',
      type: 'Button Click',
      info: side
    }
  }),
  OrderPlaced: (amount: string, side: string, type: string) => ({
    title: 'Placed New Order',
    details: {
      category,
      location: 'Order Widget',
      type: 'Button Click',
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
      location: 'Header',
      type: 'Button Click'
    }
  },
  SwitchToDepth: {
    title: 'Switch to Depth Mode',
    details: {
      category,
      location: 'OrderBook Widget',
      type: 'Button Click'
    }
  },
  SwitchToVolume: {
    title: 'Switch to Volume Mode',
    details: {
      category,
      location: 'OrderBook Widget',
      type: 'Button Click'
    }
  },
  ChartTypeSwitched: (type: string) => ({
    title: 'Switch to another Chart type',
    details: {
      category,
      location: 'Chart',
      type: 'Button Click',
      info: type
    }
  }),
  DepthChartZoom: (scale: number) => ({
    title: 'Scale of the Depth Chart',
    details: {
      category,
      location: 'Depth Chart',
      type: 'Button Click',
      info: `${scale}x scale`
    }
  }),
  InstrumentPickerSort: (column: string, direction: string) => ({
    title: 'Sort instruments in picker',
    details: {
      category,
      location: 'Instrument Picker',
      type: 'Button Click',
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
      location: 'Instrument Picker',
      type: 'Button Click',
      info: term
    }
  }),
  SectionSplitterMoved: {
    title: 'Section resized',
    details: {
      category,
      location: 'Application',
      type: 'Button Click'
    }
  },
  SessionDurationChanged: (duration: number) => ({
    title: 'Session Duration changed',
    details: {
      category,
      location: 'Application',
      type: 'Button Click',
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
      location: 'Application',
      type: 'Event',
      info: 'Application has loaded'
    }
  },
  FundsClicked: {
    title: 'Funds Clicked',
    details: {
      category,
      location: 'Application',
      type: 'Click',
      info: 'User clicked on Funds widget'
    }
  },
  OpenInstrumentPicker: {
    title: 'Open Instrument Picker',
    details: {
      category,
      location: 'Instrument Picker',
      type: 'Click',
      info: 'User opened Instrument Picker'
    }
  },
  SelectInstrument: (instrument: InstrumentModel) => ({
    title: 'Select Instrument',
    details: {
      category,
      location: 'Instrument Picker',
      type: 'Click',
      info: instrument
    }
  }),
  ChangeWatchlist: (watchlist: any) => ({
    title: 'Change Watchlist',
    details: {
      category,
      location: 'Instrument Picker',
      type: 'Click',
      info: watchlist
    }
  }),
  ClickTotalBalance: {
    title: 'Click Total Balance',
    details: {
      category,
      location: 'Application',
      type: 'Click',
      info: 'User is trying to click Total Balance element'
    }
  },
  OpenSettingsModal: {
    title: 'Open Settings Modal',
    details: {
      category,
      location: 'Application',
      type: 'Click',
      info: 'User opened Settings modal window'
    }
  },
  ChangeBaseAsset: (asset: string) => ({
    title: 'Change Base Asset',
    details: {
      category,
      location: 'Setting Modal',
      type: 'Click',
      info: `User set ${asset} as base asset`
    }
  }),
  ClickOnAvailable: (orderType: string) => ({
    title: 'Click on Available',
    details: {
      category,
      location: 'Order Widget',
      type: 'Click',
      info: `User clicks on Available label at ${orderType} Order Widget`
    }
  }),
  ClickOnReset: {
    title: 'Click on Reset',
    details: {
      category,
      location: 'Order Widget',
      type: 'Click',
      info: 'User resets Order Widget'
    }
  }
};
