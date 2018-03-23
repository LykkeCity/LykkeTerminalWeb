import styled, {padding} from '../styled';

const OrderListToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${padding(8, 0)};
  width: 100%;
`;

OrderListToolbar.displayName = 'OrderListToolbar';

export default OrderListToolbar;
