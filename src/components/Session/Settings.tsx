import * as React from 'react';
import ChoosableItem from '../ChoosableItem/ChoosableItem';
import CloseButton from '../CloseButton/CloseButton';
// tslint:disable-next-line:ordered-imports
import {
  Body,
  CloseBtnPosition,
  SessionDurations,
  SessionSettings
} from './styles';

const sessionDuration = [5, 15, 30, 60];

const HOUR = 60;
const MINUTE_ABBREVIATION = 'min';
const HOUR_ABBREVIATION = 'hr';

interface SettingsProps {
  onSettingsClose: () => void;
  handleDurationClick: (value: number) => {};
  getCurrentSessionDuration: number;
}

const Settings: React.SFC<SettingsProps> = ({
  onSettingsClose,
  handleDurationClick,
  getCurrentSessionDuration
}) => {
  return (
    <SessionSettings>
      <CloseButton
        onClose={onSettingsClose}
        top={CloseBtnPosition.top}
        right={CloseBtnPosition.right}
      />
      <Body>Change the duration of sessions</Body>
      <SessionDurations>
        {sessionDuration.map((item: number, index: number) => (
          <ChoosableItem
            key={index}
            value={item}
            description={
              item === HOUR ? HOUR_ABBREVIATION : MINUTE_ABBREVIATION
            }
            isActive={getCurrentSessionDuration === item}
            // tslint:disable-next-line:no-empty
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => handleDurationClick(item)}
          />
        ))}
      </SessionDurations>
    </SessionSettings>
  );
};

export default Settings;
