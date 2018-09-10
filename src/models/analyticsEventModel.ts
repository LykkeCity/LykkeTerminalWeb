import {InstrumentModel} from '.';

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
  LogOut: AnalyticsEventModel;
  SwitchToDepth: AnalyticsEventModel;
  SwitchToVolume: AnalyticsEventModel;
  ChartTypeSwitched: (type: string) => AnalyticsEventModel;
  DepthChartZoom: (scale: number) => AnalyticsEventModel;
  InstrumentPickerSearch: (term: string) => AnalyticsEventModel;
  SectionSplitterMoved: AnalyticsEventModel;
  SessionDurationChanged: (duration: number) => AnalyticsEventModel;
  UserIdentifyTraits: (userInfo: any) => AnalyticsUserIdentifyTraitsModel;
  AppLoaded: AnalyticsEventModel;
  FundsClicked: AnalyticsEventModel;
  OpenInstrumentPicker: AnalyticsEventModel;
  SelectInstrument: (instrument: InstrumentModel) => AnalyticsEventModel;
  ChangeWatchlist: (watchlist: any) => AnalyticsEventModel;
  ClickTotalBalance: AnalyticsEventModel;
  OpenSettingsModal: AnalyticsEventModel;
  ChangeBaseAsset: (asset: string) => AnalyticsEventModel;
  ClickOnAvailable: (orderType: string) => AnalyticsEventModel;
  ClickOnReset: AnalyticsEventModel;
  GroupOrderBook: AnalyticsEventModel;
  ScrollOrderBook: AnalyticsEventModel;
  ApplySorting: (
    widget: string,
    parameter: string,
    direction: string
  ) => AnalyticsEventModel;
}
