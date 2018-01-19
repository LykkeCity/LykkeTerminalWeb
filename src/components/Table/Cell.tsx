import styled from '../styled';

const Cell = (colNumber: number) => {
  return styled.div`
    width: ${100 / colNumber}%;
  `;
};

export default Cell;
