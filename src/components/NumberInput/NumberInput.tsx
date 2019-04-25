import * as React from 'react';
import ArrowDirection from '../../models/arrowDirection';
import {getLocaleSeparators} from '../../utils/inputNumber';
import {StyledInput, StyledInputNumberComponent} from './styles';

interface NumberInputProps {
  id?: string;
  value?: string;
  onChange: any;
  onArrowClick: (direction: ArrowDirection) => () => void;
}

const NumberInput: React.SFC<NumberInputProps> = ({
  id,
  value,
  onChange,
  onArrowClick
}) => {
  const separators = getLocaleSeparators();

  return (
    <StyledInputNumberComponent>
      <StyledInput
        id={id}
        type="text"
        value={value}
        autocomplete="off"
        placeholder="0.0"
        allowNegative={false}
        isNumericString={true}
        thousandSeparator={separators.thousandsSeparator}
        decimalSeparator={separators.decimalSeparator}
        thousandsGroupStyle={separators.thousandsGroupStyle}
        // tslint:disable-next-line:jsx-no-lambda
        onValueChange={(values: any) =>
          onChange()({target: {value: values.value}})
        }
        // tslint:disable-next-line:jsx-no-lambda
        onKeyDown={(e: any) => {
          switch (e.keyCode) {
            case 38:
              onArrowClick(ArrowDirection.Up)();
              e.preventDefault();
              break;
            case 40:
              onArrowClick(ArrowDirection.Down)();
              e.preventDefault();
              break;
            default:
              break;
          }
        }}
        name={value}
      />
    </StyledInputNumberComponent>
  );
};

export default NumberInput;
