import {ClickOutside, Switcher} from '@lykkex/react-components';
import React from 'react';
import {IchartIndicator} from '../../../constants/priceChartConstants';
import ModalHeader from '../../Modal/ModalHeader/ModalHeader';
import {
  ControlPopupContainer,
  IndicatorsList,
  IndicatorsListItem,
  IndicatorsSwitcher
} from '../styles';

export interface IndicatorsPopupProps {
  toggleIndicatorsPopup: () => void;
  isIndicatorsPopupShown: boolean;
  indicators: IchartIndicator[];
  toggleIndicator: (indicatorName: string) => void;
}

class IndicatorsPopup extends React.Component<IndicatorsPopupProps> {
  render() {
    const {
      isIndicatorsPopupShown,
      indicators,
      toggleIndicator,
      toggleIndicatorsPopup
    } = this.props;

    return isIndicatorsPopupShown ? (
      <ClickOutside onClickOutside={toggleIndicatorsPopup}>
        <ControlPopupContainer>
          <ModalHeader title={'Indicators'} onClick={toggleIndicatorsPopup} />
          <IndicatorsList>
            {indicators.map((indicator: IchartIndicator) => {
              const toggle = () => toggleIndicator(indicator.value);

              return (
                <IndicatorsListItem key={indicator.value}>
                  <IndicatorsSwitcher>
                    <Switcher
                      onToggle={toggle}
                      checked={indicator.isActive}
                      label={indicator.label}
                    />
                  </IndicatorsSwitcher>
                </IndicatorsListItem>
              );
            })}
          </IndicatorsList>
        </ControlPopupContainer>
      </ClickOutside>
    ) : null;
  }
}

export default IndicatorsPopup;
