import {connect} from '../connect';
import EditOrder, {EditOrderProps} from './EditOrder';
import QRModal from './QRModal';
import withModal from './withModal';

const ConnectedEditOrderModal = connect(
  ({
    balanceListStore: {tradingWalletBalances: availableBalances},
    orderListStore: {limitOrders: orders},
    referenceStore: {getInstrumentById},
    uiOrderStore: {
      onPriceChange, // TODO change
      handlePercentageChange,
      isLimitInvalid
    },
    orderStore: {editOrder}
  }) => ({
    editOrder,
    availableBalances,
    getInstrumentById,
    handlePercentageChange,
    onValueChange: onPriceChange,
    orders,
    isLimitInvalid
  }),
  withModal<EditOrderProps>(EditOrder)
);

const ConnectedQRModal = connect(
  ({sessionStore: {getQrId}}) => ({
    qrId: getQrId()
  }),
  QRModal
);

export {ConnectedEditOrderModal as EditOrder};
export {ConnectedQRModal as QRModal};
