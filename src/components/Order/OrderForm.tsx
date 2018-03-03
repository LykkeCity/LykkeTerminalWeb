import {Form, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import {OrderFormProps} from './index';
import OrderButton from './OrderButton';
import OrderInput from './OrderInput';
import {capitalize} from '../../utils';

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const OrderForm = (props: OrderFormProps) => {
  const {isDisable, assetName, action, quantity} = props;

  const baseName = assetName.split('/')[0];

  return (
    <Form>
      <OrderInput {...props} />
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

export default withFormik<OrderFormProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(OrderForm);
