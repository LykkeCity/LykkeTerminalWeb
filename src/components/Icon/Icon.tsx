import * as React from 'react';
import Icons from '../../constants/icons';
import {IconContainer, Img, StyledIcon} from './styles';

interface IconProps {
  name: string;
  color?: string;
}

// TODO: temporary solution with font-awesome icons
export const FAIcon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`fa fa-${name}`} aria-hidden="true" />
);

const Icon = ({name}: IconProps) => (
  <IconContainer className={'icon'}>
    <Img
      src={`assets/icons/${Icons[name].src}.png`}
      alt={Icons[name].title}
      title={Icons[name].title}
    />
  </IconContainer>
);

export default Icon;
