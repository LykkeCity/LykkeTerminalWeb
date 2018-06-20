import * as React from 'react';
import {Icons} from '../../models';
import styled from '../styled';
import {StyledIcon} from './styles';

interface IconProps {
  name: string;
  color?: string;
}

const StyledIconContainer = styled.div`
  float: right;
`;

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

// Parent element required to re-render SVG when we change it's state
export const DynamicFAIcon = ({name, color}: IconProps) => (
  <StyledIconContainer>
    <FAIcon name={name} color={color} />
  </StyledIconContainer>
);

export default Icon;
