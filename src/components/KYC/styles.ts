import {rem} from 'polished';
import styled from '../styled';

export const DisabledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.2;
  cursor: default;
`;

export const NotVerifiedContainer = styled.div`
  position: absolute;
  top: 50%;
  left: calc(50% - 105px);
`;

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none;
  font-size: ${rem(14)};
  border-radius: 3px;
  padding-left: ${rem(14)};
  padding-right: ${rem(14)};
  margin-right: ${rem(6)};
`;

export const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

DisabledContainer.displayName = 'DisabledContainer';
NotVerifiedContainer.displayName = 'NotVerifiedContainer';
Link.displayName = 'Link';
Centered.displayName = 'Centered';
