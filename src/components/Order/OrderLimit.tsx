import {Form, withFormik} from 'formik';
import * as React from 'react';
import styled from 'styled-components';
import {capitalize} from '../../utils';
import NumberInput from '../NumberInput/NumberInput';
import {
  OrderLimitProps,
  StyledActionTitle,
  StyledInputControl,
  StyledOrderButton,
  StyledReset
} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledTotal = Flex.extend`
  justify-content: space-between;
  border-top: 2px solid #2d2d2d;
  border-bottom: 2px solid #2d2d2d;
  padding: 19px 0;
`;

const StyledNote = styled.div`
  margin-top: 28px;
`;

const OrderLimit: React.SFC<OrderLimitProps> = ({
  action,
  onChange,
  onArrowClick,
  quantity,
  quantityAccuracy,
  price,
  priceAccuracy,
  percents,
  onHandlePercentageChange,
  assetName,
  isSell,
  amount,
  isDisable,
  onReset,
  balance
}) => {
  const baseName = assetName.split('/')[0];
  const quoteName = assetName.split('/')[1];

  return (
    <Form>
      <StyledInputControl>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <StyledActionTitle>
            {action} {baseName}
          </StyledActionTitle>
          <div>
            {balance} {isSell ? baseName : quoteName} available
          </div>
        </Flex>
        <NumberInput
          value={quantity}
          id={'quantityValue'}
          onChange={onChange(quantityAccuracy)}
          onArrowClick={onArrowClick(quantityAccuracy)}
        />
      </StyledInputControl>
      <Flex justify={'space-between'}>
        {percents!.map((item: any, index: number) => (
          <OrderPercentage
            percent={item.percent}
            key={index}
            index={index}
            onClick={onHandlePercentageChange(index)}
            isActive={item.isActive}
          />
        ))}
      </Flex>
      <StyledInputControl style={{borderBottom: '1px solid #333'}}>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <div>Price ({quoteName})</div>
        </Flex>
        <NumberInput
          value={price}
          id={'priceValue'}
          onChange={onChange(priceAccuracy)}
          onArrowClick={onArrowClick(priceAccuracy)}
        />
      </StyledInputControl>
      <StyledTotal>
        <div>Total</div>
        <div>
          {amount} {quoteName}
        </div>
      </StyledTotal>
      <StyledNote>
        Your order may execute as a maker order or taker order.
      </StyledNote>

      <StyledOrderButton>
        <OrderButton
          action={action}
          isDisable={isDisable}
          type={'submit'}
          message={`${capitalize(action)} ${quantity} ${baseName}`}
        />
      </StyledOrderButton>
      <StyledReset justify={'center'}>
        <span onClick={onReset}>Reset and clear</span>
      </StyledReset>
    </Form>
  );
};

export default withFormik<OrderLimitProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderLimit);
