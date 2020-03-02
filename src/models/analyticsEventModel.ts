import {EventModel} from '@lykkex/lykke.js';
import {InstrumentModel} from '.';

export interface AnalyticsUserIdentifyTraitsModel {
  firstName: string;
  lastName: string;
  kycStatus: string;
}

export interface AnalyticsEventsModel {
  SwitchToLimitOrder: EventModel;
  SwitchToMarketOrder: EventModel;
  SideSwitch: (side: string) => EventModel;
  OrderPlaced: (amount: string, side: string, type: string) => EventModel;
  LogOut: EventModel;
  SwitchToDepth: EventModel;
  SwitchToVolume: EventModel;
  ChartTypeSwitched: (type: string) => EventModel;
  DepthChartZoom: (scale: number) => EventModel;
  InstrumentPickerSearch: (term: string) => EventModel;
  SectionSplitterMoved: EventModel;
  SessionDurationChanged: (duration: number) => EventModel;
  UserIdentifyTraits: (userInfo: any) => AnalyticsUserIdentifyTraitsModel;
  LoadTerminal: EventModel;
  FundsClicked: EventModel;
  OpenInstrumentPicker: EventModel;
  SelectInstrument: (instrument: InstrumentModel) => EventModel;
  ChangeWatchlist: (watchlist: any) => EventModel;
  ClickTotalBalance: EventModel;
  OpenSettingsModal: EventModel;
  ChangeBaseAsset: (asset: string) => EventModel;
  ClickOnAvailable: (orderType: string) => EventModel;
  ClickOnReset: EventModel;
  GroupOrderBook: EventModel;
  ScrollOrderBook: EventModel;
  ApplySorting: (
    widget: string,
    parameter: string,
    direction: string
  ) => EventModel;
  StartOrderEdit: EventModel;
  CancelOrderEdit: EventModel;
  FinishOrderEdit: EventModel;
  CancelOrder: EventModel;
  LoadMoreTrades: EventModel;
  StartTierUpgrade: EventModel;
}
