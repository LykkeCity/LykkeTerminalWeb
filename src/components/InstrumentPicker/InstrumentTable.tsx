import * as React from 'react';
import {AssetModel, InstrumentModel} from '../../models/index';
import {InstrumentListItem} from './index';
import {InstrumentTableEl} from './styles';

interface InstrumentTableProps {
  baseAsset: AssetModel;
  currentInstrumentId: string;
  instruments: InstrumentModel[];
  onPick: any;
  isAuth: boolean;
}

const InstrumentTable: React.SFC<InstrumentTableProps> = ({
  baseAsset,
  currentInstrumentId,
  instruments,
  onPick,
  isAuth
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
          />
        ))}
      </tbody>
    </InstrumentTableEl>
  );
};

export default InstrumentTable;
