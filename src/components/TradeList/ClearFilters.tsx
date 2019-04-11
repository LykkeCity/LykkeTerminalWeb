import * as classnames from 'classnames';
import * as React from 'react';
import {ClearFiltersButton} from './styles';

interface ClearFiltersProps {
  enabled?: boolean;
  setFilter: (period: string, type: string, instrument: string) => void;
}

class ClearFilters extends React.Component<ClearFiltersProps> {
  constructor(props: ClearFiltersProps) {
    super(props);
  }

  clearFilters = () => {
    this.props.setFilter('', '', '');
  };

  render() {
    return (
      <ClearFiltersButton
        className={classnames({clickable: this.props.enabled})}
        onClick={this.clearFilters}
      >
        Clear all filters
      </ClearFiltersButton>
    );
  }
}

export default ClearFilters;
