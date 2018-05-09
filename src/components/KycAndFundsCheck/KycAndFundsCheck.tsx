import * as React from 'react';
import ModalMessages from '../../constants/modalMessages';
import ModalHeader from '../Modal/ModalHeader/ModalHeader';
import {
  KycAndFundsBack,
  MobileAppLink,
  ModalContentWrapper,
  ModalWrapper,
  OkButton
} from '../Modal/styles';
import {CheckBody} from './styles';

interface NoFundsAndKycModalProps {
  signOut: any;
}

const KycAndFundsCheck: React.SFC<NoFundsAndKycModalProps> = () => {
  const redirect = () => {
    location.replace(ModalMessages.NoFundsAndKyc.link.lykke);
  };
  const body = {__html: ModalMessages.NoFundsAndKyc.body};

  return (
    <KycAndFundsBack>
      <ModalWrapper>
        <ModalHeader onClick={redirect}>
          {ModalMessages.NoFundsAndKyc.title}
        </ModalHeader>
        <CheckBody dangerouslySetInnerHTML={body} />
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
    </KycAndFundsBack>
  );
};

export default KycAndFundsCheck;
