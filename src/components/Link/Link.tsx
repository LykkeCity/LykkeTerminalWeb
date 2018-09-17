import styled from '../styled';

const Link = styled.a`
  color: ${props => props.theme.colors.defaultText};
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`;

export default Link;
