import * as React from 'react';
import CloseButton from '../CloseButton/CloseButton';
import {SessionDurationSelection} from '../Settings';
import {Body, CloseBtnPosition, SessionSettings} from './styles';

interface SettingsProps {
  onSettingsClose: () => void;
}

const Settings: React.SFC<SettingsProps> = ({onSettingsClose}) => {
  return (
    <SessionSettings>
      <CloseButton
        onClose={onSettingsClose}
        top={CloseBtnPosition.top}
        right={CloseBtnPosition.right}
      />
      <Body>Change the duration of sessions</Body>
      <SessionDurationSelection />
    </SessionSettings>
  );
};

export default Settings;
