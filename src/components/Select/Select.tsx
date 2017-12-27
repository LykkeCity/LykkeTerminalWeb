import * as React from 'react';
import Select2, {ReactSelectProps} from 'react-select';
import 'react-select/dist/react-select.css';

export interface SelectProps extends ReactSelectProps<any> {
  btnId: string;
  options: any[];
  value?: any;
  onChange?: any;
  className?: string;
  toggleSelect: any;
}

class Select extends React.Component<SelectProps> {
  documentClickHandler = (e: any) => {
    const target: any = e.target;
    if (target.closest('.Select') || target.id === this.props.btnId) {
      return;
    }
    this.props.toggleSelect();
  };

  componentDidMount() {
    document.body.addEventListener('click', this.documentClickHandler);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.documentClickHandler);
  }

  render() {
    return (
      <Select2
        value={this.props.value}
        options={this.props.options}
        onChange={this.props.onChange}
        className={this.props.className}
        {...this.props}
      />
    );
  }
}

export default Select;
