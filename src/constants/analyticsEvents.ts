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
  OpenMyFunds: {
    title: 'Open My Funds Tab',
    details: {
      category,
      location: 'OrderList Widget',
      type: 'Change Tab'
    }
  },
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
  TradelogScrolledToBottom: {
    title: 'Scroll Tradelog to the Bottom',
    details: {
      category,
      location: 'TradeList Widget',
      type: 'Scroll'
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
  })
};
