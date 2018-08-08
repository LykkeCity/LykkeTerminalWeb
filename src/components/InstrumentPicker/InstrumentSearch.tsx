import {rem} from 'polished';
import * as React from 'react';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AnalyticsService} from '../../services/analyticsService';
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
    <Icon name={'search'} />
    <input
      value={inputValue}
      type="search"
      placeholder="Type to search instrument..."
      // tslint:disable-next-line:jsx-no-lambda
      onChange={e => {
        change(e.currentTarget.value);

        AnalyticsService.handleClick(
          AnalyticsEvents.InstrumentPickerSearch(e.currentTarget.value)
        );
      }}
    />
  </Box>
);

const StyledInstrumentSearch = styled(InstrumentSearch)`
  width: 250px;
  border-left: 1px solid ${props => props.theme.colors.barBackground};
  & > i.icon {
    display: inline-block;
    margin-left: 4%;
    width: 8%;
    text-align: center;
    cursor: default;
  }
  & > input {
    background-color: transparent;
    border: solid 2px transparent;
    border-radius: 4px;
    color: ${props => props.theme.colors.instrumentSearchText};
    padding: ${rem(6)};
    width: 88%;
    font-size: 14px;

    &:focus {
      border: solid 2px rgb(3, 136, 239);
    }
    &::placeholder {
      color: ${props => props.theme.colors.instrumentSearchText};
    }
  }
`;

export default StyledInstrumentSearch;
