import {Form, FormikProps, withFormik} from 'formik';
import {rem} from 'polished';
import * as React from 'react';

// tslint:disable-next-line:no-var-requires
const {Flex, Box} = require('grid-styled');

const StyledOrderButton = styled.div`
  margin-top: ${rem(24)};
`;

const StyledInvertedBtn = Box.extend`
  background: url('assets/images/invert.png') no-repeat center;
  border: 1px solid rgba(140, 148, 160, 0.4);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  margin: 0 8px;

  &:hover {
    cursor: pointer;
  }
`;

interface OrderBasicFormState {
  action: string;
}

class OrderMarket extends React.Component<
  OrderBasicFormProps & FormikProps<{}>,
  OrderBasicFormState
> {
  private isInverted: boolean = false;
  private previousPropsAction: string;

  constructor(props: OrderBasicFormProps & FormikProps<{}>) {
    super(props);

    this.state = {
      action: this.props.action
    };
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.previousPropsAction !== nextProps.action) {
      this.setState({
        action: nextProps.action
      });
      this.isInverted = false;
      this.updateInvertedValues(nextProps.action);
    }
  }

  updateInvertedValues = (action: any) => {
    this.props.setValues({
      invertedAction: action,
      isInverted: this.isInverted
    });
  };

  onInvert = () => {
    this.isInverted = !this.isInverted;
    const action = !this.isInverted
      ? this.props.action
      : this.state.action === orderAction.sell.action
        ? orderAction.buy.action
        : orderAction.sell.action;
    this.setState({
      action
    });
    this.updateInvertedValues(action);
  };

  reset = () => {
    this.setState({
      action: this.props.action
    });
    this.isInverted = false;
    this.updateInvertedValues(null);
    this.props.onReset();
  };

  handlePercentageChange = (index: number) => () => {
    this.props.onHandlePercentageChange(index)(this.isInverted);
  };

  render() {
    const baseName = this.props.assetName.split('/')[0];
    const quoteName = this.props.assetName.split('/')[1];
    this.previousPropsAction = this.props.action;

    return (
      <div>
        <div>
          <div>
            <div style={{width: '75%'}}>
              <Flex justify="space-between">
                <StyledActionTitle>
                  {this.state.action} {!this.isInverted ? baseName : quoteName}
                </StyledActionTitle>
                <div>
                  {this.props.balance}{' '}
                  {this.props.isSell ? baseName : quoteName} available
                </div>
              </Flex>
            </div>
          </div>
          <Flex>
            <StyledInputControl style={{width: '75%'}}>
              <NumberInput
                value={this.props.quantity}
                id={'quantityValue'}
                onChange={this.props.onChange(this.props.quantityAccuracy)}
                onArrowClick={this.props.onArrowClick(
                  this.props.quantityAccuracy
                )}
              />
            </StyledInputControl>
            <Flex align={'center'}>
              <StyledInvertedBtn onClick={this.onInvert} />
              <Box>{this.isInverted ? baseName : quoteName}</Box>
            </Flex>
          </Flex>
          <div style={{width: '75%'}}>
            <Flex justify={'space-between'} style={{width: '100%'}}>
              {this.props.percents!.map((item: any, index: number) => (
                <OrderPercentage
                  percent={item.percent}
                  key={index}
                  onClick={this.handlePercentageChange(index)}
                  isActive={item.isActive}
                />
              ))}
            </Flex>
          </div>
        </div>
        <StyledOrderButton>
          <OrderButton
            action={this.props.action}
            isDisable={this.props.isDisable}
            type={'submit'}
            message={`${capitalize(this.state.action)} ${this.props.quantity} ${
              !this.isInverted ? baseName : quoteName
            }`}
          />
        </StyledOrderButton>
        <StyledReset justify={'center'}>
          <span onClick={this.reset}>Reset and clear</span>
        </StyledReset>
      </div>
    );
  }
}

const OrderMarketForm: React.SFC<OrderBasicFormProps & FormikProps<{}>> = (
  props: OrderBasicFormProps & FormikProps<{}>
) => {
  return (
    <Form>
      <OrderMarket {...props} />
    </Form>
  );
};

export default withFormik<OrderBasicFormProps, {}>({
  handleSubmit: (values: any, {props}) => {
    const {action, assetName} = props;
    const baseName = assetName.split('/')[0];
    const quoteName = assetName.split('/')[1];
    const {invertedAction, isInverted} = values;
    props.onSubmit(
      invertedAction || action,
      isInverted ? quoteName : baseName,
      isInverted ? baseName : quoteName
    );
  }
})(OrderMarketForm);
