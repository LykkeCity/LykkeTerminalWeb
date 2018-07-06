import {rem, rgb} from 'polished';
import styled, {colors} from '../styled';

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 8px;
  top: calc(50% - 44px);
  left: calc(50% - 44px);

  width: ${rem(88)};
  height: ${rem(88)};
  background: ${rgb(17, 17, 17)};
  opacity: 0.8;
  z-index: 99;
`;

export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: ${(props: {back: string | undefined}) =>
    props.back || colors.lightGraphite};
`;

export const CommonLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: calc(50% - 75px);
  left: calc(50% - 150px);

  width: ${rem(300)};
  height: ${rem(150)};
  z-index: 99;
`;

export const LoadingDescription = styled.div`
  align-self: flex-end;
`;
