import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {ThemeObject} from '../styled';
import {InstrumentListItem} from './index';
import {InstrumentTableEl} from './styles';

interface InstrumentTableProps {
  baseAsset: AssetModel;
  currentInstrumentId: string;
  instruments: InstrumentModel[];
  onPick: any;
  isAuth: boolean;
  theme: ThemeObject;
}

const InstrumentTable: React.SFC<InstrumentTableProps> = ({
  baseAsset,
  currentInstrumentId,
  instruments,
  onPick,
  isAuth,
  theme
}) => {
  return (
    <InstrumentTableEl>
      <tbody>
        {instruments.map((instrument: any) => (
          <InstrumentListItem
            key={instrument.id}
            baseAsset={baseAsset}
            onPick={onPick}
            inactive={currentInstrumentId !== instrument.id}
            instrument={instrument}
            isAuth={isAuth}
            theme={theme}
          />
        ))}
      </tbody>
    </InstrumentTableEl>
  );
};

export default InstrumentTable;
