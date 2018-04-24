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
  min-width: ${rem(360)};
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

export const CancelButton = styled(Button)`
  background: transparent;
  border: solid 1px rgba(140, 148, 160, 0.4);
`;

export const GotButton = styled(CancelButton)`
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
  top: 5,
  right: 25
};

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const MarginedModalBody = styled(ModalBody)`
  margin: ${rem(15)} 0;
`;

export const ImgLink = styled.a.attrs({
  style: (props: any) => ({
    backgroundImage: `url('assets/images/${props.image}.svg')`,
    cursor: 'pointer'
  })
})`
  width: 49%;
  height: ${rem(45)};
  background: no-repeat center;
  background-size: cover;
  border-radius: ${rem(6)};
  text-decoration: none;
` as any;

export const ModalWrapper = styled(Modal)`
  width: ${rem(300)};
`;
