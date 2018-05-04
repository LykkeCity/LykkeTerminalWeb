import React from 'react';
import {Cell} from './styles';

export const withTitle = (Component: React.ComponentType<any>) => ({
  children,
  ...rest
}: any) => (
  <Component title={React.Children.toArray(children).join('')} {...rest}>
    {children}
  </Component>
);

export default withTitle(Cell);
