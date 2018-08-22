import {ClickOutside} from '@lykkex/react-components';
import React from 'react';
import {ChartControlButtonType} from '../../../models';
import {
  ChartControlList,
  ChartControlListItem,
  ControlButton,
  ControlDropdownContainer
} from '../styles';
import {ChartControlButton} from './';

export interface IListItem {
  label: string;
  description: string;
  value: string;
}

export interface ChartDropdownProps {
  controlButtonName: string;
  controlButtonType: ChartControlButtonType;
  items: IListItem[];
  selectedValue: string;
  onClick: (value: string) => void;
}

export interface ChartDropdownState {
  isOpened: boolean;
}

class ChartDropdown extends React.Component<
  ChartDropdownProps,
  ChartDropdownState
> {
  constructor(props: ChartDropdownProps) {
    super(props);

    this.state = {
      isOpened: false
    };
  }

  onToggleDropdown = () => {
    this.state.isOpened
      ? this.setState({isOpened: false})
      : this.setState({isOpened: true});
  };

  onItemSelect = (value: string) => {
    this.props.onClick(value);
    this.onToggleDropdown();
  };

  renderContainer() {
    return this.state.isOpened ? (
      <ClickOutside onClickOutside={this.onToggleDropdown}>
        <ControlDropdownContainer>
          <ChartControlList>
            {this.props.items.map((item: IListItem) => {
              const click = () => this.onItemSelect(item.value);

              return (
                <ChartControlListItem
                  key={item.value}
                  onClick={click}
                  className={
                    this.props.selectedValue === item.value ? 'isActive' : ''
                  }
                >
                  {item.description}
                </ChartControlListItem>
              );
            })}
          </ChartControlList>
        </ControlDropdownContainer>
      </ClickOutside>
    ) : null;
  }

  render() {
    const {controlButtonName, controlButtonType} = this.props;

    return (
      <ControlButton>
        <ChartControlButton
          controlButtonName={controlButtonName}
          controlButtonType={controlButtonType}
          onClick={this.onToggleDropdown}
        />
        {this.renderContainer()}
      </ControlButton>
    );
  }
}

export default ChartDropdown;
