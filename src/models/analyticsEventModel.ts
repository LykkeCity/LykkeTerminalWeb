export interface AnalyticsEventDetailsModel {
  category: string;
  location: string;
  type: string;
  info?: any;
}

export interface AnalyticsEventModel {
  title: string;
  details: AnalyticsEventDetailsModel;
}

export interface AnalyticsUserIdentifyTraitsModel {
  email: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
}

export interface AnalyticsEventsModel {
  SwitchToLimitOrder: AnalyticsEventModel;
  SwitchToMarketOrder: AnalyticsEventModel;
  SideSwitch: (side: string) => AnalyticsEventModel;
  OrderPlaced: (
    amount: string,
    side: string,
    type: string
  ) => AnalyticsEventModel;
  OpenMyFunds: AnalyticsEventModel;
  LogOut: AnalyticsEventModel;
  SwitchToDepth: AnalyticsEventModel;
  SwitchToVolume: AnalyticsEventModel;
  TradelogScrolledToBottom: AnalyticsEventModel;
  ChartTypeSwitched: (type: string) => AnalyticsEventModel;
  DepthChartZoom: (scale: number) => AnalyticsEventModel;
  InstrumentPickerSort: (
    column: string,
    direction: string
  ) => AnalyticsEventModel;
  InstrumentPickerSearch: (term: string) => AnalyticsEventModel;
  SectionSplitterMoved: AnalyticsEventModel;
  SessionDurationChanged: (duration: number) => AnalyticsEventModel;
  UserIdentifyTraits: (userInfo: any) => AnalyticsUserIdentifyTraitsModel;
}
