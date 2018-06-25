import React from 'react';
import styled, {colorFromSide} from '../styled';
import {Cell} from './styles';

export const Colored = styled.div`
  ${(side: string) => colorFromSide(side)};
` as any;

export const withTitle = (Component: React.ComponentType<any>) => ({
  children,
  side,
  ...rest
}: any) => (
  <Component title={React.Children.toArray(children).join('')} {...rest}>
    <Colored side={side}>{children}</Colored>
  </Component>
);

export default withTitle(Cell);
