import {observer} from 'mobx-react';
import InstrumentPicker from './InstrumentPicker';

export interface InstrumentPickerActions {
  onShowInstrumentPicker?: any;
  onPickInstrument?: (instrument: any) => void;
}

export interface InstrumentPickerProps extends InstrumentPickerActions {
  value: string;
}

const connectedInstrumentPicker = observer(InstrumentPicker);
export {connectedInstrumentPicker as InstrumentPicker};

export {default as InstrumentSelect} from './InstrumentSelect';
export {default as InstrumentPopover} from './InstrumentPopover';
