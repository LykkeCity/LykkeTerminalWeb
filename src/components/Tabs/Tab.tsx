import React from 'react';
import {StyledTab} from './styles';

export interface TabProps {
  title: string;
}

const Tab: React.SFC<TabProps> = ({children, title}) => {
  return <StyledTab>{children}</StyledTab>;
};

export default Tab;
