import * as React from 'react';
import {formattedNumber} from '../../utils/localFormatted/localFormatted';
import {FormattedNumberProps} from './index';

const FormattedNumber: React.SFC<FormattedNumberProps> = ({
  value,
  accuracy
}) => {
  if (!accuracy) {
    return <span>{formattedNumber(value)}</span>;
  } else {
    return <span>{formattedNumber(value, accuracy)}</span>;
  }
};
export default FormattedNumber;
