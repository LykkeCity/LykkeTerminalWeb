import styled from 'styled-components';
import ModalModel from '../../models/modalModel';

const StyledModal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: 20px 25px;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  border-radius: 12px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  z-index: 3;
`;

const Button = styled.button`
  color: #f5f6f7;
  width: 152px;
  height: 49px;
  border-radius: 4px;
  outline: none;

  &:hover {
    cursor: pointer;
  }
`;

export interface ConfirmModalProps {
  modal: ModalModel;
}

export interface ModalProps {
  modals: ModalModel[];
}

export {StyledModal, Button};
