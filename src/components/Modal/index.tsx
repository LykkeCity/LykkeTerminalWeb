import {connect} from '../connect';
import EditOrder from './EditOrder';
import QRModal from './QRModal';

const ConnectedEditOrderModal = connect(
  ({
    balanceListStore: {tradingWalletBalances: availableBalances},
    orderListStore: {limitOrders: orders},
    referenceStore: {getInstrumentById},
    uiOrderStore: {
      onArrowClick,
      onValueChange,
      resetPercentage,
      handlePercentageChange,
      setActivePercentage,
      isLimitInvalid
    },
    orderStore: {editOrder}
  }) => ({
    editOrder,
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

export {ConnectedEditOrderModal as EditOrder};
export {ConnectedQRModal as QRModal};
