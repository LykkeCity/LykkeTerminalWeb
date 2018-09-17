import * as React from 'react';
import {Icons} from '../../models';
import {StyledIcon} from './styles';

interface IconProps {
  name: string;
  color?: string;
}

const Icon = ({name, color}: IconProps) => (
  <StyledIcon
    color={color}
    className={`icon icon-${name}`}
    title={Icons[name]}
  />
);

export default Icon;
