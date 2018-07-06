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
  OpenMyFunds: {
    title: 'Open My Funds Tab',
    details: {
      category,
      location: 'OrderList Widget',
      type: 'Change Tab'
    }
  },
  SignOut: {
    title: 'Sign Out',
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
  }
};
