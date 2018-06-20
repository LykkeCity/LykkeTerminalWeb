import * as React from 'react';
import {Tab} from '../../Tabs';
import {BaseAssetSelection} from '../index';
import {SettingsList, SettingsListItem, SettingsListItemTitle} from '../styles';

interface ProfileTabProps {
  title: string;
}

const ProfileTab: React.SFC<ProfileTabProps> = ({title}) => {
  return (
    <Tab title={title}>
      <SettingsList>
        <SettingsListItem>
          <SettingsListItemTitle>Base asset</SettingsListItemTitle>
          <BaseAssetSelection />
        </SettingsListItem>
      </SettingsList>
    </Tab>
  );
};

export default ProfileTab;
