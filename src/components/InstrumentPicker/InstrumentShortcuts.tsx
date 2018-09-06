import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import {InstrumentShortcutSelection} from './index';
import {
  OtherShortcuts,
  Shortcut,
  ShortcutList,
  ShortcutTruncatedText
} from './styles';

interface InstrumentShortcutsProps {
  changeValue: any;
  shortcutActiveIndex: null | number;
  shortcuts: string[];
  showInstrumentSelection: boolean;
  onToggleInstrumentSelection: any;
}

class InstrumentShortcuts extends React.Component<InstrumentShortcutsProps> {
  private primeShortcuts: any[];
  private otherShortcuts: any[];
  private shortcutsNum: number = 4;

  constructor(props: InstrumentShortcutsProps) {
    super(props);
  }

  handleClick = (value: string, index: number) => () => {
    this.props.changeValue(value, index);
  };

  handleShortcutSelection = (value: string, index: number) => {
    this.props.changeValue(value, index);

    if (this.props.showInstrumentSelection) {
      setTimeout(this.props.onToggleInstrumentSelection);
    }
  };

  sortShorcuts = () => {
    this.primeShortcuts = this.props.shortcuts.slice(0, this.shortcutsNum);
    if (this.props.shortcuts.length > this.shortcutsNum) {
      this.otherShortcuts = this.props.shortcuts
        .slice(this.shortcutsNum)
        .map((shortcut, index) => ({
          index: this.shortcutsNum + index,
          label: shortcut,
          value: shortcut
        }));
    }
  };

  render() {
    this.sortShorcuts();

    return (
      <ShortcutList>
        {this.primeShortcuts.map((shortcut: string, index: number) => (
          <Shortcut
            className={this.props.shortcutActiveIndex === index ? 'active' : ''}
            key={`shortcutid_${index}`}
            onClick={this.handleClick(shortcut, index)}
          >
            <ShortcutTruncatedText data-tip={shortcut}>
              {shortcut}
            </ShortcutTruncatedText>
          </Shortcut>
        ))}
        {this.otherShortcuts && (
          <OtherShortcuts>
            <InstrumentShortcutSelection
              toggleShortcuts={this.handleShortcutSelection}
              onToggleInstrumentSelection={
                this.props.onToggleInstrumentSelection
              }
              selectedShortcut={this.props.shortcutActiveIndex!}
              shortcuts={this.otherShortcuts}
              showInstrumentSelection={this.props.showInstrumentSelection}
            />
          </OtherShortcuts>
        )}
        <ReactTooltip effect={'solid'} />
      </ShortcutList>
    );
  }
}

export default InstrumentShortcuts;
