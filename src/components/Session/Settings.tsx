import * as React from 'react';
import ChoosableItem from '../ChoosableItem/ChoosableItem';
import CloseButton from '../CloseButton/CloseButton';
// tslint:disable-next-line:ordered-imports
import {Body, CloseBtnPosition, SessionSettings} from './styles';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const sessionDuration = [1, 5, 15, 30];

const DURATION_VALUE = 'min';

interface SettingsProps {
  onSettingsClose: any;
}

const Settings: React.SFC<SettingsProps> = ({onSettingsClose}) => {
  return (
    <SessionSettings>
      <CloseButton
        onClose={onSettingsClose}
        top={CloseBtnPosition.top}
        right={CloseBtnPosition.right}
      />
      <Body>Change the duration of session</Body>
      <Flex>
        {sessionDuration.map((item: number) => (
          <ChoosableItem
            value={item}
            description={DURATION_VALUE}
            isActive={false}
            // tslint:disable-next-line:no-empty
            // tslint:disable-next-line:jsx-no-lambda
            onClick={() => {
              return;
            }}
          />
        ))}
      </Flex>
    </SessionSettings>
  );
};

export default Settings;
