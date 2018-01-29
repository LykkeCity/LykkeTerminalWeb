import * as React from 'react';
import styled from 'styled-components';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {SettingsModalProps} from './index';

const StyledModal = styled.div`
  font-family: Proxima Nova;
  position: absolute;
  padding: 10px 15px;
  top: 100%;
  right: 0;
  width: 230px;
  border-radius: 10px;
  background-color: #3c3c3c;
  border: solid 1px rgba(0, 0, 0, 0.2);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);

  z-index: 3;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;

    li {
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      &:last-child {
        margin: 0;
        border: none;
      }
    }
  }
`;

const StyledModalArrow = styled.div`
  position: absolute;
  top: -5px;
  right: 10px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #3c3c3c;
`;

class ConfirmModal extends React.Component<SettingsModalProps> {
  constructor(props: SettingsModalProps) {
    super(props);
  }

  handleConfirm = () => {
    this.props.settingsStore.toggleConfirmations();
  };

  handleTheme = () => {
    this.props.settingsStore.toggleTheme();
  };

  render() {
    return (
      <div>
        <StyledModal>
          <ul>
            <li>
              <CustomCheckbox
                change={this.handleConfirm}
                checked={this.props.settingsStore.confirmations}
                label={`Show confirm window`}
              />
            </li>
            <li>
              <CustomCheckbox
                change={this.handleTheme}
                checked={this.props.settingsStore.theme}
                label={`Dark theme`}
              />
            </li>
            <li>Layout</li>
          </ul>
          <StyledModalArrow />
        </StyledModal>
      </div>
    );
  }
}

export default ConfirmModal;
