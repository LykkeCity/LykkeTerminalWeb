import * as React from 'react';
import Icons from '../../constants/icons';
import {IconContainer, Img, StyledIcon} from './styles';

interface IconProps {
  name: string;
  color?: string;
  opacity?: any;
}

// TODO: temporary solution with font-awesome icons
export const FAIcon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`fa fa-${name}`} aria-hidden="true" />
);

const Icon = ({name, opacity}: IconProps) => (
  <IconContainer className={'icon'} opacity={opacity}>
    <Img
      src={`assets/icons/${Icons[name].src}.svg`}
      alt={Icons[name].title}
      title={Icons[name].title}
    />
  </IconContainer>
);

export default Icon;
