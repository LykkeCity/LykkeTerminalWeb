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

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Body = styled.div`
  line-height: 1.5;
  text-align: left;
`;

export const MarginedBody = styled(Body)`
  margin: ${rem(15)} 0;
`;

export const Title = styled.div`
  font-size: ${rem(20)};
  font-weight: 600;
`;

export const ImgLink = styled.a.attrs({
  style: (props: any) => ({
    backgroundImage: `url('assets/images/${props.image}.svg')`,
    cursor: 'pointer'
  })
})`
  width: 49%;
  height: 45px;
  background: no-repeat center;
  background-size: cover;
  margin: 20px 0 0 0;
  text-decoration: none;
` as any;

export const AttentionWrapper = styled(Modal)`
  width: 300px;
  text-align: center;
`;
