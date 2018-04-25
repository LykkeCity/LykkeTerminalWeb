import * as React from 'react';
import {ActionButton, ActionProperty} from './styles';

interface ActionChoiceButtonProps {
  title: string;
  click: any;
  isActive: boolean;
}

const ActionChoiceButton: React.SFC<ActionChoiceButtonProps> = ({
  title,
  click,
  isActive
}) => (
  <ActionButton side={title}>
    <ActionProperty onClick={click} side={title} isActive={isActive}>
      {title}
    </ActionProperty>
  </ActionButton>
);

export default ActionChoiceButton;
