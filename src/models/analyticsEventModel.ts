export interface AnalyticsEventDetailsModel {
  category: string;
  location: string;
  type: string;
  info?: string;
}

export interface AnalyticsEventModel {
  title: string;
  details: AnalyticsEventDetailsModel;
}

export interface AnalyticsEventsModel {
  SwitchToLimitOrder: AnalyticsEventModel;
  SwitchToMarketOrder: AnalyticsEventModel;
  OpenMyFunds: AnalyticsEventModel;
  SignOut: AnalyticsEventModel;
  SwitchToDepth: AnalyticsEventModel;
  SwitchToVolume: AnalyticsEventModel;
  TradelogScrolledToBottom: AnalyticsEventModel;
}
