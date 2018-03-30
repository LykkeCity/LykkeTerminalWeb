import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import {TableHeaderItem} from '.';

interface TableHeaderProps {
  backgroundColor?: string;
  currentSortDirection: string;
  currentSortByParam: string;
  headers: any[];
  onSort: any;
}

interface TableHeaderState {
  widthArr: number[];
}

class TableHeader extends React.Component<TableHeaderProps, TableHeaderState> {
  constructor(props: TableHeaderProps) {
    super(props);
    this.state = {
      widthArr: []
    };
  }

  onResize = (width: number, index: number) => {
    const widthArr = [...this.state.widthArr];
    widthArr[index] = width;

    this.setState({
      widthArr
    });
  };

  render() {
    return (
      <tr>
        {this.props.headers.map((header, index) => (
          <th key={index}>
            <TableHeaderItem
              className={header.className}
              currentSortDirection={this.props.currentSortDirection}
              currentSortByParam={this.props.currentSortByParam}
              sortByParam={header.key}
              style={{
                backgroundColor: this.props.backgroundColor,
                width: this.state.widthArr[index]
              }}
              onSort={this.props.onSort}
            >
              {header.value}
            </TableHeaderItem>
            <ReactResizeDetector
              handleWidth={true}
              // tslint:disable-next-line:jsx-no-lambda
              onResize={width => this.onResize(width, index)}
            />
          </th>
        ))}
      </tr>
    );
  }
}

export default TableHeader;
