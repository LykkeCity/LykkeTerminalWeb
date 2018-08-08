import {MarginedModalBody} from '../Modal/styles';

export const CheckBody = MarginedModalBody.extend`
  a {
    color: ${props => props.theme.colors.linkText};
  }
`;
