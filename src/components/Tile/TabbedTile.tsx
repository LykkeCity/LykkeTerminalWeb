import {computed, observable} from 'mobx';
import {equals} from 'rambda';
import * as React from 'react';
import Unauthorized from '../Unauthorized/Unauthorized';
import {TileContent, TileProps} from './index';
import {TileHeader, TileTitle, TileWrapper} from './Tile';

const TileTab = TileTitle.extend`
  background: ${(p: any) => (p.selected ? '#333' : 'transparent')};
  border-right-color: ${(p: any) => (p.selected ? '#292929' : 'transparent')};
  border-left: 1px solid ${(p: any) => (p.selected ? '#292929' : 'transparent')};
  border-bottom-color: ${(p: any) => (p.selected ? '#333' : 'transparent')};
  cursor: pointer;

  &:first-child {
    border-left: 0 !important;
  }
`;

interface TabbedTileProps extends TileProps {
  tabs: string[];
}

class TabbedTile extends React.Component<TabbedTileProps> {
  @observable selectedIndex = 0;

  // TODO: rethink additionalControls API, should be passed as a child with specific React context
  @computed
  get shouldRenderAdditionalControls() {
    return this.props.isAuth && this.selectedIndex === 1;
  }

  handleSelectTab = (idx: number) => (e: React.MouseEvent<any>) => {
    this.selectedIndex = idx;
  };

  render() {
    const {
      tabs = [],
      children,
      additionalControls,
      authorize,
      isAuth,
      ...props
    } = this.props;
    const shouldRender = !authorize || (authorize && isAuth);
    return (
      <TileWrapper>
        <TileHeader justify="left">
          {tabs.map((tab, idx) => (
            <TileTab
              key={tab}
              selected={equals(idx, this.selectedIndex)}
              onClick={this.handleSelectTab(idx)}
            >
              {tab}
            </TileTab>
          ))}
        </TileHeader>
        <TileContent
          tabs={undefined}
          additionalControls={
            this.shouldRenderAdditionalControls ? additionalControls : undefined
          }
          isAuth={isAuth}
          {...props}
        >
          {shouldRender ? (
            React.Children.map(
              children,
              (child, idx) => (equals(idx, this.selectedIndex) ? child : null)
            )
          ) : (
            <Unauthorized />
          )}
        </TileContent>
      </TileWrapper>
    );
  }
}

export default TabbedTile;
