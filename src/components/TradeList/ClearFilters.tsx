import * as React from 'react';
import {ClearFiltersButton} from './styles';

interface ClearFiltersProps {
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
      <ClearFiltersButton className="clickable" onClick={this.clearFilters}>
        Clear all filters
      </ClearFiltersButton>
    );
  }
}

export default ClearFilters;
