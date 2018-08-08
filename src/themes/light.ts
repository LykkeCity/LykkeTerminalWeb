import {darken, lighten} from 'polished';

const colors = {
  text: 'black',
  defaultText: 'black',
  linkText: 'black',
  amountText: 'black',
  choosableItemText: 'black',
  inputText: 'black',
  activeItemText: 'black',
  inactiveItemText: 'grey',
  totalHintText: 'black',
  instrumentVolumeText: 'black',
  balanceNumberText: 'black',
  balanceTotalHintText: 'black',
  zeroNumberText: 'grey',
  numberNonPriceText: 'grey',
  changePositivePerformanceText: 'green',
  changeNegativePerformanceText: 'red',
  noteMarkText: 'red',
  instrumentSearchText: 'grey',
  noteText: 'black',
  buyButtonText: 'white',
  sellButtonText: 'white',

  mainBackground: 'white',
  mainSplitter: 'black',
  shellBackground: 'white',
  tileTitle: 'black',
  tileHeaderBackground: 'white',
  tileBackground: 'white',
  tileBorder: 'black',
  boxShadow: 'lightgrey',
  backdropBackground: '#232323',
  barBackground: 'lightgrey',
  activeItemBorder: 'black',

  headerBackground: 'white',
  headerBorder: 'black',
  headerFigureLabel: 'black',
  headerFigureValue: 'black',
  headerIcon: 'black',
  headerItemSeparator: 'black',
  headerTotalBalanceValue: 'black',
  headerBaseAssetLabel: 'black',
  headerActiveItemBackground: 'lightgrey',

  footerBackground: 'white',
  footerBorder: 'black',
  disconnectedStatusBackground: 'red',
  connectedStatusBackground: 'green',

  buttonBackground: 'white',
  buttonBorder: 'lightgrey',
  buttonText: 'black',
  resetButton: 'black',
  switchButtonBackground: 'white',
  cancelAllButtonBorder: 'black',
  cancelAllButtonInactiveBorder: 'lightgrey',
  cancelAllButtonInactiveText: 'lightgrey',
  closeButton: 'black',
  applyButtonBackground: 'lightgrey',
  applyButtonBorder: 'lightgrey',
  orderSellButton: 'red',
  orderBuyButton: 'green',
  actionSessionButtonBorder: 'black',

  tabsHeaderBorder: 'black',

  tableHeaderText: 'black',
  tableHeaderBorder: 'black',
  tableRowBorder: 'black',
  tableRowHoverBackground: 'lightgrey',
  tableFirstColumnText: 'black',
  tableHeaderSortIcon: 'black',

  dropdownControlBackground: 'white',
  dropdownControlBorder: 'black',
  dropdownControlIcon: 'black',
  dropdownHoveredItemBackground: 'white',
  dropdownItemBackground: 'white',
  dropdownItemBorder: 'black',
  dropdownActiveItemBackground: 'lightgrey',

  selectBackground: 'white',
  selectBorder: 'black',
  selectActiveItem: 'lightgrey',
  selectItemHoveredBackground: 'lightgrey',

  inputBorder: 'black',
  customCheckboxBackground: 'lightgrey',

  modalBackground: 'white',
  modalBorder: 'black',
  editModalSell: 'red',
  editModalBuy: 'green',
  readOnlyModeNotificationBackground: 'lightgrey',
  disclaimerNotificationBackground: 'red',
  sessionNotificationBackground: 'red',
  kycAndFundsBackBackground: 'white',
  settingsBackground: 'white',
  noteMarkBackground: 'lightgrey',
  qrCodeWrapperBorder: 'black',

  midOverlayBackground: 'white',
  levelBorder: 'black',
  levelListVolume: 'black',
  levelListValue: 'black',
  levelListAnimatedColor: 'black',
  levelListTrailingZero: 'black',
  levelListBuy: 'green',
  levelListSell: 'red'
};

const buttonBackgrounds = {
  normal: 'lightgrey',
  hovered: darken(0.1, 'lightgrey'),
  pressed: darken(0.2, 'lightgrey'),
  disabled: lighten(0.05, 'lightgrey')
};

const buttonColors = {
  normal: colors.text,
  hovered: lighten(0.1, colors.text),
  pressed: lighten(0.2, colors.text),
  disabled: darken(0.3, colors.text)
};

export default {
  colors,
  buttonBackgrounds,
  buttonColors
};
