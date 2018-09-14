import {rem} from 'polished';
import * as React from 'react';
import {IconContext} from 'react-icons';
import {FiSearch} from 'react-icons/fi';
import {AnalyticsEvents} from '../../constants/analyticsEvents';
import {AnalyticsService} from '../../services/analyticsService';
import styled, {colors} from '../styled';
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
    <IconContext.Provider value={{size: '1.2rem', color: colors.coolGrey}}>
      <FiSearch />
    </IconContext.Provider>
    <input
      value={inputValue}
      type="search"
      placeholder="Type to search instrument..."
      // tslint:disable-next-line:jsx-no-lambda
      onChange={(event: any) => {
        change(event.currentTarget.value);

        AnalyticsService.track(
          AnalyticsEvents.InstrumentPickerSearch(event.currentTarget.value)
        );
      }}
    />
  </Box>
);

const StyledInstrumentSearch = styled(InstrumentSearch)`
  width: 250px;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  & > svg {
    margin: 0 2% 0 4%;
    width: 8%;
    vertical-align: text-bottom;
    cursor: default;
  }
  & > input {
    background-color: #3c3c3c;
    border: solid 2px transparent;
    border-radius: 4px;
    color: ${colors.coolGrey};
    padding: ${rem(6)};
    width: 86%;
    font-size: 14px;

    &:focus {
      border: solid 2px rgb(3, 136, 239);
    }
    &::placeholder {
      color: ${colors.coolGrey};
    }
  }
`;

export default StyledInstrumentSearch;
