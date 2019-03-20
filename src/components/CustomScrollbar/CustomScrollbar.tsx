import {rem} from 'polished';
import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import {dims} from '../styled';

const defaultHeight = `calc(100% - ${rem(dims.tileHeaderHeight)}`;

const DEFAULT_MARGIN = 17;
const ADDITIONAL_MARGIN = 0.05;

class CustomScrollbar extends React.Component<
  {autoHeight?: boolean; styles?: any; onScrollStop?: any},
  {}
> {
  private scrollRef: any;
  private startMarginRight: any;
  private startMarginBottom: any;

  componentDidMount() {
    window.addEventListener('resize', (e: any) => {
      if (this.scrollRef && !this.startMarginBottom) {
        this.startMarginBottom = (this
          .scrollRef as any).view.style.marginBottom;
      }
      if (this.scrollRef && !this.startMarginRight) {
        this.startMarginRight = (this.scrollRef as any).view.style.marginRight;
      }
      const resizeCoefficient =
        e.currentTarget.devicePixelRatio === 1
          ? 1
          : 1 / e.currentTarget.devicePixelRatio + ADDITIONAL_MARGIN;
      if (this.scrollRef) {
        if (resizeCoefficient === 1) {
          (this
            .scrollRef as any).view.style.marginRight = this.startMarginRight;
          (this
            .scrollRef as any).view.style.marginBottom = this.startMarginBottom;
        } else {
          (this.scrollRef as any).view.style.marginRight = `-${DEFAULT_MARGIN *
            resizeCoefficient}px`;
          (this.scrollRef as any).view.style.marginBottom = `-${DEFAULT_MARGIN *
            resizeCoefficient}px`;
        }
      }
    });
  }

  setScrollbarRef = (scrollbar: any) => (this.scrollRef = scrollbar);

  render() {
    return (
      <Scrollbars
        autoHeight={this.props.autoHeight}
        autoHide={true}
        style={{height: defaultHeight, ...this.props.styles}}
        ref={this.setScrollbarRef}
        onScrollStop={this.props.onScrollStop}
      >
        {this.props.children}
      </Scrollbars>
    );
  }
}

export default CustomScrollbar;
