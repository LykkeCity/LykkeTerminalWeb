import {connect} from '../connect';
import EditOrder, {EditOrderProps} from './EditOrder';
import QRModal from './QRModal';
import withModal from './withModal';

const ConnectedEditOrderModal = connect(
  ({
    balanceListStore: {tradingWallet: {balances: availableBalances}},
    referenceStore: {getInstrumentById},
    orderStore: {editOrder}
  }) => ({
    editOrder,
    availableBalances,
    getInstrumentById
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
