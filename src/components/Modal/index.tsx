import {connect} from '../connect';
import EditOrder from './EditOrder';
import NoFundsAndKycModal from './NoFundsAndKycModal';
import QRModal from './QRModal';

const ConnectedEditOrderModal = connect(
  ({
    balanceListStore: {tradingWalletBalances: availableBalances},
    orderListStore: {limitOrders: orders},
    referenceStore: {getInstrumentById},
    uiOrderStore: {
      onArrowClick,
      onValueChange,
      fixedAmount,
      resetPercentage,
      handlePercentageChange,
      setActivePercentage,
      isLimitInvalid
    },
    orderStore: {editOrder}
  }) => ({
    editOrder,
    fixedAmount,
    availableBalances,
    getInstrumentById,
    handlePercentageChange,
    onArrowClick,
    onValueChange,
    orders,
    resetPercentage,
    setActivePercentage,
    isLimitInvalid
  }),
  EditOrder
);

const ConnectedQRModal = connect(
  ({sessionStore: {getQrId}}) => ({
    qrId: getQrId()
  }),
  QRModal
);

const ConnectedNoFundsAndKycModal = connect(
  ({authStore: {signOut}}) => ({
    signOut
  }),
  NoFundsAndKycModal
);

export {ConnectedEditOrderModal as EditOrder};
export {ConnectedQRModal as QRModal};
export {ConnectedNoFundsAndKycModal as NoFundsAndKycModal};
