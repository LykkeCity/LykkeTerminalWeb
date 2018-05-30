import * as React from 'react';
import {Icons} from '../../models';
import {StyledIcon} from './styles';

interface IconProps {
  name: string;
  color?: string;
}

// TODO: temporary solution with font-awesome icons
export const FAIcon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`fa fa-${name}`} aria-hidden="true" />
);

const Icon = ({name, color}: IconProps) => (
  <StyledIcon
    color={color}
    className={`icon icon-${name}`}
    title={Icons[name]}
  />
);

export default Icon;
