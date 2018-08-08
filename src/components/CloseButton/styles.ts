import {rem} from 'polished';
import styled from 'styled-components';

export const Button = styled.a.attrs({
  style: (props: any) =>
    ({
      top: `${rem(props.top)}`,
      right: `${rem(props.right)}`
    } as any)
})`
  color: ${props => props.theme.colors.closeButton};
  text-decoration: none;
  cursor: pointer;
  font-size: ${rem(20)};
  position: absolute;
  opacity: 0.8;
` as any;
