import {Form, withFormik} from 'formik';
import * as React from 'react';
import {OrderInputs} from '../../models';
import NumberInput from '../NumberInput/NumberInput';
import {OrderBasicFormProps} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';
import {
  Action,
  Amount,
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
}

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
  baseAssetName,
  buttonMessage,
  quoteAssetName,
  isSell,
  amount,
  isDisable,
  onReset,
  balance,
  isEditForm
}) => {
  return (
    <Form>
      <InputControl>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <Action>{isEditForm ? 'Volume' : `${action} ${baseAssetName}`}</Action>
          <Amount onClick={onHandlePercentageChange()>
            {balance} {isSell ? baseAssetName : quoteAssetName} available
          </Amount>
        </Flex>
        <NumberInput
          value={quantity}
          id={OrderInputs.Quantity}
          onChange={onChange(quantityAccuracy)}
          onArrowClick={onArrowClick(quantityAccuracy)}
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
      <InputControl style={{borderBottom: '1px solid #333'}}>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <LimitTitle>Price ({quoteAssetName})</LimitTitle>
        </Flex>
        <NumberInput
          value={price}
          id={OrderInputs.Price}
          onChange={onChange(priceAccuracy)}
          onArrowClick={onArrowClick(priceAccuracy)}
        />
      </InputControl>
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
