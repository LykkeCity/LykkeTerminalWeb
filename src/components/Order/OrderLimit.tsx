import {Form, withFormik} from 'formik';
import * as React from 'react';
import {OrderInputs} from '../../models';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import NumberInput from '../NumberInput/NumberInput';
import {OrderBasicFormProps} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';
import {
  Action,
  Amount,
  Available,
  InputControl,
  LimitTitle,
  LimitTotal,
  Reset,
  StyledOrderButton
} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export interface OrderLimitProps extends OrderBasicFormProps {
  amount?: string;
  price: string;
  buttonMessage: string;
  isEditForm?: boolean;
  onPriceArrowClick: (operation: string) => void;
  onPriceChange: (value: string) => void;
}

const OrderLimit: React.SFC<OrderLimitProps> = ({
  action,
  onPriceChange,
  onQuantityChange,
  onPriceArrowClick,
  onQuantityArrowClick,
  quantity,
  quantityAccuracy,
  price,
  priceAccuracy,
  percents,
  onHandlePercentageChange,
  baseAssetName,
  buttonMessage,
  quoteAssetName,
  isSell,
  amount,
  isDisable,
  onReset,
  balance,
  isEditForm,
  baseAssetAccuracy,
  balanceAccuracy,
  updatePercentageState
}) => {
  const handlePriceArrowClick = (operation: string) => () => {
    onPriceArrowClick(operation);
    updatePercentageState(OrderInputs.Price);
  };

  const handleQuantityArrowClick = (operation: string) => () => {
    onQuantityArrowClick(operation);
    updatePercentageState(OrderInputs.Quantity);
  };

  const handlePriceChange = () => (e: any) => {
    onPriceChange(e.target.value);
    updatePercentageState(OrderInputs.Price);
  };

  const handleQuantityChange = () => (e: any) => {
    onQuantityChange(e.target.value);
    updatePercentageState(OrderInputs.Quantity);
  };

  return (
    <Form>
      <InputControl style={{borderBottom: '1px solid #333'}}>
        <Flex justify={'space-between'} style={{marginBottom: '7px'}}>
          <LimitTitle>Price ({quoteAssetName})</LimitTitle>
        </Flex>
        <NumberInput
          value={price}
          id={OrderInputs.Price}
          onChange={handlePriceChange}
          onArrowClick={handlePriceArrowClick}
        />
      </InputControl>
      <InputControl>
        <Flex justify={'space-between'} style={{marginBottom: '7px'}}>
          <Action>{`Amount (${baseAssetName})`}</Action>
          <Available onClick={onHandlePercentageChange()}>
            {formattedNumber(balance || 0, balanceAccuracy)}{' '}
            {isSell ? baseAssetName : quoteAssetName} available
          </Available>
        </Flex>
        <NumberInput
          value={quantity}
          id={OrderInputs.Quantity}
          onChange={handleQuantityChange}
          onArrowClick={handleQuantityArrowClick}
        />
      </InputControl>
      <Flex justify={'space-between'}>
        {percents!.map((item: any, index: number) => (
          <OrderPercentage
            percent={item.percent}
            key={index}
            onClick={onHandlePercentageChange(index)}
            isActive={item.isActive}
            isDisabled={!balance}
          />
        ))}
      </Flex>
      <LimitTotal>
        <LimitTitle>Total</LimitTitle>
        <Amount>
          {amount} {quoteAssetName}
        </Amount>
      </LimitTotal>

      <StyledOrderButton>
        <OrderButton
          isDisable={isDisable}
          type={'submit'}
          message={buttonMessage}
        />
      </StyledOrderButton>

      {onReset && (
        <Reset justify={'center'}>
          <span onClick={onReset}>Reset and clear</span>
        </Reset>
      )}
    </Form>
  );
};

export default withFormik<OrderLimitProps, {}>({
  handleSubmit: (values: any, {props}) => {
    const {action, baseAssetName, quoteAssetName} = props;
    props.onSubmit(action, baseAssetName, quoteAssetName);
  }
})(OrderLimit);
