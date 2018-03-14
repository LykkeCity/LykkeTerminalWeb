import {Form, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {capitalize} from '../../utils';
import NumberInput from '../NumberInput/NumberInput';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

interface OrderLimitProps {
  action: string;
  onSubmit: any;
  onChange: any;
  onArrowClick: any;
  onHandlePercentageChange: any;
  quantity: string;
  price: string;
  quantityAccuracy: number;
  priceAccuracy: number;
  percents: any[];
  assetName: string;
  isSell: boolean;
  amount: string;
  isDisable: boolean;
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
  assetName,
  isSell,
  amount,
  isDisable
}) => {
  const baseName = assetName.split('/')[0];
  const quoteName = assetName.split('/')[1];

  return (
    <Form>
      <div>
        <Flex justify={'space-between'}>
          <div>
            {action} {baseName}
          </div>
          <div>available</div>
        </Flex>
        <NumberInput
          value={quantity}
          id={'quantityValue'}
          onChange={onChange(quantityAccuracy)}
          onArrowClick={onArrowClick(quantityAccuracy)}
        />
      </div>
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
      <div>
        <Flex justify={'space-between'}>
          <div>Price ({quoteName})</div>
        </Flex>
        <NumberInput
          value={price}
          id={'priceValue'}
          onChange={onChange(priceAccuracy)}
          onArrowClick={onArrowClick(priceAccuracy)}
        />
      </div>
      <Flex justify={'space-between'}>
        <div>Total</div>
        <div>
          {amount} {quoteName}
        </div>
      </Flex>
      <div>Your order may execute as a maker order or taker order.</div>

      <StyledOrderButton>
        <OrderButton
          action={action}
          isDisable={isDisable}
          type={'submit'}
          message={`${capitalize(action)} ${quantity} ${baseName}`}
        />
      </StyledOrderButton>
    </Form>
  );
};

export default withFormik<OrderLimitProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderLimit);
