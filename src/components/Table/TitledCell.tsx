import React from 'react';
import {Cell} from './styles';

const withTitle = (Component: React.ComponentType<any>) => ({
  children,
  ...rest
}: any) => (
  <Component title={React.Children.toArray(children).join('')} {...rest}>
    {children}
  </Component>
);

export const TitledCell = withTitle(Cell);
