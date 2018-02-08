import {borderRadius, rem} from 'polished';
import styled from 'styled-components';

const allSides = ['top', 'right', 'bottom', 'left'];

const Button = styled.button`
  font-weight: 600;
  font-size: ${rem(15)};
  background: #0da7fc;
  color: #f5f6f7;
  cursor: pointer;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;
  display: inline-block;
  border: 0;
  text-decoration: none;

  padding: ${rem(9)} ${rem(20)};
  min-width: ${rem(112)};

  white-space: nowrap;
  user-select: none;
  outline-style: none;
  text-decoration: none;

  ${allSides.map(s => borderRadius(s, '100px')) as any};
  box-shadow: none;

  white-space: nowrap;
  user-select: none;
  outline-style: none;
`;

export default Button;
