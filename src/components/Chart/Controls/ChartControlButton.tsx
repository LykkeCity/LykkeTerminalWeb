import React from 'react';
import {ChartControlButtonType} from '../../../models';
import {Icon} from '../../Icon';
import {DynamicFAIcon} from '../../Icon/Icon';
import {colors} from '../../styled';
import {ButtonContent} from '../styles';

export interface ChartControlButtonProps {
  controlButtonName: string;
  controlButtonType: ChartControlButtonType;
  onClick: () => void;
  withCarret?: boolean;
}

const ChartControlButton: React.SFC<ChartControlButtonProps> = ({
  controlButtonName,
  controlButtonType,
  onClick,
  withCarret = true
}) => {
  const buttonContent = () => {
    switch (controlButtonType) {
      default:
      case ChartControlButtonType.Image:
        return <Icon name={controlButtonName} color={colors.whiteText} />;
      case ChartControlButtonType.Text:
        return controlButtonName;
    }
  };

  return (
    <div onClick={onClick}>
      <ButtonContent>{buttonContent()}</ButtonContent>
      {withCarret && (
        <DynamicFAIcon
          name={'caret-down'}
          key={'caret-down'}
          color={colors.coolGrey}
        />
      )}
    </div>
  );
};

export default ChartControlButton;
