import styled from '../styled';

export const Link = styled.a`
  color: #0388ef;
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

Link.displayName = 'Link';
Centered.displayName = 'Centered';
