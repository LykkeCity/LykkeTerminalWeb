import * as React from 'react';
import ModalMessages from '../../constants/modalMessages';
import ModalHeader from '../Modal/ModalHeader/ModalHeader';
import {
  MobileAppLink,
  ModalContentWrapper,
  ModalWrapper,
  OkButton
} from '../Modal/styles';
import {CheckBackground, CheckBody} from './styles';

interface NoFundsAndKycModalProps {
  reset: () => void;
}

const KycAndFundsCheck: React.SFC<NoFundsAndKycModalProps> = ({reset}) => {
  const redirect = () => {
    reset();
    location.replace(ModalMessages.NoFundsAndKyc.link.lykke);
  };

  return (
    <CheckBackground>
      <ModalWrapper>
        <ModalHeader onClick={redirect}>
          {ModalMessages.NoFundsAndKyc.title}
        </ModalHeader>
        <CheckBody
          dangerouslySetInnerHTML={{__html: ModalMessages.NoFundsAndKyc.body}}
        />
        <ModalContentWrapper>
          <MobileAppLink
            href={ModalMessages.NoFundsAndKyc.link.appStore}
            target={'_blank'}
            image={'app-store'}
          />
          <MobileAppLink
            href={ModalMessages.NoFundsAndKyc.link.playMarket}
            target={'_blank'}
            image={'google-play'}
          />
        </ModalContentWrapper>
        <OkButton onClick={redirect}>Got it!</OkButton>
      </ModalWrapper>
    </CheckBackground>
  );
};

export default KycAndFundsCheck;
