import {Form, withFormik} from 'formik';
import rem from 'polished/lib/helpers/rem';
import * as React from 'react';
import styled from 'styled-components';
import {OrderFormProps} from '../index';
import OrderButton, {StyledButton} from '../OrderButton';
import OrderInput from '../OrderInput';

const StyledOrderButton = styled.div`
  display: flex;
  margin-top: ${rem(24)};
`;

const StyledCancelButton = StyledButton.extend`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

interface EditOrderFormProps extends OrderFormProps {
  onCancel: any;
}

const EditOrderForm = (props: EditOrderFormProps) => {
  const {isDisable, assetName, action, quantity, amount, onCancel} = props;

  const baseName = assetName.split('/')[0];

  return (
    <Form>
      <OrderInput {...props} />
      <StyledOrderButton>
        <OrderButton
          action={action}
          price={amount}
          baseName={baseName}
          quantity={quantity}
          isDisable={isDisable}
          type={'submit'}
        />
        <StyledCancelButton type="button" onClick={onCancel}>
          Cancel
        </StyledCancelButton>
      </StyledOrderButton>
    </Form>
  );
};

export default withFormik<EditOrderFormProps, {}>({
  handleSubmit: (values, {props}) => {
    const {action} = props;
    props.onSubmit(action);
  }
})(EditOrderForm);
