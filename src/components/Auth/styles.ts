import rem from 'polished/lib/helpers/rem';
import styled, {colors} from '../styled';

export const Link = styled.a`
  color: ${colors.blue};
  cursor: pointer;
  text-decoration: underline;
`;

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const AuthWrap = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #000;
  font-size: ${rem(32)};
`;


Link.displayName = 'Link';
Centered.displayName = 'Centered';
