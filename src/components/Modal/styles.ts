import {rem} from 'polished';
import styled from 'styled-components';
import {Button} from './index';
import ModalHeader from './ModalHeader/ModalHeader';

export const StyledModalHeader = styled(ModalHeader)`
  font-size: ${rem(24)};
`;

export const StyledText = styled.div`
  margin-top: 16px;
  width: 312px;
  font-size: ${rem(16)};
  font-family: Proxima Nova;
  line-height: 1.5;
`;

export const StyledApplications = styled.div`
  margin-top: 16px;
  width: 312px;
`;

export const StyledAppStore = styled.div`
  display: block;
  background: url('assets/images/app-store.png') no-repeat center;
  height: 48px;
  width: 152px;
  float: left;
`;

export const StyledGooglePlay = styled.div`
  display: block;
  margin-left: 156px;
  background: url('assets/images/google-play.png') no-repeat center;
  height: 48px;
  width: 152px;
`;

export const StyledButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
  margin: 24px 0 8px 0;
  width: 312px;
`;
