import {Form, FormikProps, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import StringHelpers from '../../utils/string';

// tslint:disable:no-console

// Shape of form values
interface FormValues {
  priceValue: number;
  quantityValue: number;
}

const StyledOrderOptions = styled.div`
  margin: 10px 0 0 0;
`;

const StyledOptions = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 0 0 0;
  height: 32px;
`;

const StyledAmount = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: ${rem(14)};
  color: #8c94a0;
`;

const StyledTitle = styled.span`
  font-size: ${rem(14)};
  font-weight: 600;
  color: #f5f6f7;
`;

interface OtherProps {
  isMarket: boolean;
  amount: string;
  onChange: any;
  onSubmit: any;
  quantityInputValue: number;
  priceInputValue: number;
  quoteName: string;
  price: number;
}

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
    values,
    errors,
    handleChange,
    isSubmitting,
    isMarket,
    amount,
    quoteName
    // onChange
  } = props;

  const handleInputChange = () => (e: any) => {
    if (!StringHelpers.isOnlyNumbers(e.target.value)) {
      return;
    }
    e.target.value = e.target.value === '' ? 0 : e.target.value;
    handleChange(e);
  };

  return (
    <Form>
      <StyledOrderOptions>
        {!isMarket ? (
          <div>
            <StyledTitle>Price</StyledTitle>
            <StyledOptions>
              <input
                id="priceValue"
                type="text"
                value={values.priceValue}
                onChange={handleChange}
                name="priceValue"
              />
            </StyledOptions>
            {errors.priceValue && <div>{errors.priceValue}</div>}
          </div>
        ) : null}

        <StyledTitle>Quantity</StyledTitle>
        <StyledOptions>
          <input
            id="quantityValue"
            type="text"
            value={values.quantityValue}
            onChange={handleInputChange()}
            name="quantityValue"
          />
          <StyledAmount>
            Total: {amount} {quoteName}
          </StyledAmount>
        </StyledOptions>
        {errors.quantityValue && <div>{errors.quantityValue}</div>}
      </StyledOrderOptions>

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </Form>
  );
};

export default withFormik<OtherProps, FormValues>({
  mapPropsToValues: () => {
    return {
      priceValue: 0,
      quantityValue: 0
    };
  },

  handleSubmit: (values, formikBag) => {
    formikBag.props.onSubmit();
    console.log(values);
    console.log(formikBag);
    formikBag.resetForm();
  }
})(InnerForm);
