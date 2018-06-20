import * as React from 'react';
import ChoosableItem from '../ChoosableItem/ChoosableItem';
import {SessionDurations} from './styles';

const sessionDuration = [0.5, 1, 4, 12, 24];

const MINUTE_ABBREVIATION = 'min';
const HOUR_ABBREVIATION = 'hr';

interface SessionDurationSelectionProps {
  className?: string;
  closeSessionNotification: () => void;
  handleSetDuration: (value: number) => {};
  sessionCurrentDuration: number;
}

const getFormattedSessionDuration = (value: number) => {
  return value < 1 ? value * 60 : value;
};

const getAbbreviation = (value: number) => {
  return value < 1 ? MINUTE_ABBREVIATION : HOUR_ABBREVIATION;
};

const SessionDurationSelection: React.SFC<SessionDurationSelectionProps> = ({
  className,
  closeSessionNotification,
  handleSetDuration,
  sessionCurrentDuration
}) => {
  return (
    <SessionDurations className={className}>
      {sessionDuration.map((item: number, index: number) => (
        <ChoosableItem
          key={index}
          value={getFormattedSessionDuration(item)}
          description={getAbbreviation(item)}
          isActive={sessionCurrentDuration === item}
          // tslint:disable-next-line:no-empty
          // tslint:disable-next-line:jsx-no-lambda
          onClick={() => {
            if (sessionCurrentDuration !== item) {
              handleSetDuration(item);
              closeSessionNotification();
            }
          }}
        />
      ))}
    </SessionDurations>
  );
};

export default SessionDurationSelection;
