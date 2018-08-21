import {rem} from 'polished';
import {Modal, ModalContent} from '../Modal/styles';
import styled, {colors} from '../styled';
// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

export const StyledSettingsModal = styled(Modal)`
  min-width: ${rem(585)};
  padding: ${rem(29)} ${rem(28)};
  background-color: ${colors.graphiteBackground};
`;

export const SettingsModalContent = styled(ModalContent)`
  width: 100%;
`;

export const SettingsList = styled.div`
  padding: 0;
  margin: 0;
`;

export const SettingsListItem = styled.div`
  margin-top: ${rem(27)};
`;

export const SettingsListItemTitle = styled.div`
  line-height: 0.67;
  text-align: left;
  margin-bottom: ${rem(15)};
`;

export const SessionDurations = styled(Flex)`
  margin-top: ${rem(19)};
`;

export const StyledConfirmationSetting = styled.div`
  display: inline-block;

  .switcher-container {
    color: inherit;
  }
`;
