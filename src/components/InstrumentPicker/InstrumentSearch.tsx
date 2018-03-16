import {rem} from 'polished';
import * as React from 'react';
import {Icon} from '../Icon/index';
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
    <Icon color={`rgba(245, 246, 247, 0.4)`} name={`search`} />
    <input
      value={inputValue}
      type="search"
      placeholder="Type to search instrument..."
      // tslint:disable-next-line:jsx-no-lambda
      onChange={e => change(e.currentTarget.value)}
    />
  </Box>
);

const StyledInstrumentSearch = styled(InstrumentSearch)`
  width: 250px;
  & > i.icon {
    display: inline-block;
    width: 10%;
  }
  & > input {
    background-color: #3c3c3c;
    border: solid 2px transparent;
    border-radius: 4px;
    color: rgba(245, 246, 247, 0.4);
    padding: ${rem(10)};
    width: 90%;
    font-size: 14px;
    &:focus {
      border: solid 2px rgb(3, 136, 239);
    }
  }
`;

export default StyledInstrumentSearch;
