import {formatNumber} from '@lykkex/lykke.js';
import {Field, FieldProps, Form, Formik} from 'formik';
import React from 'react';
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
  Side
} from './styles';

const validate = (values: any, availableInBaseAsset: number) => {
  const errors: any = {};

  if (!values.side) {
    errors.side = 'Required';
  }

  if (
    !values.amount ||
    values.amount <= 0 ||
    (values.side === SideModel.Sell && values.amount > availableInBaseAsset)
  ) {
    errors.amount = 'Invalid amount';
  }

  return errors;
};

// tslint:disable:jsx-no-lambda
export default ({
  instrument,
  amount,
  side,
  baseAsset,
  quoteAsset,
  availableInBaseAsset,
  availableInQuoteAsset,
  ask,
  onPlaceOrder,
  onReset
}: any) => (
  <Formik
    enableReinitialize={true}
    initialValues={{
      side,
      amount
    }}
    isInitialValid={(props: any) => {
      return (
        Object.keys(validate(props.initialValues, availableInBaseAsset))
          .length === 0
      );
    }}
    validate={props => validate(props, availableInBaseAsset)}
    onReset={onReset}
    onSubmit={async (values, actions) => {
      try {
        await onPlaceOrder(values);
      } finally {
        actions.setSubmitting(false);
      }
    }}
    render={({
      handleReset,
      setFieldValue,
      setValues,
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
                              ? (availableBySide * part) / ask
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
                        buying ? availableBySide / ask : availableBySide,
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
          <Actions>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {`${SideModel[values.side]} ${values.amount} ${baseAsset}`}
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
