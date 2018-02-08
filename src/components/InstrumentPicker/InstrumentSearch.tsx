import {rem} from 'polished';
import * as React from 'react';
import styled from '../styled';
import {InstrumentPickerActions} from './index';

// tslint:disable-next-line:no-var-requires
const {Box} = require('grid-styled');

interface InstrumentSearchProps extends InstrumentPickerActions {
  className?: string;
  inputValue: string;
  change: any;
}

const InstrumentSearch: React.SFC<InstrumentSearchProps> = ({
  className,
  inputValue = '',
  change
}) => (
  <Box className={className}>
    <input
      value={inputValue}
      type="search"
      placeholder="Search instrument..."
      // tslint:disable-next-line:jsx-no-lambda
      onChange={e => change(e.currentTarget.value)}
    />
  </Box>
);

const StyledInstrumentSearch = styled(InstrumentSearch)`
  & > input {
    background-color: rgb(51, 51, 51);
    border-radius: 4px;
    border: solid 2px #333;
    color: #f5f6f7;
    padding: ${rem(10)};
    width: 100%;
    &:active {
      border: solid 2px rgb(3, 136, 239);
    }
  }
`;

export default StyledInstrumentSearch;
