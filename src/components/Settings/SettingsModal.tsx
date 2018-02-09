import {rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import CustomCheckbox from '../CustomCheckbox/CustomCheckbox';
import {SettingsModalProps} from './index';

const StyledModal = styled.div`
  font-family: 'Proxima Nova';
  font-size: ${rem(14)};
  position: absolute;
  padding: ${rem(16)} ${rem(13)};
  top: 15px;
  right: -3px;
  width: 230px;
  background-color: #3c3c3c;
  box-shadow: 0 10px 10px 0 #00000033;
  border: solid 1px #00000033;
  border-radius: 10px;
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

        label {
          margin: 0;
        }
      }

      label span {
        background-color: #0388ef;
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

class SettingsModal extends React.Component<SettingsModalProps> {
  constructor(props: SettingsModalProps) {
    super(props);
  }

  preventClose = (e: any) => {
    e.stopPropagation();
  };

  handleConfirm = () => {
    this.props.settingsStore.toggleConfirmations();
  };

  render() {
    return (
      <div onClick={this.preventClose} style={{position: 'relative'}}>
        <StyledModal>
          <ul>
            <li>
              <CustomCheckbox
                change={this.handleConfirm}
                checked={this.props.settingsStore.confirmations}
                label={`Show confirm window`}
              />
            </li>
          </ul>
          <StyledModalArrow />
        </StyledModal>
      </div>
    );
  }
}

export default SettingsModal;
