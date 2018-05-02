import {rem} from 'polished';
import styled, {colors, greyButton} from '../styled';

export const Modal = styled.div`
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

export const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px ${greyButton.borderColor};
`;

export const OkButton = styled(CancelButton)`
  margin: ${rem(20)} 0 0 0;
  width: 100%;
`;

export const ModalBody = styled.div`
  margin-top: ${rem(15)};
  line-height: 1.5;
`;

export const ModalHeaderTitle = styled.div`
  font-family: 'Akrobat';
  font-size: ${rem(20)};
  font-weight: bold;
  line-height: 0.8;
  text-align: left;
`;

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
