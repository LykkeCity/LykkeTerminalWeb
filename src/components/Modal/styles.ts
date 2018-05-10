import {rem} from 'polished';
import styled, {colors, greyButton} from '../styled';

export const StyledKycModalHeader = styled.div`
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

export const Modal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: ${rem(20)} ${rem(25)};
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  border-radius: 12px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 30;
  min-width: ${rem(360)};
`;

export const SessionQRConfirm = styled(Modal)`
  box-sizing: border-box;
  padding: ${rem(24)};
`;

export const Button = styled.button`
  color: ${colors.white};
  width: ${rem(152)};
  height: ${rem(49)};
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
  border: solid 1px ${greyButton.borderColor};
`;

export const OkButton = styled(CancelButton)`
  margin: ${rem(20)} 0 0 0;
  width: 100%;
`;

export const QRButton = styled(CancelButton)`
  width: 100%;
  font-weight: bold;
  line-height: 1;
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
  width: 100%;
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
  height: ${rem(200)};
`;

export const QRBody = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${rem(41)};
  margin-bottom: ${rem(64)};
`;

/*hack for ios mobile*/
export const QRCodeWrapper = styled.div`
  border: 2px solid #fff;
  width: ${rem(160 / 14 * 16)};
  height: ${rem(160 / 14 * 16)};
  box-sizing: content-box;
`;

export const ModalHeaderTitle = styled.div`
  font-family: 'Akrobat';
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 0.67;
  text-align: left;
`;

export const EditModal = styled.div.attrs({
  style: (props: any) => ({
    borderTop: `${rem(6)} solid ${
      props.isSell ? colors.brightViolet : colors.brightMango
    }`
  })
})`
  border-radius: ${rem(6)};
  font-family: Proxima Nova;
  position: absolute;
  padding: ${rem(20)} ${rem(24)};
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  background-color: ${colors.grey};
  border: solid 1px ${colors.darkGraphite};
  z-index: 31;
  width: ${rem(360)};
  font-size: ${rem(14)};
` as any;

export const EditTitle = styled.div`
  font-family: 'Akrobat', sans-serif;
  font-size: ${rem(24)};
  font-weight: bold;
  line-height: 0.67;
  margin-top: ${rem(12)};
  margin-bottom: ${rem(12)};
`;

export const EditActionTitle = styled.div.attrs({
  style: (props: any) => ({
    color: props.isSell ? colors.violet : colors.brightMango
  })
})`
  text-transform: uppercase;
  font-size: ${rem(12)};
  letter-spacing: ${rem(1.5)};
` as any;

export const CloseBtnPosition = {
  top: 10,
  right: 16
};

export const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MarginedModalBody = styled(ModalBody)`
  margin: ${rem(15)} 0;
`;

export const MobileAppLink = styled.a.attrs({
  style: (props: any) => ({
    backgroundImage: `url('assets/images/${props.image}.png')`,
    cursor: 'pointer'
  })
})`
  width: 49%;
  height: ${rem(42)};
  background: no-repeat center;
  background-size: cover;
  border-radius: ${rem(6)};
  text-decoration: none;
` as any;

export const ModalWrapper = styled(Modal)`
  width: ${rem(300)};
`;

export const CoveringBack = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  background: ${colors.lightGraphite};
`;
