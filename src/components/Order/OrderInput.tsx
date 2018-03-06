import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import Side from '../../models/side';
import NumberInput from '../NumberInput/NumberInput';
import {OrderFormProps} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledOrderOptions = styled.div`
  margin: 10px 0 0 0;
`;

const StyledInputBlock = styled.div`
  width: 50%;
`;

const StyledOptions = styled.div`
  display: flex;
  flex-direction: row;
  margin: ${rem(8)} 0 0 0;
  height: 32px;
`;

const StyledAmount = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: ${rem(14)};
  color: #8c94a0;
`;

const StyledTitle = styled.div`
  font-size: ${rem(14)};
  font-weight: 600;
  color: #f5f6f7;
  line-height: 1.5;
  margin-top: ${rem(16)};
`;

const OrderInput: React.SFC<OrderFormProps> = (props: OrderFormProps) => {
  const {
    onChange,
    onArrowClick,
    price,
    isMarket,
    amount,
    assetName,
    action,
    buy,
    sell,
    quantityAccuracy,
    priceAccuracy
  } = props;

  const quoteName = assetName.split('/')[1];
  const baseName = assetName.split('/')[0];

  return (
    <StyledOrderOptions>
      <Flex justify={'space-between'}>
        <StyledInputBlock>
          <StyledTitle>
            Sell {action === Side.Sell.toLowerCase() ? baseName : quoteName}
          </StyledTitle>
          <StyledOptions>
            <NumberInput
              value={sell}
              id={'sellValue'}
              onChange={onChange(quantityAccuracy)}
              onArrowClick={onArrowClick(quantityAccuracy)}
            />
          </StyledOptions>
        </StyledInputBlock>
        <StyledInputBlock>
          <StyledTitle>
            Buy {action === Side.Sell.toLowerCase() ? quoteName : baseName}
          </StyledTitle>
          <StyledOptions>
            <NumberInput
              value={buy}
              id={'buyValue'}
              onChange={onChange(quantityAccuracy)}
              onArrowClick={onArrowClick(quantityAccuracy)}
            />
          </StyledOptions>
        </StyledInputBlock>
      </Flex>

      {!isMarket ? (
        <div>
          <StyledTitle>Price</StyledTitle>
          <StyledOptions>
            <NumberInput
              value={price}
              id={'priceValue'}
              onChange={onChange(priceAccuracy)}
              onArrowClick={onArrowClick(priceAccuracy)}
            />
            <StyledAmount>
              Total: {amount} {quoteName}
            </StyledAmount>
          </StyledOptions>
        </div>
      ) : null}
    </StyledOrderOptions>
  );
};

export default OrderInput;
