import {rem} from 'polished';
import styled from 'styled-components';

export const Item = styled.div`
  color: #f5f6f7;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25%;
  padding: ${rem(8)} 0;
  border: 1px solid transparent;
  font-size: ${rem(14)};
  display: flex;
  justify-content: center;

  div {
    border-left: 1px solid rgba(140, 148, 160, 0.4);
    width: 100%;
    text-align: center;
  }

  &.active {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;

    div {
      border-left: 1px solid transparent;
    }
  }

  &:first-child {
    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover,
  &.active + div:hover {
    border: 1px solid rgba(140, 148, 160, 0.4);
    border-left: 1px solid rgba(140, 148, 160, 0.4);
    border-radius: 4px;
    cursor: pointer;

    div {
      border-left: 1px solid transparent;
    }
  }

  &:hover + div,
  &.active + div {
    div {
      border-left: 1px solid transparent;
    }
  }
`;
