import {formatNumber} from '@lykkex/lykke.js';
import {Field, FieldProps, Form, Formik} from 'formik';
import React from 'react';
import {formattedNumber} from 'src/utils/localFormatted/localFormatted';
import {precisionCeil} from 'src/utils/math';
import {Side as SideModel} from '../../models';
import {
  Actions,
  AvailableBalance,
  Button,
  FormGroup,
  GhostButton,
  Input,
  Label,
  Percentage,
  Side,
  Total
} from './styles';

// tslint:disable:jsx-no-lambda
export default ({
  initialPrice,
  price,
  stopPrice,
  amount,
  side,
  instrument,
  baseAsset,
  quoteAsset,
  availableInBaseAsset,
  availableInQuoteAsset,
  onPlaceOrder,
  onReset,
  editing = false
}: any) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      side,
      price: price || initialPrice,
      stopPrice,
      amount
    }}
    validate={(values: any) => {
      const errors: any = {};

      if (!values.side) {
        errors.side = 'Required';
      }

      if (!values.price || values.price <= 0) {
        errors.price = 'Invalid price';
      }

      if (!values.amount || values.amount <= 0) {
        errors.amount = 'Invalid amount';
      }

      const buying = values.side === SideModel.Buy;
      const total = buying ? values.price * values.amount : values.amount;
      const availableBySide = buying
        ? availableInQuoteAsset
        : availableInBaseAsset;
      if (total > availableBySide) {
        errors.total = 'Not enough funds';
      }

      if (buying && values.stopPrice > values.price) {
        errors.stopPrice = 'Invalid stop price';
      }

      return errors;
    }}
    onSubmit={async (values, actions) => {
      try {
        await onPlaceOrder(values);
      } finally {
        actions.setSubmitting(false);
      }
    }}
    onReset={onReset}
    render={({
      handleReset,
      setFieldValue,
      values,
      dirty,
      isValid,
      isSubmitting
    }: any) => {
      const buying = values.side === SideModel.Buy;
      const availableBySide = buying
        ? availableInQuoteAsset
        : availableInBaseAsset;
      return (
        <Form>
          {editing || (
            <Side>
              <Field
                component={Side.Option}
                name="side"
                id={SideModel.Buy}
                label={SideModel.Buy}
              />
              <Field
                component={Side.Option}
                name="side"
                id={SideModel.Sell}
                label={SideModel.Sell}
              />
            </Side>
          )}
          <Field name="stopPrice">
            {({field}: FieldProps) => (
              <FormGroup>
                <Label htmlFor={field.name}>Stop Price</Label>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={Math.pow(10, -instrument.accuracy)}
                />
              </FormGroup>
            )}
          </Field>
          <Field name="price">
            {({field}: FieldProps) => (
              <FormGroup>
                <Label htmlFor={field.name}>Limit Price</Label>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={Math.pow(10, -instrument.accuracy)}
                />
              </FormGroup>
            )}
          </Field>
          <Field name="amount">
            {({field}: FieldProps) => (
              <FormGroup>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  step={Math.pow(10, -instrument.baseAsset.accuracy)}
                  onChange={e => {
                    setFieldValue('percent', undefined);
                    field.onChange(e);
                  }}
                />
                <Percentage>
                  {[0.25, 0.5, 0.75, 1].map(part => (
                    <Field
                      key={`percent${part * 100}`}
                      component={Percentage.Item}
                      name="percent"
                      id={`percent${part * 100}`}
                      label={formatNumber('')(part, 0, {
                        style: 'percent'
                      })}
                      onClick={() => {
                        setFieldValue(
                          'amount',
                          precisionCeil(
                            buying
                              ? (availableBySide * part) / values.price
                              : availableBySide * part,
                            instrument.baseAsset.accuracy
                          )
                        );
                      }}
                    />
                  ))}
                </Percentage>
                <AvailableBalance
                  onClick={() => {
                    setFieldValue(
                      'amount',
                      precisionCeil(
                        buying
                          ? availableBySide / values.price
                          : availableBySide,
                        instrument.baseAsset.accuracy
                      )
                    );
                  }}
                >
                  {availableBySide} {buying ? quoteAsset : baseAsset} available
                </AvailableBalance>
              </FormGroup>
            )}
          </Field>
          <Total>
            <Total.Title>Total</Total.Title>
            <Total.Value>
              {buying
                ? `${formattedNumber(
                    values.price * values.amount,
                    instrument.quoteAsset.accuracy
                  )} ${quoteAsset}`
                : `${values.amount} ${baseAsset}`}
            </Total.Value>
          </Total>
          <Actions>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {editing
                ? 'Modify'
                : `${SideModel[values.side]} ${values.amount} ${baseAsset}`}
            </Button>
            <GhostButton
              type="button"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </GhostButton>
          </Actions>
        </Form>
      );
    }}
  />
);
