import * as React from 'react';
import styled from 'styled-components';
import CustomScrollbar from '../CustomScrollbar/CustomScrollbar';

const StyledSelect = styled.div`
  position: absolute;
  border: 1px solid #f5f6f7;
  z-index: 10;
  background-color: rgb(60, 60, 60);
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  border: solid 1px rgba(0, 0, 0, 0.2);
  text-align: left;
  overflow: hidden;
`;

const StyledList = styled.div`
  overflow: auto;

  & > li {
    cursor: pointer;
    font-size: 1rem;
    margin-top: 10px;
    padding: 0.625rem;

    &:hover {
      background: #494949;
    }
  }
`;

interface CustomSelectProps {
  items: any[];
  click: any;
  styles?: any;
}

const CustomSelect: React.SFC<CustomSelectProps> = ({
  items = [],
  click,
  styles
}) => {
  return (
    <StyledSelect style={styles}>
      <CustomScrollbar styles={{height: '100%'}}>
        <StyledList>
          {items.map((item: any) => {
            return (
              <li key={item.value} onClick={click(item.value)}>
                {item.label}
              </li>
            );
          })}
        </StyledList>
      </CustomScrollbar>
    </StyledSelect>
  );
};

export default CustomSelect;
