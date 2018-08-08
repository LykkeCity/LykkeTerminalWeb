import {Tabs} from '@lykkex/react-components';
import {rem} from 'polished';
import {Modal, ModalContent} from '../Modal/styles';
import styled from '../styled';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const StyledSettingsModal = styled(Modal)`
  min-width: ${rem(585)};
  padding: ${rem(29)} ${rem(28)};
  background-color: ${props => props.theme.colors.modalBackground};
`;

export const SettingsModalContent = styled(ModalContent)`
  width: 100%;
`;

export const StyledTabs = styled(Tabs)`
  margin-top: ${rem(16)};

  .tabs-labels {
    color: ${props => props.theme.colors.inactiveItemText};
    padding-top: ${rem(13)};

    .tab-label.active {
      color: ${props => props.theme.colors.activeItemText};
      font-weight: 600;
      border-bottom-color: ${props => props.theme.colors.activeItemBorder};
    }
  }
`;

export const SettingsList = styled.div`
  padding: 0;
  margin: 0;
`;

export const SettingsListItem = styled.div`
  margin-top: ${rem(27)};
`;

export const SettingsListItemTitle = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 0.67;
  text-align: left;
  margin-bottom: ${rem(15)};
`;

export const SessionDurations = styled(Flex)`
  margin-top: ${rem(19)};
`;

export const StyledConfirmationSetting = styled.div`
  display: inline-block;
  color: ${props => props.theme.colors.text};

  .switcher-container {
    color: inherit;
  }
`;
