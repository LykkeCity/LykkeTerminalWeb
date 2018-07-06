import {AnalyticsEvents} from '../constants/analyticsEvents';
import {AnalyticsEventModel} from '../models/analyticsEventModel';

declare global {
  interface Window {
    analytics: any;
  }
}

export const AnalyticsIds = {
  LimitOrderButton: 'limit-order-button',
  MarketOrderButton: 'market-order-button',
  MyFundsTab: 'my-funds-click'
};

export abstract class AnalyticsService {
  static handlePageLoading = () => {
    window.analytics.load(process.env.REACT_APP_SEGMENT_WRITE_KEY);
    window.analytics.page();
  };

  static handleSwitchToLimitOrder = (): void => {
    AnalyticsService.handleClick(
      AnalyticsIds.LimitOrderButton,
      AnalyticsEvents.SwitchToLimitOrder
    );
  };

  static handleSwitchToMarketOrder = (): void => {
    AnalyticsService.handleClick(
      AnalyticsIds.MarketOrderButton,
      AnalyticsEvents.SwitchToMarketOrder
    );
  };

  static handleOpenMyFunds = (): void => {
    AnalyticsService.handleClick(
      AnalyticsIds.MyFundsTab,
      AnalyticsEvents.OpenMyFunds
    );
  };

  private static handleClick = (
    id: string,
    event: AnalyticsEventModel
  ): void => {
    const button = document.getElementById(id);
    window.analytics.trackClick(button, event.title, event.details);
  };
}
