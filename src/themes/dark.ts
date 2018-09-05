import {darken, lighten, rgb} from 'polished';

const colors = {
  text: 'rgb(245, 246, 247)',
  defaultText: '#f5f6f7',
  linkText: '#0388ef',
  amountText: '#8c94a0',
  marketAmountText: '#ff6161',
  choosableItemText: '#f5f6f7',
  inputText: '#f5f6f7',
  activeItemText: 'rgb(245, 246, 247)',
  inactiveItemText: '#8c94a0',
  totalHintText: '#8c94a0',
  instrumentVolumeText: 'rgba(245, 246, 247, 0.4)',
  balanceNumberText: '#ffffff',
  balanceTotalHintText: 'rgba(245, 246, 247, 0.4)',
  zeroNumberText: 'rgba(245, 246, 247, 0.4)',
  numberNonPriceText: 'rgba(245, 246, 247, 0.4)',
  changePositivePerformanceText: '#46eb6a',
  changeNegativePerformanceText: '#ff6161',
  noteMarkText: '#ff6161',
  instrumentSearchText: '#8c94a0',
  noteText: '#ffffff',
  buyButtonText: '#333333',
  sellButtonText: 'rgb(245, 246, 247)',

  mainBackground: '#333333',
  mainSplitter: 'rgba(0, 0, 0, 0.8)',
  shellBackground: 'rgba(0, 0, 0, 0.2)',
  tileTitle: 'rgb(245, 246, 247)',
  tileHeaderBackground: '#2f2f2f',
  tileBackground: 'rgb(51, 51, 51)',
  tileBorder: 'rgba(0, 0, 0, 0.2)',
  boxShadow: 'rgba(0, 0, 0, 0.2)',
  backdropBackground: '#232323',
  barBackground: 'rgba(0, 0, 0, 0.2)',
  activeItemBorder: '#0388ef',

  headerBackground: '#333333',
  headerBorder: '#292929',
  headerFigureLabel: '#8c94a0',
  headerFigureValue: 'rgb(245, 246, 247)',
  headerIcon: '#8c94a0',
  headerItemSeparator: 'rgba(0, 0, 0, 0.2)',
  headerTotalBalanceValue: '#f5f6f7',
  headerBaseAssetLabel: '#0388ef',
  headerActiveItemBackground: 'rgba(0, 0, 0, 0.2)',

  footerBackground: '#333333',
  footerBorder: '#292929',
  disconnectedStatusBackground: '#ff6161',
  connectedStatusBackground: '#46eb6a',

  buttonBackground: '#0388ef',
  buttonBorder: '#0388ef',
  buttonText: '#ffffff',
  resetButton: 'rgb(3, 136, 239)',
  switchButtonBackground: 'rgb(39, 39, 39)',
  cancelAllButtonBorder: 'rgba(140, 148, 160, 0.4)',
  cancelAllButtonInactiveBorder: 'rgba(140, 148, 160, 0.4)',
  cancelAllButtonInactiveText: '#8c94a0',
  closeButton: '#f5f6f7',
  applyButtonBackground: '#0388ef',
  applyButtonBorder: '#0388ef',
  orderSellButton: '#ff6161',
  orderBuyButton: '#46eb6a',
  actionSessionButtonBorder: 'rgba(255, 255, 255, 0.4)',

  tabsHeaderBorder: '#2d2d2d',

  tableHeaderText: '#8c94a0',
  tableHeaderBorder: '#272727',
  tableRowBorder: 'rgba(0, 0, 0, 0.1)',
  tableRowHoverBackground: 'rgba(0, 0, 0, 0.1)',
  tableFirstColumnText: '#f5f6f7',
  tableHeaderSortIcon: '#8c94a0',

  dropdownControlBackground: '#3c3c3c',
  dropdownControlBorder: '#5c5f64',
  dropdownControlIcon: 'rgba(245, 246, 247, 0.4)',
  dropdownHoveredItemBackground: '#3c3c3c',
  dropdownItemBackground: '#3c3c3c',
  dropdownItemBorder: '#272727',
  dropdownActiveItemBackground: '#0388ef',

  selectBackground: 'rgb(60, 60, 60)',
  selectBorder: 'rgba(0, 0, 0, 0.2)',
  selectActiveItem: '#0388ef',
  selectItemHoveredBackground: 'rgba(0, 0, 0, 0.2)',

  inputBorder: '#56595e',
  customCheckboxBackground: '#0388ef',

  modalBackground: '#3e3e3e',
  modalBorder: 'rgba(0, 0, 0, 0.2)',
  editModalSell: '#ff6161',
  editModalBuy: '#46eb6a',
  readOnlyModeNotificationBackground: '#0388ef',
  disclaimerNotificationBackground: '#ff6161',
  sessionNotificationBackground: '#ff6161',
  kycAndFundsBackBackground: 'rgb(51, 51, 51)',
  settingsBackground: '#3c3c3c',
  noteMarkBackground: 'rgb(245, 246, 247)',
  qrCodeWrapperBorder: '#ffffff',

  midOverlayBackground: 'rgb(51, 51, 51)',
  levelBorder: 'rgba(0, 0, 0, 0.1)',
  levelListVolume: 'rgb(245, 246, 247)',
  levelListValue: 'rgb(245, 246, 247)',
  levelListAnimatedColor: 'rgb(245, 246, 247)',
  levelListTrailingZero: 'rgba(245, 246, 247, 0.4)',
  levelListBuy: 'rgb(70, 235, 106)',
  levelListSell: 'rgb(255, 97, 97)'
};

const buttonBackgrounds = {
  normal: rgb(39, 39, 39),
  hovered: darken(0.1, rgb(39, 39, 39)),
  pressed: darken(0.2, rgb(39, 39, 39)),
  disabled: lighten(0.05, rgb(39, 39, 39))
};

const buttonColors = {
  normal: colors.buttonText,
  hovered: lighten(0.1, colors.buttonText),
  pressed: lighten(0.2, colors.buttonText),
  disabled: darken(0.3, colors.buttonText)
};

export default {
  colors,
  buttonBackgrounds,
  buttonColors
};
