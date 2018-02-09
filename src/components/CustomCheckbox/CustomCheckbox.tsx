import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  display: block;
  position: relative;
  padding-left: 30px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: ${rem(14)};
  line-height: 1.43;
  text-align: left;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  > input:checked {
    ~ span:after {
      display: block;
    }
  }
`;

const StyledCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const StyledCustomCheckbox = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  /* border: solid 1px rgba(140, 148, 160, 0.4); */
  background-color: transparent;

  &:after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

const CustomCheckbox: React.SFC<{
  label: string;
  change?: any;
  checked?: boolean;
}> = ({label, change, checked}) => {
  return (
    <div>
      <StyledLabel>
        {label}
        <StyledCheckbox
          type="checkbox"
          defaultChecked={checked}
          onChange={change}
        />
        <StyledCustomCheckbox />
      </StyledLabel>
    </div>
  );
};

export default CustomCheckbox;
