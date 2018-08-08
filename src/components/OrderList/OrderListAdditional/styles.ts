import {rem} from 'polished';
import styled, {dims, fonts, padding} from '../../styled';

export const CancelAllButton = styled.span`
  font-size: ${rem(fonts.normal)};
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #ccc;
  color: #8c94a0;
  padding: ${padding(...dims.padding)};
  cursor: not-allowed;

  &.clickable {
    color: ${props => props.theme.colors.text};
    cursor: pointer;
  }
` as any;
