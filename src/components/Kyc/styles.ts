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
  left: 0px;
  right: 0px;
  width: 100%;
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
  flex-direction: column;
`;

export const Text = styled.div`
  margin-top: ${rem(10)};
`;

DisabledContainer.displayName = 'DisabledContainer';
NotVerifiedContainer.displayName = 'NotVerifiedContainer';
Link.displayName = 'Link';
Centered.displayName = 'Centered';
