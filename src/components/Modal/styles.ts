import {rem} from 'polished';
import styled from 'styled-components';

export const Modal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: 20px 25px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  border-radius: 12px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 30;
  min-width: 360px;
`;

export const Button = styled.button`
  color: #f5f6f7;
  width: 152px;
  height: 49px;
  border-radius: 4px;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export const ModalContent = styled.div`
  margin-top: 16px;
  width: 312px;
  font-size: 14px;
  line-height: 1.5;
`;

export const ModalReminder = styled.div`
  font-size: 14px;
  line-height: 1.5;
  margin-top: 16px;
`;

export const ApplyButton = styled(Button)`
  background-color: #0388ef;
  border: solid 1px #0388ef;
`;

export const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

export const QRButton = styled(CancelButton)`
  width: 100%;
`;

export const Expired = styled(Modal)`
  width: 300px;
  text-align: center;
  div {
    margin-top: 15px;
  }
`;

export const StyledButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
  margin: 20px 0 5px 0;
`;

export const ModalBody = styled.div`
  margin-top: ${rem(15)};
  line-height: 1.5;
`;

export const ModalTitle = styled.div`
  font-size: ${rem(20)};
  font-weight: 600;
`;

export const SessionExpiredImage = styled.div`
  background: url('assets/images/session_confirm.png') no-repeat center;
  height: 200px;
`;
