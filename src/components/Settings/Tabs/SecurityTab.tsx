import {Tab} from '@lykkex/react-components';
import * as React from 'react';
import {ConfirmationWindowSetting, SessionDurationSelection} from '../index';
import {SettingsList, SettingsListItem, SettingsListItemTitle} from '../styles';

interface ProfileTabProps {
  title: string;
}

const SecurityTab: React.SFC<ProfileTabProps> = ({title}) => {
  return (
    <Tab title={title}>
      <SettingsList>
        <SettingsListItem>
          <SettingsListItemTitle>Session</SettingsListItemTitle>
          <SessionDurationSelection />
        </SettingsListItem>
        <SettingsListItem>
          <SettingsListItemTitle>Confirm window</SettingsListItemTitle>
          <ConfirmationWindowSetting />
        </SettingsListItem>
      </SettingsList>
    </Tab>
  );
};

export default SecurityTab;
